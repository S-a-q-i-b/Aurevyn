const crypto = require("crypto");

let redisClient = null;
const memoryCache = new Map();

try {
  if (process.env.REDIS_URL) {
    const Redis = require("ioredis");
    redisClient = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    redisClient.on("error", (error) => console.warn("Redis cache unavailable:", error.message));
    redisClient.connect().catch(() => {});
  }
} catch {
  console.warn("ioredis is not installed. Falling back to in-memory cache.");
}

const hashKey = (key) => crypto.createHash("sha1").update(key).digest("hex");

const getCache = async (key) => {
  const finalKey = `aurevyn:${hashKey(key)}`;

  if (redisClient) {
    try {
      const value = await redisClient.get(finalKey);
      return value ? JSON.parse(value) : null;
    } catch {}
  }

  const entry = memoryCache.get(finalKey);
  if (!entry || entry.expiresAt < Date.now()) {
    memoryCache.delete(finalKey);
    return null;
  }
  return entry.value;
};

const setCache = async (key, value, ttlSeconds = 60) => {
  const finalKey = `aurevyn:${hashKey(key)}`;
  memoryCache.set(finalKey, { value, expiresAt: Date.now() + ttlSeconds * 1000 });

  if (redisClient) {
    try {
      await redisClient.set(finalKey, JSON.stringify(value), "EX", ttlSeconds);
    } catch {}
  }
};

const clearCache = () => memoryCache.clear();

const cacheMiddleware = (ttlSeconds = 60) => async (req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.cookies?.token) return next();

  const key = `${req.originalUrl}`;
  const cached = await getCache(key);
  if (cached) return res.status(cached.statusCode).json(cached.body);

  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      await setCache(key, { statusCode: res.statusCode, body }, ttlSeconds);
    }
    return originalJson(body);
  };

  return next();
};

module.exports = { getCache, setCache, clearCache, cacheMiddleware };

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const orderRoutes = require("./src/routes/order.routes");
const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.routes");
const couponRoutes = require("./src/routes/coupon.routes");
const imagekitRoutes = require("./src/routes/imagekit.routes");

const app = express();

const PORT = process.env.PORT || 5000;

const configuredOrigins = String(process.env.CLIENT_URL || "")
  .split(",")
  .map((value) => value.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    "http://localhost:5173",
    "https://aurevyn-nc683ew22-team-faith1.vercel.app",
  ]),
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error("CORS origin not allowed"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization", "X-Guest-Id"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.set("trust proxy", 1);

app.disable("x-powered-by");

app.use(cors(corsOptions));

app.use(compression({ threshold: 1024 }));

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error("Database unavailable:", error.message);
    return res.status(503).json({
      success: false,
      message: "Database connection unavailable",
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.use("/api/auth/login", loginLimiter);

app.use("/api/auth/register", registerLimiter);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Aurevyn API is running",
  });
});

app.get("/api/health", (req, res) => {
  return res.json({
    success: true,
    message: "Aurevyn API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/cart", cartRoutes);

app.use("/api/coupons", couponRoutes);
app.use("/coupons", couponRoutes);

app.use("/api/imagekit", imagekitRoutes);
app.use("/imagekit", imagekitRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Aurevyn API running on port ${PORT}`);
  });
}

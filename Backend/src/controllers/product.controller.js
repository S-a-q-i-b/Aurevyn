const mongoose = require("mongoose");
const Product = require("../models/Product");
const { clearCache } = require("../utils/cache");

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildFilter = (query) => {
  const {
    search,
    category,
    subcategory,
    gender,
    brand,
    tag,
    minPrice,
    maxPrice,
    featured,
    newArrival,
    bestSeller,
  } = query;
  const filter = { active: true };

  if (search) {
    const safe = String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: safe, $options: "i" } },
      { category: { $regex: safe, $options: "i" } },
      { brand: { $regex: safe, $options: "i" } },
      { tags: { $regex: safe, $options: "i" } },
    ];
  }
  if (category && category !== "All") filter.category = category;
  if (subcategory && subcategory !== "All") filter.subcategory = subcategory;
  if (gender && gender !== "All") filter.gender = gender;
  if (brand && brand !== "All") filter.brand = brand;
  if (tag) filter.tags = String(tag);
  if (featured !== undefined) filter.featured = featured === "true";
  if (newArrival !== undefined) filter.newArrival = newArrival === "true";
  if (bestSeller !== undefined) filter.bestSeller = bestSeller === "true";
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined && Number.isFinite(Number(minPrice)))
      filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined && Number.isFinite(Number(maxPrice)))
      filter.price.$lte = Number(maxPrice);
  }
  return filter;
};

const encodeCursor = (product) =>
  Buffer.from(
    JSON.stringify({ createdAt: product.createdAt, id: product._id }),
  ).toString("base64url");
const decodeCursor = (cursor) =>
  JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));

const getProducts = async (req, res) => {
  try {
    const { sort = "featured", cursor, limit = 12 } = req.query;
    const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const filter = buildFilter(req.query);

    if (sort === "featured") {
      if (cursor) {
        const decoded = decodeCursor(cursor);
        filter.$or = [
          { createdAt: { $lt: new Date(decoded.createdAt) } },
          {
            createdAt: new Date(decoded.createdAt),
            _id: { $lt: new mongoose.Types.ObjectId(decoded.id) },
          },
        ];
      }
      const products = await Product.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(pageSize + 1)
        .lean();
      const hasMore = products.length > pageSize;
      const data = hasMore ? products.slice(0, pageSize) : products;
      return res.json({
        success: true,
        count: data.length,
        products: data,
        nextCursor: hasMore ? encodeCursor(data[data.length - 1]) : null,
      });
    }

    const sortMap = {
      "price-low": { price: 1, _id: 1 },
      "price-high": { price: -1, _id: -1 },
      name: { name: 1, _id: 1 },
    };
    const products = await Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .limit(pageSize)
      .lean();
    return res.json({
      success: true,
      count: products.length,
      products,
      nextCursor: null,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products",
    });
  }
};

const getSearchSuggestions = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json({ success: true, suggestions: [] });
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const products = await Product.find({
      active: true,
      $or: [
        { name: { $regex: safe, $options: "i" } },
        { category: { $regex: safe, $options: "i" } },
        { brand: { $regex: safe, $options: "i" } },
      ],
    })
      .select("name category image slug")
      .limit(8)
      .lean();
    return res.json({ success: true, suggestions: products });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to fetch search suggestions" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      active: true,
    }).populate(
      "relatedProducts",
      "name price image images rating reviewCount",
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res.json({ success: true, product });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product id" });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug) data.slug = slugify(data.name);
    if (!data.images?.length && data.image) data.images = [data.image];
    if (data.variants?.length)
      data.stock = data.variants.reduce(
        (sum, variant) => sum + Number(variant.stock || 0),
        0,
      );
    const product = await Product.create(data);
    clearCache();
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to create product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.name && !data.slug) data.slug = slugify(data.name);
    if (data.variants?.length)
      data.stock = data.variants.reduce(
        (sum, variant) => sum + Number(variant.stock || 0),
        0,
      );
    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    clearCache();
    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true },
  );
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  clearCache();
  return res.json({ success: true, message: "Product archived successfully" });
};

module.exports = {
  getProducts,
  getSearchSuggestions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

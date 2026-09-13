const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, trim: true, uppercase: true },
    size: { type: String, default: "", trim: true },
    color: { type: String, default: "", trim: true },
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number, min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    active: { type: Boolean, default: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    category: { type: String, required: true, trim: true, index: true },
    subcategory: { type: String, default: "", trim: true, index: true },
    brand: { type: String, default: "Aurevyn", trim: true, index: true },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },
    images: { type: [String], default: [] },
    image: { type: String, required: true, trim: true },
    videos: { type: [String], default: [] },
    description: { type: String, default: "", trim: true, maxlength: 5000 },
    specifications: { type: Map, of: String, default: {} },
    fabric: { type: String, default: "", trim: true, maxlength: 500 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    badge: {
      type: String,
      enum: ["New", "Sale", "Featured", "", "Best Seller"],
      default: "",
    },
    featured: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    bestSeller: { type: Boolean, default: false, index: true },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    stock: { type: Number, default: 0, min: 0, index: true },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

productSchema.index({ active: 1, createdAt: -1 });
productSchema.index({ active: 1, gender: 1, category: 1, price: 1 });
productSchema.index({ active: 1, featured: 1, createdAt: -1 });
productSchema.index({ active: 1, newArrival: 1, createdAt: -1 });
productSchema.index({ active: 1, bestSeller: 1, createdAt: -1 });
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  brand: "text",
  tags: "text",
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

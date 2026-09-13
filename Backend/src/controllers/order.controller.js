const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const logActivity = require("../utils/activity");

const orderNumber = () => `AUR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const createOrder = async (req, res) => {
  try {
    const { items = [], shippingAddress, paymentMethod = "cod", couponCode = "" } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    const required = ["firstName", "lastName", "email", "phone", "address", "city"];
    if (!shippingAddress || required.some((field) => !String(shippingAddress[field] || "").trim())) return res.status(400).json({ success: false, message: "Complete shipping address is required" });

    const finalItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, active: true });
      if (!product) return res.status(404).json({ success: false, message: "One of the selected products is no longer available" });
      const quantity = Math.max(Number(item.quantity) || 1, 1);
      const sku = String(item.variantSku || "").toUpperCase();
      const variant = product.variants.find((entry) => entry.sku === sku);
      const available = variant ? variant.stock : product.stock;
      if (available < quantity) return res.status(409).json({ success: false, message: `${product.name} has insufficient stock` });
      const price = Number(variant?.price ?? product.salePrice ?? product.price);
      subtotal += price * quantity;
      finalItems.push({ productId: product._id, variantSku: sku, name: product.name, image: product.images?.[0] || product.image, price, quantity, size: item.size || "", color: item.color || "" });
    }

    let discount = 0;
    let normalizedCoupon = "";
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), active: true });
      const now = new Date();
      if (coupon && coupon.startsAt <= now && (!coupon.expiresAt || coupon.expiresAt >= now) && subtotal >= coupon.minSubtotal && (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit)) {
        discount = coupon.type === "percent" ? Math.min(subtotal * coupon.value / 100, coupon.maxDiscount || Infinity) : Math.min(coupon.value, subtotal);
        normalizedCoupon = coupon.code;
      }
    }

    const shipping = subtotal - discount >= 15000 ? 0 : 500;
    const tax = 0;
    const total = Math.max(0, subtotal - discount + tax + shipping);

    for (const item of finalItems) {
      const product = await Product.findById(item.productId);
      if (item.variantSku) {
        const variantIndex = product.variants.findIndex((entry) => entry.sku === item.variantSku);
        if (variantIndex >= 0) {
          if (product.variants[variantIndex].stock < item.quantity) return res.status(409).json({ success: false, message: `${item.name} went out of stock during checkout` });
          product.variants[variantIndex].stock -= item.quantity;
        }
        product.stock = product.variants.reduce((sum, entry) => sum + entry.stock, 0);
      } else {
        product.stock -= item.quantity;
      }
      await product.save();
    }

    const order = await Order.create({ orderNumber: orderNumber(), user: req.user._id, items: finalItems, shippingAddress, subtotal: Math.round(subtotal), discount: Math.round(discount), tax, shipping, total: Math.round(total), couponCode: normalizedCoupon, paymentMethod });
    if (normalizedCoupon) await Coupon.findOneAndUpdate({ code: normalizedCoupon }, { $inc: { usageCount: 1 } });
    await logActivity(req.user._id, "order_created", `Order ${order.orderNumber} placed`, { orderId: order._id });
    return res.status(201).json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while creating order" });
  }
};

const getMyOrders = async (req, res) => res.json({ success: true, orders: await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean() });

const getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  return res.json({ success: true, order });
};

const adminOrders = async (req, res) => res.json({ success: true, orders: await Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(100).lean() });

const updateOrderStatus = async (req, res) => {
  const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status, ...(req.body.paymentStatus ? { paymentStatus: req.body.paymentStatus } : {}) }, { new: true });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  return res.json({ success: true, order });
};

module.exports = { createOrder, getMyOrders, getOrderById, adminOrders, updateOrderStatus };

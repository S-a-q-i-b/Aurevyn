const Coupon = require("../models/Coupon");

const calculateDiscount = (coupon, subtotal) => {
  if (coupon.type === "percent") {
    const raw = subtotal * (coupon.value / 100);
    return Math.min(raw, coupon.maxDiscount || raw);
  }
  return Math.min(coupon.value, subtotal);
};

const applyCoupon = async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    const subtotal = Number(req.body.subtotal || 0);
    const now = new Date();
    const coupon = await Coupon.findOne({ code, active: true, startsAt: { $lte: now }, $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }] });
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return res.status(409).json({ success: false, message: "Coupon usage limit reached" });
    if (subtotal < coupon.minSubtotal) return res.status(400).json({ success: false, message: `Minimum subtotal is Rs. ${coupon.minSubtotal.toLocaleString("en-PK")}` });
    const discount = Math.round(calculateDiscount(coupon, subtotal));
    return res.json({ success: true, code: coupon.code, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to apply coupon" });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, code: String(req.body.code || "").toUpperCase() });
    return res.status(201).json({ success: true, coupon });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to create coupon" });
  }
};

const listCoupons = async (req, res) => res.json({ success: true, coupons: await Coupon.find().sort({ createdAt: -1 }).lean() });

module.exports = { applyCoupon, createCoupon, listCoupons, calculateDiscount };

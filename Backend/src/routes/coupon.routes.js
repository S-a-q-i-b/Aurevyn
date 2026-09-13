const express = require("express");
const c = require("../controllers/coupon.controller");
const protect = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const router = express.Router();
router.post("/apply", c.applyCoupon);
router.get("/", protect, requireRole("admin"), c.listCoupons);
router.post("/", protect, requireRole("admin"), c.createCoupon);
module.exports = router;

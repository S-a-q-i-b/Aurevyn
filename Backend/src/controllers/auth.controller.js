const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Activity = require("../models/Activity");
const generateToken = require("../utils/generateToken");
const logActivity = require("../utils/activity");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  addresses: user.addresses || [],
  wishlist: user.wishlist || [],
  notificationPreferences: user.notificationPreferences,
  paymentPreferences: user.paymentPreferences,
  deletionRequest: user.deletionRequest,
});

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .toLowerCase()
      .trim();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({ name, email, password });
    await logActivity(user._id, "account_created", "Account created");

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating account",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .toLowerCase()
      .trim();
    const password = String(req.body.password || "");

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);
    await logActivity(user._id, "login", "Successful account login");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ success: true, message: "Logout successful" });
};

const getMe = async (req, res) =>
  res.status(200).json({ success: true, user: publicUser(req.user) });

const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.name === "string") updates.name = req.body.name.trim();
    if (typeof req.body.avatar === "string")
      updates.avatar = req.body.avatar.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    await logActivity(
      req.user._id,
      "profile_updated",
      "Profile details updated",
    );
    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to update profile" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and a new password of at least 6 characters are required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    await logActivity(user._id, "password_changed", "Password changed");
    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to change password" });
  }
};

const listAddresses = async (req, res) =>
  res.json({ success: true, addresses: req.user.addresses || [] });

const addAddress = async (req, res) => {
  try {
    const data = req.body;
    const required = ["firstName", "lastName", "phone", "address", "city"];
    if (required.some((field) => !String(data[field] || "").trim())) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName, phone, address and city are required",
      });
    }

    const user = await User.findById(req.user._id);
    if (data.isDefault || user.addresses.length === 0)
      user.addresses.forEach((address) => (address.isDefault = false));
    user.addresses.push({
      ...data,
      isDefault: Boolean(data.isDefault || user.addresses.length === 0),
    });
    await user.save();
    await logActivity(user._id, "address_added", "Shipping address added");
    return res.status(201).json({
      success: true,
      address: user.addresses[user.addresses.length - 1],
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Add address error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to add address" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    if (req.body.isDefault)
      user.addresses.forEach((item) => (item.isDefault = false));
    Object.assign(address, req.body);
    if (req.body.isDefault) address.isDefault = true;
    await user.save();
    return res.json({ success: true, address, addresses: user.addresses });
  } catch (error) {
    console.error("Update address error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to update address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    const wasDefault = address.isDefault;
    user.addresses.pull(address._id);
    if (wasDefault && user.addresses.length) user.addresses[0].isDefault = true;
    await user.save();
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.error("Delete address error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete address" });
  }
};

const setDefaultAddress = async (req, res) =>
  updateAddress({ ...req, body: { isDefault: true }, params: req.params }, res);

const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  return res.json({ success: true, products: user.wishlist || [] });
};

const toggleWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some((id) => String(id) === String(productId));
    user.wishlist = exists
      ? user.wishlist.filter((id) => String(id) !== String(productId))
      : [...user.wishlist, productId];
    await user.save();
    await logActivity(
      user._id,
      exists ? "wishlist_removed" : "wishlist_added",
      `${exists ? "Removed" : "Added"} product from wishlist`,
      { productId },
    );
    return res.json({
      success: true,
      inWishlist: !exists,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Wishlist error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to update wishlist" });
  }
};

const addRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => String(item.product) !== String(req.params.productId),
    );
    user.recentlyViewed.unshift({
      product: req.params.productId,
      viewedAt: new Date(),
    });
    user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    await user.save();
    return res.json({ success: true });
  } catch (error) {
    console.error("Recently viewed error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save recently viewed product",
    });
  }
};

const getRecentlyViewed = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "recentlyViewed.product",
  );
  return res.json({
    success: true,
    products: (user.recentlyViewed || [])
      .map((item) => item.product)
      .filter(Boolean),
  });
};

const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.notificationPreferences)
      Object.assign(
        user.notificationPreferences,
        req.body.notificationPreferences,
      );
    if (req.body.paymentPreferences)
      Object.assign(user.paymentPreferences, req.body.paymentPreferences);
    await user.save();
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("Preferences error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to update preferences" });
  }
};

const requestDeletion = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.deletionRequest = { requested: true, requestedAt: new Date() };
  await user.save();
  await logActivity(
    user._id,
    "account_deletion_requested",
    "Account deletion requested",
  );
  return res.json({
    success: true,
    message: "Account deletion request received",
  });
};

const getActivity = async (req, res) => {
  const activities = await Activity.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(40)
    .lean();
  return res.json({ success: true, activities });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  toggleWishlist,
  addRecentlyViewed,
  getRecentlyViewed,
  updatePreferences,
  requestDeletion,
  getActivity,
};

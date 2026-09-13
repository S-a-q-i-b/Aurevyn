const Cart = require("../models/Cart");
const Product = require("../models/Product");

const owner = (req) => req.user ? { user: req.user._id } : { guestId: String(req.headers["x-guest-id"] || "") };
const requireGuestId = (req, res) => { if (!req.user && !req.headers["x-guest-id"]) { res.status(400).json({ success: false, message: "x-guest-id header is required for guest cart" }); return false; } return true; };

const getCart = async (req, res) => {
  if (!requireGuestId(req, res)) return;
  let cart = await Cart.findOne(owner(req)).populate("items.product", "name image images price oldPrice salePrice stock variants active");
  if (!cart) cart = await Cart.create({ ...owner(req), items: [] });
  return res.json({ success: true, cart });
};

const upsertItem = async (req, res) => {
  if (!requireGuestId(req, res)) return;
  try {
    const { productId, quantity = 1, size = "", color = "", variantSku = "" } = req.body;
    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const variant = product.variants.find((item) => item.sku === String(variantSku).toUpperCase()) || null;
    const available = variant ? variant.stock : product.stock;
    const price = variant?.price ?? product.salePrice ?? product.price;
    const wanted = Math.max(Number(quantity) || 1, 1);
    const cart = await Cart.findOne(owner(req)) || await Cart.create({ ...owner(req), items: [] });
    const existing = cart.items.find((item) => String(item.product) === String(productId) && item.variantSku === String(variantSku).toUpperCase() && item.size === size && item.color === color);
    const nextQuantity = (existing?.quantity || 0) + wanted;
    if (nextQuantity > available) return res.status(409).json({ success: false, message: `Only ${available} item(s) available in stock` });

    if (existing) existing.quantity = nextQuantity;
    else cart.items.push({ product: product._id, variantSku: String(variantSku).toUpperCase(), size, color, quantity: wanted, name: product.name, image: product.images?.[0] || product.image, price });
    await cart.save();
    return res.json({ success: true, cart });
  } catch (error) {
    console.error("Cart upsert error:", error);
    return res.status(400).json({ success: false, message: "Unable to update cart" });
  }
};

const updateItem = async (req, res) => {
  if (!requireGuestId(req, res)) return;
  const cart = await Cart.findOne(owner(req));
  if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });
  item.quantity = Math.max(Number(req.body.quantity) || 1, 1);
  await cart.save();
  return res.json({ success: true, cart });
};

const removeItem = async (req, res) => {
  if (!requireGuestId(req, res)) return;
  const cart = await Cart.findOne(owner(req));
  if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
  cart.items.pull(req.params.itemId);
  await cart.save();
  return res.json({ success: true, cart });
};

const clearCart = async (req, res) => {
  if (!requireGuestId(req, res)) return;
  const cart = await Cart.findOne(owner(req));
  if (cart) { cart.items = []; await cart.save(); }
  return res.json({ success: true, message: "Cart cleared", cart: cart || { items: [] } });
};

const mergeCart = async (req, res) => {
  const guestId = String(req.headers["x-guest-id"] || "");
  if (!req.user || !guestId) return res.status(400).json({ success: false, message: "Authenticated user and x-guest-id are required" });
  const userCart = await Cart.findOne({ user: req.user._id }) || await Cart.create({ user: req.user._id, items: [] });
  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart) return res.json({ success: true, cart: userCart });

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find((item) => String(item.product) === String(guestItem.product) && item.variantSku === guestItem.variantSku && item.size === guestItem.size && item.color === guestItem.color);
    if (existing) existing.quantity += guestItem.quantity;
    else userCart.items.push(guestItem.toObject({ transform: false }));
  }
  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });
  return res.json({ success: true, cart: userCart });
};

module.exports = { getCart, upsertItem, updateItem, removeItem, clearCart, mergeCart };

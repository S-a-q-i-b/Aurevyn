import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { createOrderApi } from "../../services/orderApi";

import "./Checkout.css";

const formatPrice = (price) => {
  return `Rs. ${Number(price).toLocaleString("en-PK")}`;
};

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, cartCount, cartSubtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const shipping = cartItems.length > 0 && cartSubtotal < 15000 ? 500 : 0;

  const orderTotal = useMemo(() => {
    return cartSubtotal + shipping;
  }, [cartSubtotal, shipping]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your bag is empty.");
      return;
    }

    try {
      setSubmitting(true);

      const orderItems = cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size || "",
        color: item.color || "",
        variantSku: item.variantSku || "",
      }));

      const orderData = {
        items: orderItems,

        shippingAddress: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
        },

        subtotal: cartSubtotal,
        shipping,
        total: orderTotal,

        paymentMethod: "cod",
        couponCode: "",
      };

      const response = await createOrderApi(orderData);

      if (!response?.success || !response?.order) {
        throw new Error(response?.message || "Unable to create your order.");
      }

      setOrderSuccess(response.order);

      clearCart();
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      if (error.response?.status === 401) {
        setSubmitError("Please login to your account before placing an order.");
      } else {
        setSubmitError(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong while placing your order.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <motion.div
            className="checkout-empty__inner"
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="checkout-empty__icon">
              <Check size={30} strokeWidth={1.4} />
            </div>

            <p className="checkout__eyebrow">AUREVYN / ORDER CONFIRMED</p>

            <h1>
              Thank
              <span>you.</span>
            </h1>

            <p className="checkout-empty__description">
              Your order has been placed successfully and is now being prepared
              for you.
            </p>

            <div className="checkout-success__details">
              <span>ORDER</span>

              <strong>
                {orderSuccess._id
                  ? `AUR-${orderSuccess._id.slice(-6).toUpperCase()}`
                  : "AUREVYN ORDER"}
              </strong>
            </div>

            <div className="checkout-success__details">
              <span>TOTAL</span>

              <strong>{formatPrice(orderSuccess.total)}</strong>
            </div>

            <div className="checkout-success__actions">
              <button
                type="button"
                className="checkout-empty__button"
                onClick={() => navigate("/orders")}
              >
                View my orders
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>

              <Link to="/shop" className="checkout-success__shop-link">
                Continue shopping
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <motion.div
            className="checkout-empty__inner"
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="checkout-empty__icon">
              <ShoppingBag size={30} strokeWidth={1.3} />
            </div>

            <p className="checkout__eyebrow">AUREVYN / CHECKOUT</p>

            <h1>
              Your bag is
              <span>empty.</span>
            </h1>

            <p className="checkout-empty__description">
              Add something from the collection before moving into checkout.
            </p>

            <Link to="/shop" className="checkout-empty__button">
              Explore collection
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-hero">
        <div className="checkout-hero__glow" />

        <div className="checkout-hero__inner">
          <div className="checkout-hero__top">
            <Link to="/cart" className="checkout__back">
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to bag
            </Link>

            <span>04 / CHECKOUT</span>
          </div>

          <div className="checkout-hero__content">
            <motion.p
              className="checkout__eyebrow"
              initial={{
                opacity: 0,
                x: -18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              AUREVYN / FINAL EDIT
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: 45,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Move into
              <span>checkout.</span>
            </motion.h1>

            <motion.p
              className="checkout-hero__description"
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
            >
              Complete your details and we&apos;ll prepare your selected pieces
              for delivery.
            </motion.p>

            <motion.div
              className="checkout-hero__meta"
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.5,
              }}
            >
              <span>
                {String(cartCount).padStart(2, "0")}{" "}
                {cartCount === 1 ? "PIECE" : "PIECES"}
              </span>

              <i />

              <span>
                {shipping === 0 ? "COMPLIMENTARY DELIVERY" : "DELIVERY RS. 500"}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="checkout-content">
        <div className="checkout-layout">
          <motion.div
            className="checkout-form-card"
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="checkout-card-header">
              <div>
                <p className="checkout__eyebrow">DELIVERY DETAILS</p>

                <h2>Where should we send it?</h2>
              </div>

              <div className="checkout-secure">
                <LockKeyhole size={14} strokeWidth={1.5} />
                Secure
              </div>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="checkout-form__section">
                <div className="checkout-form__section-title">
                  <span>01</span>
                  <h3>Personal details</h3>
                </div>

                <div className="checkout-grid checkout-grid--two">
                  <div className="checkout-field">
                    <label htmlFor="firstName">First name</label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Saqib"
                      value={formData.firstName}
                      onChange={handleChange}
                    />

                    {errors.firstName && (
                      <span className="checkout-error">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="lastName">Last name</label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Mehmood"
                      value={formData.lastName}
                      onChange={handleChange}
                    />

                    {errors.lastName && (
                      <span className="checkout-error">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="checkout-grid checkout-grid--two">
                  <div className="checkout-field">
                    <label htmlFor="email">Email address</label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />

                    {errors.email && (
                      <span className="checkout-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">Phone number</label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+92 300 0000000"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                    {errors.phone && (
                      <span className="checkout-error">{errors.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="checkout-form__divider" />

              <div className="checkout-form__section">
                <div className="checkout-form__section-title">
                  <span>02</span>
                  <h3>Delivery address</h3>
                </div>

                <div className="checkout-field">
                  <label htmlFor="address">Street address</label>

                  <div className="checkout-input-icon">
                    <MapPin size={15} strokeWidth={1.5} />

                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="House number, street, area"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.address && (
                    <span className="checkout-error">{errors.address}</span>
                  )}
                </div>

                <div className="checkout-grid checkout-grid--city">
                  <div className="checkout-field">
                    <label htmlFor="city">City</label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Gujranwala"
                      value={formData.city}
                      onChange={handleChange}
                    />

                    {errors.city && (
                      <span className="checkout-error">{errors.city}</span>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="postalCode">Postal code</label>

                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      placeholder="52250"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-form__divider" />

              {submitError && (
                <div className="checkout-submit-error">{submitError}</div>
              )}

              <div className="checkout-form__note">
                <Check size={15} strokeWidth={1.7} />

                <p>
                  Your information is only used to process and deliver your
                  AUREVYN order.
                </p>
              </div>

              <motion.button
                type="submit"
                className="checkout-submit"
                disabled={submitting}
                whileHover={
                  !submitting
                    ? {
                        y: -4,
                        gap: 13,
                        backgroundColor: "#d0ad6a",
                      }
                    : {}
                }
                whileTap={
                  !submitting
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }
              >
                {submitting ? "Placing order..." : "Place order"}

                <ArrowRight size={17} strokeWidth={1.5} />
              </motion.button>
            </form>
          </motion.div>

          <motion.aside
            className="checkout-summary"
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="checkout-summary__top">
              <div>
                <p className="checkout__eyebrow">YOUR EDIT</p>

                <h2>Order summary.</h2>
              </div>

              <span>{String(cartCount).padStart(2, "0")}</span>
            </div>

            <div className="checkout-summary__items">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size || "no-size"}-${
                    item.color || "no-color"
                  }`}
                  className="checkout-summary__item"
                >
                  <div className="checkout-summary__image-wrap">
                    <img loading="lazy" decoding="async" src={item.image} alt={item.name} />

                    <span>{item.quantity}</span>
                  </div>

                  <div className="checkout-summary__item-info">
                    <span>{item.category}</span>

                    <h3>{item.name}</h3>

                    {(item.size || item.color) && (
                      <p>
                        {item.size && `Size ${item.size}`}

                        {item.size && item.color && " · "}

                        {item.color}
                      </p>
                    )}
                  </div>

                  <strong>
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary__divider" />

            <div className="checkout-summary__rows">
              <div>
                <span>Subtotal</span>

                <strong>{formatPrice(cartSubtotal)}</strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </strong>
              </div>
            </div>

            <div className="checkout-summary__total">
              <span>Total</span>

              <strong>{formatPrice(orderTotal)}</strong>
            </div>

            <p className="checkout-summary__note">
              Complimentary delivery applies to orders above Rs. 15,000.
            </p>

            <button
              type="button"
              className="checkout-summary__edit"
              onClick={() => navigate("/cart")}
            >
              Edit bag
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </motion.aside>
        </div>
      </section>
    </main>
  );
};

export default Checkout;

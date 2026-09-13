import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import "./Cart.css";

gsap.registerPlugin(ScrollTrigger);

const MotionLink = motion.create(Link);

const formatPrice = (price) => {
  return `Rs. ${Number(price).toLocaleString("en-PK")}`;
};

const Cart = () => {
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const cartRef = useRef(null);

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
  } = useCart();

  const shipping = cartItems.length > 0 && cartSubtotal < 15000 ? 500 : 0;

  const cartTotal = cartSubtotal + shipping;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".cart__hero-glow", {
        x: 70,
        y: -25,
        scale: 1.08,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".cart__hero-orbit", {
        y: 70,
        rotation: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cart__panel",
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cartRef.current,
            start: "top 84%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".cart__summary",
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cartRef.current,
            start: "top 84%",
            once: true,
          },
        },
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [cartItems.length]);

  return (
    <main ref={pageRef} className="cart-page">
      <section ref={heroRef} className="cart__hero">
        <div className="cart__hero-glow" />

        <div className="cart__hero-orbit">
          <span />
          <span />
        </div>

        <div className="cart__hero-inner">
          <div className="cart__hero-top">
            <MotionLink
              to="/shop"
              className="cart__back"
              whileHover={{
                x: -5,
                gap: 12,
                color: "#e7dfd1",
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <ArrowRight
                size={14}
                className="cart__back-icon"
                strokeWidth={1.5}
              />
              Continue shopping
            </MotionLink>

            <span className="cart__hero-index">03 / CART</span>
          </div>

          <div className="cart__hero-content">
            <motion.p
              className="cart__eyebrow"
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
                delay: 0.08,
              }}
            >
              AUREVYN / {cartItems.length > 0 ? "CURRENT EDIT" : "BAG"}
            </motion.p>

            <motion.h1
              className="cart__title"
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
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Your
              <span>bag.</span>
            </motion.h1>

            <motion.p
              className="cart__description"
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.38,
              }}
            >
              {cartItems.length > 0
                ? "Pieces selected with intention. Review your edit before moving into checkout."
                : "The pieces you choose will gather here, ready for the next step."}
            </motion.p>

            <motion.div
              className="cart__hero-meta"
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
                delay: 0.54,
              }}
            >
              <span>
                {String(cartCount).padStart(2, "0")}{" "}
                {cartCount === 1 ? "PIECE" : "PIECES"}
              </span>

              <i />

              <span>
                {cartItems.length === 0
                  ? "READY WHEN YOU ARE"
                  : shipping === 0
                    ? "COMPLIMENTARY DELIVERY"
                    : "DELIVERY FROM RS. 500"}
              </span>
            </motion.div>
          </div>

          <div className="cart__hero-bottom">
            <span>YOUR CURRENT EDIT</span>

            <div className="cart__hero-line" />

            <span>AUREVYN</span>
          </div>
        </div>
      </section>

      <section
        ref={cartRef}
        className={`cart__content ${
          cartItems.length === 0 ? "cart__content--empty" : ""
        }`}
      >
        {cartItems.length === 0 ? (
          <motion.div
            className="cart__empty"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.12,
            }}
          >
            <motion.div
              className="cart__empty-icon"
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShoppingBag size={28} strokeWidth={1.3} />
            </motion.div>

            <p className="cart__eyebrow">YOUR BAG</p>

            <h2>
              Nothing here
              <span>yet.</span>
            </h2>

            <p>
              Explore the collection and bring home something that feels like
              you.
            </p>

            <MotionLink
              to="/shop"
              className="cart__empty-button"
              whileHover={{
                y: -4,
                gap: 13,
                backgroundColor: "#d0ad6a",
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              Explore collection
              <ArrowRight size={16} strokeWidth={1.5} />
            </MotionLink>
          </motion.div>
        ) : (
          <div className="cart__layout">
            <div className="cart__panel">
              <div className="cart__panel-header">
                <div>
                  <p className="cart__eyebrow">SELECTED PIECES</p>
                  <h2>Your edit.</h2>
                </div>

                <button
                  type="button"
                  className="cart__clear"
                  onClick={clearCart}
                >
                  Clear bag
                </button>
              </div>

              <div className="cart__items">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.article
                      key={`${item.id}-${item.size || "no-size"}-${
                        item.color || "no-color"
                      }`}
                      layout
                      className="cart__item"
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -40,
                        scale: 0.97,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="cart__item-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="cart__item-image-wrap">
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          className="cart__item-image"
                          whileHover={{
                            scale: 1.06,
                          }}
                          transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>

                      <div className="cart__item-info">
                        <span className="cart__item-category">
                          {item.category}
                        </span>

                        <h3>{item.name}</h3>

                        <p>{item.gender || "AUREVYN"}</p>

                        <div className="cart__item-meta">
                          {item.size && <span>Size {item.size}</span>}

                          {item.color && <span>{item.color}</span>}
                        </div>
                      </div>

                      <div className="cart__item-controls">
                        <span className="cart__item-label">Quantity</span>

                        <div className="cart__quantity">
                          <motion.button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() =>
                              decreaseQuantity(item.id, item.size, item.color)
                            }
                            whileHover={{
                              scale: 1.08,
                              backgroundColor: "#eee9df",
                            }}
                            whileTap={{
                              scale: 0.9,
                            }}
                          >
                            <Minus size={14} strokeWidth={1.5} />
                          </motion.button>

                          <span>{item.quantity}</span>

                          <motion.button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() =>
                              increaseQuantity(item.id, item.size, item.color)
                            }
                            whileHover={{
                              scale: 1.08,
                              backgroundColor: "#eee9df",
                            }}
                            whileTap={{
                              scale: 0.9,
                            }}
                          >
                            <Plus size={14} strokeWidth={1.5} />
                          </motion.button>
                        </div>
                      </div>

                      <div className="cart__item-total">
                        <strong>
                          {formatPrice(item.price * item.quantity)}
                        </strong>

                        <span>{formatPrice(item.price)} / piece</span>

                        <motion.button
                          type="button"
                          className="cart__remove"
                          onClick={() =>
                            removeFromCart(item.id, item.size, item.color)
                          }
                          whileHover={{
                            x: 3,
                            color: "#a17735",
                          }}
                          whileTap={{
                            scale: 0.92,
                          }}
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                          Remove
                        </motion.button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <motion.aside
              className="cart__summary"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.25,
              }}
            >
              <p className="cart__eyebrow">ORDER SUMMARY</p>

              <h2>Ready when you are.</h2>

              <div className="cart__summary-row">
                <span>Subtotal</span>

                <strong>{formatPrice(cartSubtotal)}</strong>
              </div>

              <div className="cart__summary-row">
                <span>Delivery</span>

                <strong>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </strong>
              </div>

              <div className="cart__summary-line" />

              <div className="cart__summary-total">
                <span>Total</span>

                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <p className="cart__summary-note">
                Delivery is complimentary on orders above Rs. 15,000.
              </p>

              <motion.button
                type="button"
                className="cart__checkout"
                whileHover={{
                  y: -4,
                  gap: 13,
                  backgroundColor: "#d0ad6a",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
                <ArrowRight size={17} strokeWidth={1.5} />
              </motion.button>

              <MotionLink
                to="/shop"
                className="cart__continue"
                whileHover={{
                  gap: 12,
                  color: "#a17735",
                }}
              >
                Continue shopping
                <ArrowRight size={14} strokeWidth={1.5} />
              </MotionLink>
            </motion.aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;

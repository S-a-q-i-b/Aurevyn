import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import "./Wishlist.css";

gsap.registerPlugin(ScrollTrigger);

const MotionLink = motion.create(Link);

const initialWishlist = [
  {
    id: 1,
    name: "Tailored Wool Jacket",
    category: "Outerwear",
    price: 18900,
    oldPrice: 21500,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=90",
  },
  {
    id: 2,
    name: "Relaxed Linen Shirt",
    category: "Shirts",
    price: 12500,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&auto=format&fit=crop&q=90",
  },
  {
    id: 3,
    name: "Straight Cut Trousers",
    category: "Trousers",
    price: 12000,
    oldPrice: 14500,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&auto=format&fit=crop&q=90",
  },
  {
    id: 4,
    name: "Minimal Knit Polo",
    category: "Knitwear",
    price: 9900,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1625910513413-5fc45c0f1e8e?w=900&auto=format&fit=crop&q=90",
  },
  {
    id: 5,
    name: "Structured Overshirt",
    category: "Overshirts",
    price: 16400,
    oldPrice: 17900,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&auto=format&fit=crop&q=90",
  },
  {
    id: 6,
    name: "Classic Cotton Coat",
    category: "Outerwear",
    price: 22900,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=900&auto=format&fit=crop&q=90",
  },
];

const formatPrice = (price) => `PKR ${price.toLocaleString("en-PK")}`;

const Wishlist = () => {
  const { addToCart } = useCart();

  const pageRef = useRef(null);
  const gridRef = useRef(null);

  const [wishlist, setWishlist] = useState(initialWishlist);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wishlist__hero-content",
        {
          opacity: 0.9,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".wishlist__back",
        {
          opacity: 0.9,
          x: -6,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".wishlist__hero-line",
        {
          scaleX: 0.7,
        },
        {
          scaleX: 1,
          duration: 0.55,
          delay: 0.08,
          transformOrigin: "left center",
          ease: "power2.out",
        },
      );

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.querySelectorAll(".wishlist__card"),
          {
            opacity: 0.92,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      gsap.fromTo(
        ".wishlist__cta",
        {
          opacity: 0.92,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".wishlist__cta",
            start: "top 90%",
            once: true,
          },
        },
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [wishlist.length]);

  const removeFromWishlist = (id) => {
    setWishlist((current) => current.filter((item) => item.id !== id));
  };

  if (wishlist.length === 0) {
    return (
      <main ref={pageRef} className="wishlist-page">
        <section className="wishlist__hero wishlist__hero--empty">
          <div className="wishlist__hero-inner">
            <MotionLink
              to="/account"
              className="wishlist__back"
              whileHover={{
                x: -2,
                gap: 10,
              }}
              whileTap={{
                scale: 0.99,
              }}
            >
              <ArrowRight
                size={14}
                className="wishlist__back-icon"
                strokeWidth={1.5}
              />
              Back to account
            </MotionLink>

            <motion.div
              className="wishlist__hero-content"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <p className="wishlist__eyebrow">AUREVYN / WISHLIST</p>

              <h1>
                Your
                <span>edit.</span>
              </h1>

              <p>
                The pieces you've fallen for will live here, ready when the
                moment feels right.
              </p>
            </motion.div>

            <div className="wishlist__hero-line" />
          </div>
        </section>

        <section className="wishlist__content">
          <motion.div
            className="wishlist__empty"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.06,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="wishlist__empty-icon"
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart size={28} strokeWidth={1.3} />
            </motion.div>

            <p className="wishlist__eyebrow">SAVED PIECES</p>

            <h2>
              Nothing here
              <span>yet.</span>
            </h2>

            <p>
              Save the pieces that catch your eye and come back to them whenever
              you are ready.
            </p>

            <MotionLink
              to="/shop"
              className="wishlist__empty-button"
              whileHover={{
                y: -2,
                gap: 11,
              }}
              whileTap={{
                scale: 0.985,
              }}
            >
              Explore collection
              <ArrowRight size={16} strokeWidth={1.5} />
            </MotionLink>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main ref={pageRef} className="wishlist-page">
      <section className="wishlist__hero">
        <div className="wishlist__hero-glow" />

        <div className="wishlist__hero-orbit">
          <span />
          <span />
        </div>

        <div className="wishlist__hero-inner">
          <div className="wishlist__hero-top">
            <MotionLink
              to="/account"
              className="wishlist__back"
              whileHover={{
                x: -2,
                gap: 10,
                color: "#e7dfd1",
              }}
              whileTap={{
                scale: 0.99,
              }}
            >
              <ArrowRight
                size={14}
                className="wishlist__back-icon"
                strokeWidth={1.5}
              />
              Back to account
            </MotionLink>

            <span className="wishlist__hero-index">02 / WISHLIST</span>
          </div>

          <div className="wishlist__hero-content">
            <motion.p
              className="wishlist__eyebrow"
              initial={{
                opacity: 0,
                x: -7,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.04,
                ease: "easeOut",
              }}
            >
              AUREVYN / SAVED PIECES
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.08,
                ease: "easeOut",
              }}
            >
              Your
              <span>edit.</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.14,
                ease: "easeOut",
              }}
            >
              The pieces you've fallen for will live here, ready whenever you're
              ready to make them yours.
            </motion.p>

            <motion.div
              className="wishlist__hero-meta"
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <span>
                {wishlist.length} SAVED{" "}
                {wishlist.length === 1 ? "PIECE" : "PIECES"}
              </span>

              <i />

              <span>CURATED WITH INTENTION</span>
            </motion.div>
          </div>

          <div className="wishlist__hero-bottom">
            <span>YOUR PERSONAL EDIT</span>

            <div className="wishlist__hero-line" />

            <span>AUREVYN</span>
          </div>
        </div>
      </section>

      <section className="wishlist__content">
        <div className="wishlist__content-heading">
          <div>
            <p className="wishlist__eyebrow">SAVED PIECES</p>

            <h2>Things worth keeping.</h2>
          </div>

          <MotionLink
            to="/shop"
            className="wishlist__shop-link"
            whileHover={{
              gap: 10,
            }}
          >
            Discover more
            <ArrowRight size={15} strokeWidth={1.5} />
          </MotionLink>
        </div>

        <div ref={gridRef} className="wishlist__grid">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                className="wishlist__card"
                initial="rest"
                whileHover="hover"
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  y: 8,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                <div className="wishlist__image-wrap">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    whileHover={{
                      scale: 1.035,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                  />

                  <div className="wishlist__image-overlay" />

                  <span className="wishlist__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <motion.button
                    type="button"
                    className="wishlist__remove"
                    aria-label={`Remove ${item.name} from wishlist`}
                    onClick={() => removeFromWishlist(item.id)}
                    whileHover={{
                      scale: 1.03,
                      backgroundColor: "#f1eee6",
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Heart size={17} strokeWidth={1.5} fill="currentColor" />
                  </motion.button>

                  <motion.button
                    type="button"
                    className="wishlist__quick-add"
                    whileHover={{
                      borderRadius: 8,
                      backgroundColor: "#d0ad6a",
                      gap: 9,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    onClick={() => {
                      addToCart(item);
                    }}
                  >
                    <ShoppingBag size={16} strokeWidth={1.6} />
                    <span>Add to bag</span>
                  </motion.button>
                </div>

                <div className="wishlist__card-info">
                  <div>
                    <span className="wishlist__category">{item.category}</span>

                    <h3>{item.name}</h3>
                  </div>

                  <div className="wishlist__price">
                    <strong>{formatPrice(item.price)}</strong>

                    {item.oldPrice && <span>{formatPrice(item.oldPrice)}</span>}
                  </div>
                </div>

                <MotionLink
                  to={`/product/${item.id}`}
                  className="wishlist__view"
                  whileHover={{
                    gap: 10,
                  }}
                >
                  View piece
                  <ArrowRight size={14} strokeWidth={1.5} />
                </MotionLink>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div className="wishlist__cta">
          <div>
            <p className="wishlist__eyebrow">KEEP EXPLORING</p>

            <h3>
              Your next
              <span>favorite awaits.</span>
            </h3>
          </div>

          <MotionLink
            to="/shop"
            className="wishlist__cta-button"
            whileHover={{
              y: -2,
              gap: 11,
              backgroundColor: "#d0ad6a",
            }}
            whileTap={{
              scale: 0.985,
            }}
          >
            Shop AUREVYN
            <ArrowRight size={17} strokeWidth={1.5} />
          </MotionLink>
        </div>
      </section>
    </main>
  );
};

export default Wishlist;

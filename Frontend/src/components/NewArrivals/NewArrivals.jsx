import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProductsApi } from "../../services/productApi";

import "./NewArrivals.css";

gsap.registerPlugin(ScrollTrigger);

const formatPrice = (price) => {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
};

const NewArrivals = () => {
  const sectionRef = useRef(null);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setLoading(true);

        const response = await getProductsApi({
          sort: "featured",
        });

        const normalizedProducts = (response?.products || [])
          .map((product) => ({
            ...product,
            id: product._id,
          }))
          .slice(0, 4);

        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".arrivals__heading",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".arrivals__eyebrow",
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".arrivals__view-all",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        {
          y: 70,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".arrivals__grid",
            start: "top 85%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, products]);

  const handleQuickAdd = (product) => {
    if (!product || Number(product.stock) <= 0) return;

    addToCart({
      ...product,
      id: product.id || product._id,
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
      quantity: 1,
    });
  };

  return (
    <section className="arrivals" ref={sectionRef}>
      <div className="arrivals__container">
        <div className="arrivals__top">
          <div>
            <p className="arrivals__eyebrow">02 / NEW ARRIVALS</p>

            <h2 className="arrivals__heading">
              The latest
              <br />
              <span>from Aurevyn.</span>
            </h2>
          </div>

          <Link to="/shop" className="arrivals__view-all">
            View All
            <ArrowUpRight size={18} strokeWidth={1.6} />
          </Link>
        </div>

        {loading ? (
          <div className="arrivals__loading">
            <span className="arrivals__loading-line" />
            <span className="arrivals__loading-line" />
            <span className="arrivals__loading-line" />
            <span className="arrivals__loading-line" />
          </div>
        ) : products.length === 0 ? (
          <div className="arrivals__empty">
            <p>New arrivals are currently unavailable.</p>
            <Link to="/shop">Explore the shop</Link>
          </div>
        ) : (
          <div className="arrivals__grid">
            {products.map((product) => {
              const productId = product.id || product._id;
              const wishlistActive = isInWishlist(productId);
              const isOutOfStock = Number(product.stock) <= 0;

              return (
                <motion.article
                  className="product-card"
                  key={productId}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <div className="product-card__image-wrapper">
                    <Link
                      to={`/product/${productId}`}
                      className="product-card__image-link"
                    >
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="product-card__image"
                        variants={{
                          rest: {
                            scale: 1,
                          },
                          hover: {
                            scale: 1.055,
                          },
                        }}
                        transition={{
                          duration: 0.75,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />

                      <span className="product-card__image-overlay" />
                    </Link>

                    {product.badge && (
                      <span
                        className={`product-card__badge ${
                          product.badge === "Sale"
                            ? "product-card__badge--sale"
                            : ""
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}

                    {isOutOfStock && (
                      <span className="product-card__stock">Out of stock</span>
                    )}

                    <motion.button
                      type="button"
                      className={`product-card__wishlist ${
                        wishlistActive ? "product-card__wishlist--active" : ""
                      }`}
                      aria-label={
                        wishlistActive
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      onClick={() => toggleWishlist(product)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <Heart
                        size={18}
                        strokeWidth={1.6}
                        fill={wishlistActive ? "currentColor" : "none"}
                      />
                    </motion.button>

                    <motion.button
                      type="button"
                      className={`product-card__quick-add ${
                        isOutOfStock ? "product-card__quick-add--disabled" : ""
                      }`}
                      onClick={() => handleQuickAdd(product)}
                      disabled={isOutOfStock}
                      variants={{
                        rest: {
                          y: 60,
                          opacity: 0.85,
                        },
                        hover: {
                          y: 0,
                          opacity: 1,
                        },
                      }}
                      whileHover={
                        !isOutOfStock
                          ? {
                              backgroundColor: "#c8a96b",
                              color: "#0b0b0b",
                            }
                          : {}
                      }
                      whileTap={
                        !isOutOfStock
                          ? {
                              scale: 0.985,
                            }
                          : {}
                      }
                      aria-label={
                        isOutOfStock
                          ? `${product.name} is out of stock`
                          : `Quick add ${product.name} to cart`
                      }
                    >
                      <ShoppingBag size={16} strokeWidth={1.7} />

                      {isOutOfStock ? "Out of Stock" : "Quick Add"}
                    </motion.button>
                  </div>

                  <div className="product-card__info">
                    <Link
                      to={`/product/${productId}`}
                      className="product-card__name"
                    >
                      {product.name}
                    </Link>

                    <p className="product-card__category">{product.category}</p>

                    <div className="product-card__price-row">
                      <span className="product-card__price">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice && (
                        <span className="product-card__old-price">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProductByIdApi } from "../../services/productApi";
import "./ProductDetails.css";

gsap.registerPlugin(ScrollTrigger);

const formatPrice = (price) => {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
};

const getProductImages = (product) => {
  if (!product) {
    return [];
  }

  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
    product.image2,
    product.image3,
  ].filter(Boolean);

  return [...new Set(images)];
};

const getRating = (product) => {
  const rating = Number(product?.rating);

  if (Number.isFinite(rating) && rating > 0) {
    return Math.min(rating, 5);
  }

  return 4.8;
};

const getReviewCount = (product) => {
  const count = Number(product?.reviewCount);

  if (Number.isFinite(count) && count >= 0) {
    return count;
  }

  return 24;
};

const getBadge = (product) => {
  if (product?.badge) {
    return product.badge;
  }

  if (product?.oldPrice && Number(product.oldPrice) > Number(product.price)) {
    return "Sale";
  }

  return "New";
};

const isHexColor = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim();

  return (
    /^#([0-9A-F]{3}){1,2}$/i.test(normalized) || /^rgba?\(/i.test(normalized)
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const pageRef = useRef(null);
  const topbarRef = useRef(null);
  const visualRef = useRef(null);
  const imageRef = useRef(null);
  const orbitRef = useRef(null);
  const contentRef = useRef(null);
  const bottomCardRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = useMemo(() => {
    return getProductImages(product);
  }, [product]);

  const rating = getRating(product);
  const reviewCount = getReviewCount(product);
  const badge = getBadge(product);

  /*
   * LOAD PRODUCT
   */
  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductByIdApi(id);

        if (!response?.product) {
          throw new Error("Product not found");
        }

        if (cancelled) {
          return;
        }

        const normalizedProduct = {
          ...response.product,
          id: response.product._id,
        };

        setProduct(normalizedProduct);

        if (
          Array.isArray(response.product.sizes) &&
          response.product.sizes.length > 0
        ) {
          setSelectedSize(response.product.sizes[0]);
        } else {
          setSelectedSize("");
        }

        if (
          Array.isArray(response.product.colors) &&
          response.product.colors.length > 0
        ) {
          setSelectedColor(response.product.colors[0]);
        } else {
          setSelectedColor("");
        }

        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("PRODUCT DETAILS ERROR:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load this product.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);


  useEffect(() => {
    if (images.length === 0) {
      setSelectedImage(0);
      return;
    }

    if (selectedImage >= images.length) {
      setSelectedImage(0);
    }
  }, [images, selectedImage]);


  useEffect(() => {
    if (!product || !pageRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },
      });

      intro
        .fromTo(
          topbarRef.current,
          {
            y: -12,
          },
          {
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "transform",
          },
        )
        .fromTo(
          visualRef.current,
          {
            y: 40,
          },
          {
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform",
          },
          "-=0.3",
        )
        .fromTo(
          contentRef.current,
          {
            x: 45,
          },
          {
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform",
          },
          "-=0.65",
        );

      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          rotation: 360,
          duration: 26,
          repeat: -1,
          ease: "none",
        });
      }

      if (imageRef.current && visualRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: visualRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      if (bottomCardRef.current) {
        gsap.fromTo(
          bottomCardRef.current,
          {
            y: 35,
          },
          {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: bottomCardRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, pageRef);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, [product]);

  /*
   * IMAGE CHANGE ANIMATION
   *
   * GSAP only.
   * No Framer Motion opacity/scale conflict.
   */
  useEffect(() => {
    if (!imageRef.current || !images[selectedImage]) {
      return;
    }

    const image = imageRef.current;

    gsap.killTweensOf(image, {
      autoAlpha: true,
      scale: true,
    });

    gsap.fromTo(
      image,
      {
        autoAlpha: 0,
        scale: 1.035,
      },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        overwrite: false,
      },
    );

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [selectedImage, images]);

  const itemSubtotal = useMemo(() => {
    if (!product) {
      return 0;
    }

    return Number(product.price || 0) * quantity;
  }, [product, quantity]);

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    const stock = Number(product.stock) || 0;

    setQuantity((current) => {
      if (stock <= 0) {
        return current;
      }

      return Math.min(current + 1, stock);
    });
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  const handleAddToCart = () => {
    if (!product || Number(product.stock) <= 0) {
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    navigate("/cart");
  };

  const handleImageChange = (index) => {
    if (index === selectedImage) {
      return;
    }

    setSelectedImage(index);
  };

  if (loading) {
    return (
      <main className="product-details product-details--state">
        <section className="product-details__state">
          <div className="product-details__state-art">
            <svg viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#c8a96b"
                strokeWidth="1"
                strokeDasharray="2 8"
              />

              <circle
                cx="60"
                cy="60"
                r="28"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.15"
              />

              <circle cx="60" cy="18" r="2" fill="#c8a96b" />
            </svg>
          </div>

          <p>Loading piece</p>
          <span>Preparing the AUREVYN selection.</span>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details product-details--state">
        <section className="product-details__state">
          <div className="product-details__state-art">
            <svg viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="#c8a96b"
                strokeWidth="1"
              />

              <path
                d="M45 45 L75 75 M75 45 L45 75"
                stroke="#c8a96b"
                strokeWidth="1"
              />
            </svg>
          </div>

          <p>Piece unavailable</p>

          <span>{error || "This product could not be found."}</span>

          <Link to="/shop" className="product-details__state-button">
            Back to collection
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </section>
      </main>
    );
  }

  const productWishlistActive = isInWishlist(product.id || product._id);

  return (
    <main ref={pageRef} className="product-details">
      {/* TOPBAR */}

      <div ref={topbarRef} className="product-details__topbar">
        <Link to="/shop" className="product-details__back">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to collection
        </Link>

        <span>AUREVYN / {product.category || "PIECE"}</span>
      </div>

      {/* MAIN */}

      <section className="product-details__main">
        {/* VISUAL */}

        <div ref={visualRef} className="product-details__visual">
          <div className="product-details__image-stage">
            <div className="product-details__orbit">
              <div ref={orbitRef}>
                <svg viewBox="0 0 500 500">
                  <circle
                    cx="250"
                    cy="250"
                    r="190"
                    fill="none"
                    stroke="rgba(201,169,107,0.13)"
                    strokeWidth="1"
                  />

                  <circle
                    cx="250"
                    cy="250"
                    r="155"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                    strokeDasharray="2 10"
                  />

                  <circle
                    cx="250"
                    cy="250"
                    r="112"
                    fill="none"
                    stroke="rgba(201,169,107,0.1)"
                    strokeWidth="1"
                  />

                  <circle cx="250" cy="58" r="3" fill="#c9a76a" />
                </svg>
              </div>
            </div>

            <div className="product-details__image-wrap">
              <img
                ref={imageRef}
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="product-details__image"
                onLoad={() => ScrollTrigger.refresh()}
              />

              <span className="product-details__image-glint" />

              <span
                className={`product-details__badge ${
                  badge === "Sale" ? "product-details__badge--sale" : ""
                }`}
              >
                {badge}
              </span>

              <motion.button
                type="button"
                className={`product-details__wishlist ${
                  productWishlistActive ? "is-active" : ""
                }`}
                onClick={() => toggleWishlist(product)}
                whileHover={{
                  scale: 1.07,
                  rotate: -5,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                aria-label={
                  productWishlistActive
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  fill={productWishlistActive ? "currentColor" : "none"}
                />
              </motion.button>

              <div className="product-details__image-counter">
                <span>{String(selectedImage + 1).padStart(2, "0")}</span>

                <span>/</span>

                <span>
                  {String(Math.max(images.length, 1)).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* THUMBNAILS */}

          {images.length > 1 && (
            <div className="product-details__thumbnails">
              {images.map((image, index) => (
                <motion.button
                  type="button"
                  key={`${image}-${index}`}
                  className={selectedImage === index ? "is-active" : ""}
                  onClick={() => handleImageChange(index)}
                  whileHover={{
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}

        <div ref={contentRef} className="product-details__info">
          <div className="product-details__eyebrow-row">
            <p className="product-details__eyebrow">
              AUREVYN / {product.category || "COLLECTION"}
            </p>

            <span>{product.gender || "Unisex"}</span>
          </div>

          <h1>{product.name}</h1>

          {/* RATING */}

          <div className="product-details__rating">
            <div className="product-details__stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={13}
                  strokeWidth={1.3}
                  fill={index < Math.round(rating) ? "currentColor" : "none"}
                />
              ))}
            </div>

            <strong>{rating.toFixed(1)}</strong>

            <span>({reviewCount} reviews)</span>
          </div>

          {/* PRICE */}

          <div className="product-details__price">
            <strong>{formatPrice(product.price)}</strong>

            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}

            {product.oldPrice &&
              Number(product.oldPrice) > Number(product.price) && (
                <span className="product-details__discount">
                  {Math.round(
                    ((Number(product.oldPrice) - Number(product.price)) /
                      Number(product.oldPrice)) *
                      100,
                  )}
                  % OFF
                </span>
              )}
          </div>

          <div className="product-details__line" />

          <p className="product-details__description">
            {product.description ||
              "Designed for effortless everyday styling, this AUREVYN piece balances clean proportions, refined details, and modern comfort."}
          </p>

          {/* SIZE */}

          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="product-details__option">
              <div className="product-details__option-head">
                <span>Size</span>
                <span>{selectedSize || "Select size"}</span>
              </div>

              <div className="product-details__choices">
                {product.sizes.map((size) => (
                  <motion.button
                    type="button"
                    key={size}
                    className={
                      selectedSize === size
                        ? "product-details__choice product-details__choice--active"
                        : "product-details__choice"
                    }
                    onClick={() => setSelectedSize(size)}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* COLOR */}

          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="product-details__option">
              <div className="product-details__option-head">
                <span>Color</span>
                <span>{selectedColor || "Select color"}</span>
              </div>

              <div className="product-details__color-choices">
                {product.colors.map((color) => {
                  const colorValue = String(color);
                  const hex = isHexColor(colorValue) ? colorValue : null;
                  const active = selectedColor === color;

                  return (
                    <motion.button
                      type="button"
                      key={colorValue}
                      className={`product-details__color ${
                        active ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      whileHover={{
                        y: -3,
                      }}
                      whileTap={{
                        scale: 0.92,
                      }}
                      aria-label={`Select ${colorValue}`}
                    >
                      <span
                        style={
                          hex
                            ? {
                                background: hex,
                              }
                            : undefined
                        }
                      >
                        {!hex && colorValue}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PURCHASE */}

          <div className="product-details__purchase">
            <div className="product-details__quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus size={15} strokeWidth={1.6} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={increaseQuantity}
                disabled={
                  Number(product.stock) <= 0 ||
                  quantity >= Number(product.stock)
                }
              >
                <Plus size={15} strokeWidth={1.6} />
              </button>
            </div>

            <motion.button
              type="button"
              className="product-details__add"
              onClick={handleAddToCart}
              disabled={Number(product.stock) <= 0}
              whileHover={
                Number(product.stock) > 0
                  ? {
                      y: -3,
                      gap: 13,
                    }
                  : {}
              }
              whileTap={
                Number(product.stock) > 0
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
            >
              <span>
                {Number(product.stock) > 0 ? "Add to bag" : "Out of stock"}
              </span>

              <ShoppingBag size={17} strokeWidth={1.5} />

              <ArrowRight size={14} strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* AVAILABILITY */}

          <div className="product-details__availability">
            <div>
              <Check size={15} strokeWidth={1.6} />

              <span>
                {Number(product.stock) > 0
                  ? `${product.stock} pieces available`
                  : "Currently unavailable"}
              </span>
            </div>

            <span>Complimentary delivery above Rs. 15,000</span>
          </div>

          {/* TOTAL */}

          <div className="product-details__subtotal">
            <span>Selection total</span>
            <strong>{formatPrice(itemSubtotal)}</strong>
          </div>
        </div>
      </section>

      {/* BOTTOM INFO */}

      <section ref={bottomCardRef} className="product-details__bottom-card">
        <div className="product-details__bottom-art">
          <svg viewBox="0 0 360 360">
            <circle
              cx="180"
              cy="180"
              r="135"
              fill="none"
              stroke="rgba(201,169,107,0.15)"
              strokeWidth="1"
            />

            <circle
              cx="180"
              cy="180"
              r="96"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="2 10"
            />

            <path
              d="M180 55v45M180 260v45M55 180h45M260 180h45"
              stroke="#c9a76a"
              strokeWidth="1"
            />

            <circle
              cx="180"
              cy="180"
              r="28"
              fill="none"
              stroke="#c9a76a"
              strokeWidth="1"
            />

            <circle cx="180" cy="180" r="4" fill="#c9a76a" />
          </svg>
        </div>

        <div className="product-details__bottom-content">
          <span>AUREVYN STANDARD</span>

          <h2>
            Designed to be
            <em>kept.</em>
          </h2>

          <p>
            Thoughtful proportions, considered materials and timeless
            silhouettes made for repeat wear.
          </p>

          <div className="product-details__bottom-features">
            <div>
              <Check size={14} />
              Refined construction
            </div>

            <div>
              <Check size={14} />
              Everyday versatility
            </div>

            <div>
              <Check size={14} />
              Complimentary delivery
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;

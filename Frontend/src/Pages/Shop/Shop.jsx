import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronDown,
  Filter,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProductsApi } from "../../services/productApi";
import "./Shop.css";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  "All",
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Jeans",
  "Outerwear",
];

const genders = ["All", "Men", "Women", "Unisex"];

const priceRanges = [
  {
    label: "All Prices",
    value: "all",
  },
  {
    label: "Under Rs. 3,000",
    value: "0-3000",
  },
  {
    label: "Rs. 3,000 - 5,000",
    value: "3000-5000",
  },
  {
    label: "Above Rs. 5,000",
    value: "5000+",
  },
];

const sortOptions = [
  {
    label: "Featured",
    value: "featured",
  },
  {
    label: "Price: Low to High",
    value: "price-low",
  },
  {
    label: "Price: High to Low",
    value: "price-high",
  },
  {
    label: "Name",
    value: "name",
  },
];

const formatPrice = (price) => {
  return `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;
};

const getRating = (product) => {
  const value = Number(product.rating);

  if (Number.isFinite(value) && value > 0) {
    return Math.min(value, 5);
  }

  return 4.8;
};

const getReviewCount = (product) => {
  const value = Number(product.reviewCount);

  if (Number.isFinite(value) && value >= 0) {
    return value;
  }

  return 24;
};

const getProductImages = (product) => {
  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image,
    product.image2,
    product.image3,
  ].filter(Boolean);

  return [...new Set(images)].slice(0, 3);
};

const getProductColors = (product) => {
  if (Array.isArray(product.colors) && product.colors.length) {
    return product.colors;
  }

  return ["#111111", "#d6c5ac", "#f4f1e9"];
};

const getBadge = (product) => {
  if (product.badge) {
    return product.badge;
  }

  if (product.oldPrice && product.oldPrice > product.price) {
    return "Sale";
  }

  return "New";
};

const Shop = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const sortRef = useRef(null);

  const initialCategory = searchParams.get("category");
  const initialSearch = searchParams.get("search") || "";

  const normalizedCategory =
    initialCategory === "new-arrivals" || initialCategory === "sale"
      ? "All"
      : initialCategory
        ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)
        : "All";

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(
    categories.includes(normalizedCategory) ? normalizedCategory : "All",
  );

  const [gender, setGender] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("featured");

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [wishlist, setWishlist] = useState([]);
  const [activeImages, setActiveImages] = useState({});

  /* ======================================
     PRODUCTS
  ====================================== */

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await getProductsApi();

        const normalizedProducts = (response.products || []).map((product) => ({
          ...product,
          id: product._id,
        }));

        setProducts(normalizedProducts);
      } catch (error) {
        console.error("PRODUCT API ERROR:", error);

        setProductsError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load products right now.",
        );
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ======================================
     GSAP
  ====================================== */

  /* ======================================
     OUTSIDE CLICK
  ====================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ======================================
     ESCAPE
  ====================================== */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSortOpen(false);
        setFiltersOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ======================================
     FILTER
  ====================================== */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const lowerSearch = search.toLowerCase().trim();

    if (lowerSearch) {
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";

        const productCategory = product.category?.toLowerCase() || "";

        return (
          name.includes(lowerSearch) || productCategory.includes(lowerSearch)
        );
      });
    }

    if (initialCategory === "new-arrivals") {
      result = result.filter((product) => product.newArrival || product.badge === "New");
    }

    if (initialCategory === "sale") {
      result = result.filter((product) => Number(product.oldPrice || 0) > Number(product.price || 0) || product.badge === "Sale");
    }

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    if (gender !== "All") {
      result = result.filter((product) => product.gender === gender);
    }

    if (priceRange === "0-3000") {
      result = result.filter((product) => Number(product.price) < 3000);
    }

    if (priceRange === "3000-5000") {
      result = result.filter(
        (product) =>
          Number(product.price) >= 3000 && Number(product.price) <= 5000,
      );
    }

    if (priceRange === "5000+") {
      result = result.filter((product) => Number(product.price) > 5000);
    }

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, category, gender, priceRange, sort, initialCategory]);

  /* ======================================
     ACTIONS
  ====================================== */

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const handleCategoryChange = (value) => {
    setCategory(value);

    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: value.toLowerCase(),
      });
    }
  };

  const clearFilters = () => {
    setCategory("All");
    setGender("All");
    setPriceRange("all");
    setSearch("");
    setSort("featured");
    setSearchParams({});
  };

  const handleImageEnter = (productId, imageIndex) => {
    setActiveImages((current) => ({
      ...current,
      [productId]: imageIndex,
    }));
  };

  const handleImageLeave = (productId) => {
    setActiveImages((current) => ({
      ...current,
      [productId]: 0,
    }));
  };

  const selectedSort =
    sortOptions.find((option) => option.value === sort)?.label || "Featured";

  /* ======================================
     FILTER CONTENT
  ====================================== */

  const filterContent = (
    <>
      <div className="shop__sidebar-header">
        <div>
          <span>REFINE</span>
          <h2>Filter</h2>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          aria-label="Close filters"
        >
          <X size={19} strokeWidth={1.5} />
        </button>
      </div>

      <div className="shop__filter-group">
        <h3>Search</h3>

        <div className="shop__search">
          <Search size={16} strokeWidth={1.5} />

          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="shop__filter-group">
        <h3>Category</h3>

        <div className="shop__filter-options">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => handleCategoryChange(item)}
            >
              <span>{item}</span>

              {category === item && <span className="shop__filter-dot">•</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="shop__filter-group">
        <h3>Gender</h3>

        <div className="shop__filter-options">
          {genders.map((item) => (
            <button
              type="button"
              key={item}
              className={gender === item ? "active" : ""}
              onClick={() => setGender(item)}
            >
              <span>{item}</span>

              {gender === item && <span className="shop__filter-dot">•</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="shop__filter-group">
        <h3>Price</h3>

        <div className="shop__filter-options">
          {priceRanges.map((item) => (
            <button
              type="button"
              key={item.value}
              className={priceRange === item.value ? "active" : ""}
              onClick={() => setPriceRange(item.value)}
            >
              <span>{item.label}</span>

              {priceRange === item.value && (
                <span className="shop__filter-dot">•</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="shop__clear" onClick={clearFilters}>
        Clear All Filters
      </button>
    </>
  );

  /* ======================================
     RENDER
  ====================================== */

  return (
    <main ref={pageRef} className="shop" data-scroll-container>
      {/* ======================================
          HERO
      ====================================== */}

      <section ref={heroRef} className="shop__hero" data-scroll-section>
        <div className="shop__hero-image">
          <img
            ref={heroImageRef}
            src="https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=1800&auto=format&fit=crop&q=88"
            alt="Aurevyn clothing collection"
          />
        </div>

        <div className="shop__hero-overlay" />

        <div className="shop__hero-orbit" aria-hidden="true">
          <svg viewBox="0 0 600 600" className="shop__hero-orbit-svg">
            <circle
              cx="300"
              cy="300"
              r="224"
              fill="none"
              stroke="rgba(210,181,125,0.17)"
              strokeWidth="1"
            />

            <circle
              cx="300"
              cy="300"
              r="178"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="2 11"
            />

            <circle
              cx="300"
              cy="300"
              r="132"
              fill="none"
              stroke="rgba(210,181,125,0.12)"
              strokeWidth="1"
            />

            <circle cx="300" cy="76" r="3" fill="#c8a96b" />

            <circle cx="478" cy="300" r="2" fill="#fff" opacity="0.45" />
          </svg>

          <svg viewBox="0 0 340 340" className="shop__hero-orbit-inner">
            <circle
              cx="170"
              cy="170"
              r="102"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="1 8"
            />

            <path
              d="M170 42v25M170 273v25M42 170h25M273 170h25"
              stroke="rgba(200,169,107,0.3)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="shop__container shop__hero-content">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            <p className="shop__eyebrow">AUREVYN / COLLECTION</p>

            <h1 className="shop__title">
              Shop
              <br />
              <span>the collection.</span>
            </h1>

            <p className="shop__description">
              Discover contemporary essentials designed with clean silhouettes,
              refined details, and effortless everyday versatility.
            </p>

            <div className="shop__hero-meta">
              <span>CURATED ESSENTIALS</span>
              <span>08 PIECES</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================
          PRODUCTS
      ====================================== */}

      <section className="shop__products-section" data-scroll-section>
        <div className="shop__container">
          {/* TOOLBAR */}

          <div className="shop__toolbar">
            <div className="shop__toolbar-left">
              <button
                type="button"
                className="shop__filter-toggle"
                onClick={() => {
                  setFiltersOpen((current) => !current);
                  setSortOpen(false);
                }}
              >
                <SlidersHorizontal size={17} strokeWidth={1.5} />
                Filters
              </button>

              <div className="shop__result">
                <span className="shop__result-count">
                  {filteredProducts.length.toString().padStart(2, "0")}
                </span>

                <span>Products</span>
              </div>
            </div>

            <div className="shop__sort" ref={sortRef}>
              <span className="shop__sort-label">Sort by</span>

              <div className="shop__sort-dropdown">
                <button
                  type="button"
                  className={`shop__sort-trigger ${
                    sortOpen ? "shop__sort-trigger--open" : ""
                  }`}
                  onClick={() => {
                    setSortOpen((current) => !current);
                    setFiltersOpen(false);
                  }}
                  aria-expanded={sortOpen}
                >
                  <span>{selectedSort}</span>

                  <motion.span
                    className="shop__sort-icon"
                    animate={{
                      rotate: sortOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >
                    <ChevronDown size={15} strokeWidth={1.5} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      className="shop__sort-menu"
                      initial={{
                        opacity: 0,
                        y: -8,
                        scaleY: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scaleY: 0.95,
                      }}
                      transition={{
                        duration: 0.22,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {sortOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          type="button"
                          className={`shop__sort-option ${
                            sort === option.value
                              ? "shop__sort-option--active"
                              : ""
                          }`}
                          onClick={() => {
                            setSort(option.value);
                            setSortOpen(false);
                          }}
                          whileHover={{
                            x: 4,
                          }}
                        >
                          <span>{option.label}</span>

                          {sort === option.value && <span>•</span>}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="shop__layout">
            {/* MOBILE FILTER */}

            <AnimatePresence>
              {filtersOpen && (
                <>
                  <motion.button
                    type="button"
                    className="shop__sidebar-backdrop"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Close filters"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />

                  <motion.aside
                    className="shop__sidebar shop__sidebar--mobile"
                    initial={{
                      x: "-100%",
                    }}
                    animate={{
                      x: 0,
                    }}
                    exit={{
                      x: "-100%",
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {filterContent}
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            <div className="shop__content">
              {productsLoading ? (
                <div className="shop__loading">
                  <div className="shop__loading-orbit">
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#c8a96b"
                        strokeWidth="1"
                        strokeDasharray="2 7"
                      />

                      <circle
                        cx="50"
                        cy="50"
                        r="23"
                        fill="none"
                        stroke="#111"
                        strokeWidth="1"
                      />

                      <circle cx="50" cy="15" r="2" fill="#c8a96b" />
                    </svg>
                  </div>

                  <span>Curating the collection</span>
                </div>
              ) : productsError ? (
                <div className="shop__error">
                  <Filter size={30} strokeWidth={1.2} />

                  <h2>Collection unavailable</h2>

                  <p>{productsError}</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div layout className="shop__grid">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => {
                      const images = getProductImages(product);

                      const currentImage = activeImages[product.id] ?? 0;

                      const image = images[currentImage] || images[0] || "";

                      const rating = getRating(product);

                      const reviewCount = getReviewCount(product);

                      const badge = getBadge(product);

                      const colors = getProductColors(product);

                      const isWishlisted = wishlist.includes(product.id);

                      return (
                        <motion.article
                          className="shop-product"
                          key={product.id}
                          layout
                          initial={{
                            opacity: 0,
                            y: 35,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: 25,
                          }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.045,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          data-scroll
                          data-scroll-speed={index % 2 === 0 ? "0.05" : "-0.05"}
                        >
                          <div className="shop-product__image-wrapper">
                            <Link
                              to={`/product/${product.id}`}
                              className="shop-product__image-link"
                              onMouseEnter={() =>
                                handleImageEnter(
                                  product.id,
                                  images.length > 1 ? 1 : 0,
                                )
                              }
                              onMouseLeave={() => handleImageLeave(product.id)}
                            >
                              <motion.img
                                key={image}
                                src={image}
                                alt={product.name}
                                className="shop-product__image"
                                initial={{
                                  opacity: 0.4,
                                  scale: 1.025,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                transition={{
                                  duration: 0.42,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              />

                              <span className="shop-product__glint" />
                            </Link>

                            <span
                              className={`shop-product__badge ${
                                badge === "Sale"
                                  ? "shop-product__badge--sale"
                                  : ""
                              }`}
                            >
                              {badge}
                            </span>

                            <div className="shop-product__top-meta">
                              <span>0{index + 1}</span>
                            </div>

                            <motion.button
                              type="button"
                              className={`shop-product__wishlist ${
                                isWishlisted
                                  ? "shop-product__wishlist--active"
                                  : ""
                              }`}
                              onClick={() => toggleWishlist(product.id)}
                              whileTap={{
                                scale: 0.84,
                              }}
                              aria-label={`Add ${product.name} to wishlist`}
                            >
                              <Heart
                                size={18}
                                strokeWidth={1.5}
                                fill={isWishlisted ? "currentColor" : "none"}
                              />
                            </motion.button>

                            {images.length > 1 && (
                              <div className="shop-product__image-dots">
                                {images.map((imageItem, imageIndex) => (
                                  <button
                                    key={imageItem}
                                    type="button"
                                    className={
                                      currentImage === imageIndex
                                        ? "active"
                                        : ""
                                    }
                                    onMouseEnter={() =>
                                      handleImageEnter(product.id, imageIndex)
                                    }
                                    onFocus={() =>
                                      handleImageEnter(product.id, imageIndex)
                                    }
                                    aria-label={`View image ${imageIndex + 1}`}
                                  />
                                ))}
                              </div>
                            )}

                            <motion.button
                              type="button"
                              className="shop-product__quick-add"
                              whileTap={{
                                scale: 0.97,
                              }}
                              onClick={() => {
                                addToCart(product);
                              }}
                              transition={{
                                duration:0.5
                              }}
                              whileHover={{
                                borderRadius:10,
                                borderColor:"gray"
                              }}
                            >
                              <ShoppingBag size={15} strokeWidth={1.5} />

                              <span>Add to Cart</span>

                              <ChevronDown
                                className="shop-product__quick-add-arrow"
                                size={13}
                                strokeWidth={1.5}
                              />
                            </motion.button>
                          </div>

                          <div className="shop-product__info">
                            <div className="shop-product__topline">
                              <p className="shop-product__meta">
                                {product.gender || "Unisex"} /{" "}
                                {product.category || "Collection"}
                              </p>

                              <div className="shop-product__rating">
                                <span>{rating.toFixed(1)}</span>

                                <div className="shop-product__stars">
                                  {Array.from({
                                    length: 5,
                                  }).map((_, starIndex) => (
                                    <Star
                                      key={starIndex}
                                      size={10}
                                      strokeWidth={1.3}
                                      fill={
                                        starIndex < Math.round(rating)
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  ))}
                                </div>

                                <small>({reviewCount})</small>
                              </div>
                            </div>

                            <Link
                              to={`/product/${product.id}`}
                              className="shop-product__name"
                            >
                              {product.name}
                            </Link>

                            <div className="shop-product__bottom">
                              <div className="shop-product__price">
                                <span>{formatPrice(product.price)}</span>

                                {product.oldPrice && (
                                  <del>{formatPrice(product.oldPrice)}</del>
                                )}
                              </div>

                              <div className="shop-product__colors">
                                {colors.slice(0, 3).map((color, colorIndex) => (
                                  <span
                                    key={`${product.id}-${colorIndex}`}
                                    style={{
                                      background: color,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  className="shop__empty"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <div className="shop__empty-art">
                    <svg viewBox="0 0 140 140">
                      <circle
                        cx="70"
                        cy="70"
                        r="45"
                        fill="none"
                        stroke="#c8a96b"
                        strokeWidth="1"
                      />

                      <circle
                        cx="70"
                        cy="70"
                        r="29"
                        fill="none"
                        stroke="#111"
                        strokeWidth="1"
                        strokeDasharray="2 7"
                      />

                      <path
                        d="M48 70h44M70 48v44"
                        stroke="#c8a96b"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>

                  <h2>No products found</h2>

                  <p>Try changing your search or removing some filters.</p>

                  <button type="button" onClick={clearFilters}>
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;

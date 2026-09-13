import { motion } from "framer-motion";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LocomotiveScroll from "locomotive-scroll";

import { useAuth } from "../../../context/AuthContext";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
} from "../../../services/productApi";

import { uploadImageKitApi } from "../../../services/imageKitApi";

import "./AdminProducts.css";

gsap.registerPlugin(ScrollTrigger);

const createInitialVariant = () => ({
  sku: "",
  size: "",
  color: "",
  stock: "",
  price: "",
  oldPrice: "",
  active: true,
});

const initialForm = {
  name: "",
  category: "",
  subcategory: "",
  brand: "Aurevyn",
  gender: "Unisex",
  price: "",
  oldPrice: "",
  salePrice: "",
  image: "",
  images: "",
  videos: "",
  description: "",
  fabric: "",
  sizes: "",
  colors: "",
  tags: "",
  badge: "",
  featured: false,
  newArrival: false,
  bestSeller: false,
  stock: "",
  variants: [],
};

const AdminProducts = () => {
  const { user, loading: authLoading } = useAuth();

  const navigate = useNavigate();

  const pageRef = useRef(null);

  const scrollRef = useRef(null);

  const heroRef = useRef(null);

  const svgRef = useRef(null);

  const locoScrollRef = useRef(null);

  const scrollTriggerUpdateRef = useRef(null);

  const uploadInputRef = useRef(null);

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [editingProductId, setEditingProductId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [imagePreview, setImagePreview] = useState("");

  const [selectedImageName, setSelectedImageName] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /* =========================
     AUTH
  ========================= */

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [user, authLoading, navigate]);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProductsApi({
        limit: 50,
        sort: "featured",
      });

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadProducts();
    }
  }, [user]);

  /* =========================
     LOCOMOTIVE + GSAP
  ========================= */

  useLayoutEffect(() => {
    if (authLoading || !user || user.role !== "admin") {
      return undefined;
    }

    const page = pageRef.current;

    const scrollContainer = scrollRef.current;

    if (!page || !scrollContainer) {
      return undefined;
    }

    let locoScroll = null;

    const ctx = gsap.context(() => {
      locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        lerp: 0.08,
        multiplier: 0.9,

        smartphone: {
          smooth: true,
        },

        tablet: {
          smooth: true,
        },
      });

      locoScrollRef.current = locoScroll;

      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          if (arguments.length) {
            locoScroll?.scrollTo(value, {
              duration: 0,
              disableLerp: true,
            });
          }

          return locoScroll?.scroll?.instance?.scroll?.y || 0;
        },

        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },

        pinType: scrollContainer.style.transform ? "transform" : "fixed",
      });

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(".admin-animate-item"),
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
          },
        );
      }

      if (svgRef.current) {
        const svg = svgRef.current;

        const path = svg.querySelector(".admin-orbit-path");

        const ring = svg.querySelector(".admin-orbit-ring");

        const dots = svg.querySelectorAll(".admin-orbit-dot");

        if (path) {
          const length = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.6,
            ease: "power2.inOut",
          });
        }

        if (ring) {
          gsap.to(ring, {
            rotation: 360,
            transformOrigin: "50% 50%",
            duration: 18,
            repeat: -1,
            ease: "none",
          });
        }

        if (dots.length) {
          gsap.to(dots, {
            scale: 1.35,
            opacity: 0.4,
            duration: 1.1,
            repeat: -1,
            yoyo: true,
            stagger: 0.18,
            ease: "sine.inOut",
          });
        }
      }

      gsap.utils.toArray(".admin-gsap-section").forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 55,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",

            scrollTrigger: {
              trigger: section,
              scroller: scrollContainer,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray(".admin-product-item").forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            delay: index * 0.04,
            ease: "power3.out",

            scrollTrigger: {
              trigger: item,
              scroller: scrollContainer,
              start: "top 92%",
              once: true,
            },
          },
        );
      });

      scrollTriggerUpdateRef.current = () => {
        locoScroll?.update();
      };

      ScrollTrigger.addEventListener("refresh", scrollTriggerUpdateRef.current);

      ScrollTrigger.refresh();
    }, page);

    return () => {
      if (scrollTriggerUpdateRef.current) {
        ScrollTrigger.removeEventListener(
          "refresh",
          scrollTriggerUpdateRef.current,
        );

        scrollTriggerUpdateRef.current = null;
      }

      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.scroller === scrollContainer) {
          trigger.kill();
        }
      });

      locoScroll?.destroy();

      locoScrollRef.current = null;

      ctx.revert();
    };
  }, [user, authLoading]);

  /* =========================
     FORM
  ========================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
   IMAGEKIT UPLOAD
========================= */

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP and AVIF images are allowed.");

      event.target.value = "";
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("Image must be smaller than 25MB.");

      event.target.value = "";
      return;
    }

    let previewUrl = "";

    try {
      setError("");
      setMessage("");
      setUploadingImage(true);
      setUploadProgress(0);
      setSelectedImageName(file.name);

      /* =========================
       LOCAL PREVIEW
    ========================= */

      previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      /* =========================
       UPLOAD TO AUREVYN BACKEND
    ========================= */

      const data = await uploadImageKitApi(file, (progress) => {
        setUploadProgress(progress);
      });

      if (!data?.success || !data?.image?.url) {
        throw new Error(data?.message || "ImageKit upload failed.");
      }

      /* =========================
       SAVE IMAGE URL
    ========================= */

      setForm((current) => {
        const currentImages = splitValues(current.images);

        const nextImages = [
          data.image.url,
          ...currentImages.filter(
            (url) => url !== current.image && url !== data.image.url,
          ),
        ];

        return {
          ...current,
          image: data.image.url,
          images: nextImages.join(", "),
        };
      });

      /* =========================
       SUCCESS
    ========================= */

      setImagePreview(data.image.url);

      setSelectedImageName(file.name);

      setUploadProgress(100);

      setMessage("Image uploaded successfully to ImageKit.");
    } catch (error) {
      console.error("ImageKit upload error:", error);

      /*
      Keep the preview visible.
    */

      setUploadProgress(0);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to upload image.",
      );
    } finally {
      setUploadingImage(false);

      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  };

  /* =========================
     VARIANTS
  ========================= */

  const handleVariantChange = (index, event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => {
      const variants = [...current.variants];

      variants[index] = {
        ...variants[index],

        [name]: type === "checkbox" ? checked : value,
      };

      return {
        ...current,
        variants,
      };
    });
  };

  const addVariant = () => {
    setForm((current) => ({
      ...current,

      variants: [...current.variants, createInitialVariant()],
    }));
  };

  const removeVariant = (index) => {
    setForm((current) => ({
      ...current,

      variants: current.variants.filter(
        (_, variantIndex) => variantIndex !== index,
      ),
    }));
  };

  /* =========================
     HELPERS
  ========================= */

  const splitValues = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const validateVariants = () => {
    const usedSkus = new Set();

    for (let index = 0; index < form.variants.length; index++) {
      const variant = form.variants[index];

      const sku = variant.sku.trim().toUpperCase();

      if (!sku) {
        return `Variant ${index + 1}: SKU is required.`;
      }

      if (usedSkus.has(sku)) {
        return `Variant ${index + 1}: duplicate SKU "${sku}".`;
      }

      usedSkus.add(sku);

      if (variant.stock === "" || Number(variant.stock) < 0) {
        return `Variant ${index + 1}: enter valid stock.`;
      }

      if (variant.price !== "" && Number(variant.price) < 0) {
        return `Variant ${index + 1}: invalid price.`;
      }

      if (variant.oldPrice !== "" && Number(variant.oldPrice) < 0) {
        return `Variant ${index + 1}: invalid old price.`;
      }
    }

    return null;
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (product) => {
    setEditingProductId(product._id);

    setMessage("");
    setError("");

    setImagePreview(product.image || "");

    setSelectedImageName(product.image ? "Current ImageKit image" : "");

    setForm({
      name: product.name || "",

      category: product.category || "",

      subcategory: product.subcategory || "",

      brand: product.brand || "Aurevyn",

      gender: product.gender || "Unisex",

      price:
        product.price !== undefined && product.price !== null
          ? String(product.price)
          : "",

      oldPrice:
        product.oldPrice !== undefined && product.oldPrice !== null
          ? String(product.oldPrice)
          : "",

      salePrice:
        product.salePrice !== undefined && product.salePrice !== null
          ? String(product.salePrice)
          : "",

      image: product.image || "",

      images: Array.isArray(product.images) ? product.images.join(", ") : "",

      videos: Array.isArray(product.videos) ? product.videos.join(", ") : "",

      description: product.description || "",

      fabric: product.fabric || "",

      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",

      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",

      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",

      badge: product.badge || "",

      featured: Boolean(product.featured),

      newArrival: Boolean(product.newArrival),

      bestSeller: Boolean(product.bestSeller),

      stock:
        product.stock !== undefined && product.stock !== null
          ? String(product.stock)
          : "",

      variants: Array.isArray(product.variants)
        ? product.variants.map((variant) => ({
            sku: variant.sku || "",

            size: variant.size || "",

            color: variant.color || "",

            stock:
              variant.stock !== undefined && variant.stock !== null
                ? String(variant.stock)
                : "",

            price:
              variant.price !== undefined && variant.price !== null
                ? String(variant.price)
                : "",

            oldPrice:
              variant.oldPrice !== undefined && variant.oldPrice !== null
                ? String(variant.oldPrice)
                : "",

            active: variant.active !== false,
          }))
        : [],
    });

    requestAnimationFrame(() => {
      locoScrollRef.current?.scrollTo(0, {
        duration: 900,
        disableLerp: true,
      });
    });
  };

  /* =========================
     CANCEL
  ========================= */

  const cancelEdit = () => {
    setEditingProductId(null);

    setForm(initialForm);

    setImagePreview("");

    setSelectedImageName("");

    setUploadProgress(0);

    setMessage("");
    setError("");
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");

      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");

      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Please enter a valid price.");

      return;
    }

    if (!form.image.trim()) {
      setError("Main product image is required.");

      return;
    }

    const variantError = validateVariants();

    if (variantError) {
      setError(variantError);

      return;
    }

    try {
      setSaving(true);

      const variants = form.variants.map((variant) => ({
        sku: variant.sku.trim().toUpperCase(),

        size: variant.size.trim(),

        color: variant.color.trim(),

        stock: Number(variant.stock) || 0,

        price: variant.price !== "" ? Number(variant.price) : undefined,

        oldPrice: variant.oldPrice !== "" ? Number(variant.oldPrice) : null,

        active: variant.active,
      }));

      const totalVariantStock = variants.reduce(
        (total, variant) => total + Number(variant.stock || 0),
        0,
      );

      const productData = {
        name: form.name.trim(),

        category: form.category.trim(),

        subcategory: form.subcategory.trim(),

        brand: form.brand.trim() || "Aurevyn",

        gender: form.gender,

        price: Number(form.price),

        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,

        salePrice: form.salePrice ? Number(form.salePrice) : null,

        image: form.image.trim(),

        images: form.images ? splitValues(form.images) : [form.image.trim()],

        videos: form.videos ? splitValues(form.videos) : [],

        description: form.description.trim(),

        fabric: form.fabric.trim(),

        sizes: splitValues(form.sizes),

        colors: splitValues(form.colors),

        tags: splitValues(form.tags),

        badge: form.badge,

        featured: form.featured,

        newArrival: form.newArrival,

        bestSeller: form.bestSeller,

        stock:
          variants.length > 0 ? totalVariantStock : Number(form.stock) || 0,

        variants,
      };

      const data = editingProductId
        ? await updateProductApi(editingProductId, productData)
        : await createProductApi(productData);

      if (!data.success) {
        throw new Error(data.message || "Product operation failed.");
      }

      setMessage(
        editingProductId
          ? "Product updated successfully."
          : "Product added successfully.",
      );

      setForm(initialForm);

      setEditingProductId(null);

      setImagePreview("");

      setSelectedImageName("");

      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to save product.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(productId);

      setError("");
      setMessage("");

      const data = await deleteProductApi(productId);

      if (!data.success) {
        throw new Error(data.message || "Delete failed.");
      }

      if (editingProductId === productId) {
        cancelEdit();
      }

      setMessage("Product archived successfully.");

      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete product.",
      );
    } finally {
      setDeleting(null);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (authLoading || loading) {
    return (
      <main className="admin-products-page">
        <div className="admin-products-loading">
          <span />
          <p>Loading Aurevyn Admin...</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="admin-products-page" ref={pageRef}>
      <div
        className="admin-scroll-wrapper"
        data-scroll-container
        ref={scrollRef}
      >
        <div className="admin-products-container">
          {/* HERO */}

          <header className="admin-products-header" ref={heroRef}>
            <div className="admin-header-copy">
              <span className="admin-eyebrow admin-animate-item">
                AUREVYN / ADMIN SYSTEM
              </span>

              <h1 className="admin-animate-item">
                Product
                <em> Studio.</em>
              </h1>

              <p className="admin-animate-item">
                Build, control and curate the Aurevyn collection.
              </p>

              <div className="admin-header-meta admin-animate-item">
                <span>{products.length} PRODUCTS</span>

                <i />

                <span>ADMIN ACCESS</span>
              </div>
            </div>

            {/* SVG */}

            <div className="admin-visual" aria-hidden="true">
              <svg
                ref={svgRef}
                className="admin-orbit-svg"
                viewBox="0 0 500 500"
                fill="none"
              >
                <circle
                  className="admin-orbit-ring"
                  cx="250"
                  cy="250"
                  r="178"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="3 12"
                />

                <circle
                  cx="250"
                  cy="250"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.3"
                />

                <path
                  className="admin-orbit-path"
                  d="
                    M84 302
                    C118 194 171 132 254 137
                    C334 141 401 202 421 280
                    C441 358 369 411 296 404
                    C198 395 137 360 84 302Z
                  "
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="
                    M127 349
                    C157 292 205 255 260 252
                    C319 249 354 275 383 327
                  "
                  stroke="currentColor"
                  strokeWidth="0.6"
                  opacity="0.35"
                />

                <circle
                  className="admin-orbit-dot"
                  cx="84"
                  cy="302"
                  r="4"
                  fill="currentColor"
                />

                <circle
                  className="admin-orbit-dot"
                  cx="254"
                  cy="137"
                  r="4"
                  fill="currentColor"
                />

                <circle
                  className="admin-orbit-dot"
                  cx="421"
                  cy="280"
                  r="4"
                  fill="currentColor"
                />

                <circle
                  className="admin-orbit-dot"
                  cx="296"
                  cy="404"
                  r="4"
                  fill="currentColor"
                />

                <text
                  x="250"
                  y="245"
                  textAnchor="middle"
                  fill="currentColor"
                  className="admin-svg-brand"
                >
                  AUREVYN
                </text>

                <text
                  x="250"
                  y="268"
                  textAnchor="middle"
                  fill="currentColor"
                  className="admin-svg-sub"
                >
                  COLLECTION SYSTEM
                </text>
              </svg>
            </div>

            <Link to="/shop" className="admin-back-link admin-animate-item">
              View Shop →
            </Link>
          </header>

          {/* MESSAGES */}

          {message && (
            <motion.div
              className="admin-message admin-message--success"
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <span>✓</span>

              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              className="admin-message admin-message--error"
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <span>!</span>

              {error}
            </motion.div>
          )}

          {/* MAIN */}

          <section className="admin-product-layout">
            {/* FORM */}

            <form className="admin-product-form" onSubmit={handleSubmit}>
              {/* IDENTITY */}

              <section className="admin-gsap-section">
                {editingProductId && (
                  <motion.div
                    className="admin-editing-indicator"
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                  >
                    EDITING EXISTING PRODUCT
                  </motion.div>
                )}

                <div className="admin-section-title">
                  <span>01</span>

                  <h2>
                    {editingProductId ? "Edit Product" : "Product Identity"}
                  </h2>
                </div>

                <div className="admin-form-grid">
                  <label>
                    Product Name *
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Essential Oversized Tee"
                    />
                  </label>

                  <label>
                    Brand
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="Aurevyn"
                    />
                  </label>

                  <label>
                    Category *
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="T-Shirts"
                    />
                  </label>

                  <label>
                    Subcategory
                    <input
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      placeholder="Oversized"
                    />
                  </label>

                  <label>
                    Gender *
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="Men">Men</option>

                      <option value="Women">Women</option>

                      <option value="Unisex">Unisex</option>
                    </select>
                  </label>

                  <label>
                    Badge
                    <select
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                    >
                      <option value="">None</option>

                      <option value="New">New</option>

                      <option value="Sale">Sale</option>

                      <option value="Featured">Featured</option>

                      <option value="Best Seller">Best Seller</option>
                    </select>
                  </label>

                  <label>
                    Price *
                    <input
                      type="number"
                      min="0"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="4999"
                    />
                  </label>

                  <label>
                    Old Price
                    <input
                      type="number"
                      min="0"
                      name="oldPrice"
                      value={form.oldPrice}
                      onChange={handleChange}
                      placeholder="5999"
                    />
                  </label>

                  <label>
                    Sale Price
                    <input
                      type="number"
                      min="0"
                      name="salePrice"
                      value={form.salePrice}
                      onChange={handleChange}
                      placeholder="4499"
                    />
                  </label>

                  <label>
                    Stock
                    <input
                      type="number"
                      min="0"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="25"
                      disabled={form.variants.length > 0}
                    />
                    {form.variants.length > 0 && (
                      <small>Calculated from variants.</small>
                    )}
                  </label>
                </div>
              </section>

              {/* MEDIA */}

              <section className="admin-gsap-section">
                <div className="admin-section-title">
                  <span>02</span>

                  <h2>Media Direction</h2>
                </div>

                <div className="admin-form-stack">
                  {/* IMAGEKIT */}

                  <div className="admin-image-upload">
                    <label>Main Product Image *</label>

                    <label className="admin-upload-zone">
                      <input
                        ref={uploadInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />

                      <span className="admin-upload-icon">↑</span>

                      <strong>
                        {uploadingImage
                          ? `Uploading ${uploadProgress}%`
                          : "Choose Product Image"}
                      </strong>

                      <small>
                        JPG · PNG · WEBP · AVIF
                        <br />
                        Maximum 25MB
                      </small>
                    </label>

                    {uploadingImage && (
                      <div className="admin-upload-progress">
                        <span
                          style={{
                            width: `${uploadProgress}%`,
                          }}
                        />
                      </div>
                    )}

                    {(imagePreview || form.image) && (
                      <motion.div
                        className="admin-image-preview"
                        initial={{
                          opacity: 0,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                      >
                        <img
                          src={imagePreview || form.image}
                          alt="Product preview"
                        />

                        <div>
                          <span>
                            IMAGEKIT
                            {uploadingImage ? " / UPLOADING" : " / READY"}
                          </span>

                          <strong>{selectedImageName}</strong>
                        </div>
                      </motion.div>
                    )}

                    {form.image && (
                      <small className="admin-upload-success">
                        ✓ Main image connected to product
                      </small>
                    )}
                  </div>

                  <label>
                    More Images
                    <input
                      name="images"
                      value={form.images}
                      onChange={handleChange}
                      placeholder="URL 1, URL 2, URL 3"
                    />
                    <small>
                      Uploaded ImageKit URLs can also be added here.
                    </small>
                  </label>

                  <label>
                    Product Videos
                    <input
                      name="videos"
                      value={form.videos}
                      onChange={handleChange}
                      placeholder="https://example.com/video.mp4"
                    />
                  </label>
                </div>
              </section>

              {/* DETAILS */}

              <section className="admin-gsap-section">
                <div className="admin-section-title">
                  <span>03</span>

                  <h2>Product Details</h2>
                </div>

                <div className="admin-form-stack">
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Describe the product..."
                    />
                  </label>

                  <label>
                    Fabric
                    <input
                      name="fabric"
                      value={form.fabric}
                      onChange={handleChange}
                      placeholder="100% Premium Cotton"
                    />
                  </label>

                  <label>
                    Sizes
                    <input
                      name="sizes"
                      value={form.sizes}
                      onChange={handleChange}
                      placeholder="S, M, L, XL"
                    />
                  </label>

                  <label>
                    Colors
                    <input
                      name="colors"
                      value={form.colors}
                      onChange={handleChange}
                      placeholder="Black, White, Beige"
                    />
                  </label>

                  <label>
                    Tags
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="minimal, premium, casual"
                    />
                  </label>
                </div>
              </section>

              {/* VARIANTS */}

              <section className="admin-gsap-section">
                <div className="admin-section-title">
                  <span>04</span>

                  <h2>Variants</h2>
                </div>

                <div className="admin-variants">
                  {form.variants.length === 0 && (
                    <div className="admin-variants-empty">
                      <p>No variants added.</p>

                      <span>Add SKU, size, color and stock variations.</span>
                    </div>
                  )}

                  {form.variants.map((variant, index) => (
                    <motion.div
                      className="admin-variant-card"
                      key={`${variant.sku}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 20,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                    >
                      <div className="admin-variant-header">
                        <div>
                          <strong>Variant {index + 1}</strong>

                          <span>INVENTORY</span>
                        </div>

                        <button
                          type="button"
                          className="admin-variant-remove"
                          onClick={() => removeVariant(index)}
                        >
                          ×
                        </button>
                      </div>

                      <div className="admin-variant-grid">
                        <label>
                          SKU *
                          <input
                            name="sku"
                            value={variant.sku}
                            onChange={(event) =>
                              handleVariantChange(index, event)
                            }
                            placeholder="AUR-TEE-BLK-M"
                          />
                        </label>

                        <label>
                          Size
                          <input
                            name="size"
                            value={variant.size}
                            onChange={(event) =>
                              handleVariantChange(index, event)
                            }
                            placeholder="M"
                          />
                        </label>

                        <label>
                          Color
                          <input
                            name="color"
                            value={variant.color}
                            onChange={(event) =>
                              handleVariantChange(index, event)
                            }
                            placeholder="Black"
                          />
                        </label>

                        <label>
                          Stock *
                          <input
                            type="number"
                            min="0"
                            name="stock"
                            value={variant.stock}
                            onChange={(event) =>
                              handleVariantChange(index, event)
                            }
                            placeholder="10"
                          />
                        </label>

                        <label>
                          Variant Price
                          <input
                            type="number"
                            min="0"
                            name="price"
                            value={variant.price}
                            onChange={(event) =>
                              handleVariantChange(index, event)
                            }
                            placeholder="4999"
                          />
                        </label>

                        <label>
                          Old Price
                          <input
                            type="number"
                            min="0"
                            name="oldPrice"
                            value={variant.oldPrice}
                            onChange={(event) =>
                              handleVariantChange(index, event)
                            }
                            placeholder="5999"
                          />
                        </label>
                      </div>

                      <label className="admin-variant-active">
                        <input
                          type="checkbox"
                          name="active"
                          checked={variant.active}
                          onChange={(event) =>
                            handleVariantChange(index, event)
                          }
                        />

                        <span>Variant Active</span>
                      </label>
                    </motion.div>
                  ))}

                  <motion.button
                    type="button"
                    className="admin-add-variant"
                    onClick={addVariant}
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <span>＋</span>
                    Add Variant
                  </motion.button>
                </div>
              </section>

              {/* COLLECTION */}

              <section className="admin-gsap-section">
                <div className="admin-section-title">
                  <span>05</span>

                  <h2>Collection</h2>
                </div>

                <div className="admin-checks">
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                    />

                    <span>Featured</span>
                  </label>

                  <label className="admin-check">
                    <input
                      type="checkbox"
                      name="newArrival"
                      checked={form.newArrival}
                      onChange={handleChange}
                    />

                    <span>New Arrival</span>
                  </label>

                  <label className="admin-check">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      checked={form.bestSeller}
                      onChange={handleChange}
                    />

                    <span>Best Seller</span>
                  </label>
                </div>

                <div className="admin-form-actions">
                  {editingProductId && (
                    <motion.button
                      type="button"
                      className="admin-cancel"
                      onClick={cancelEdit}
                      whileHover={{
                        y: -3,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                    >
                      Cancel
                    </motion.button>
                  )}

                  <motion.button
                    type="submit"
                    className="admin-submit"
                    disabled={saving || uploadingImage}
                    whileHover={{
                      y: -4,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                  >
                    <span>
                      {saving
                        ? editingProductId
                          ? "Updating Product..."
                          : "Adding Product..."
                        : editingProductId
                          ? "✦ Update Product"
                          : "＋ Add Product"}
                    </span>

                    <i />
                  </motion.button>
                </div>
              </section>
            </form>

            {/* PRODUCT LIST */}

            <section className="admin-product-list">
              <div className="admin-section-title">
                <span>06</span>

                <h2>Existing Products</h2>
              </div>

              {products.length === 0 ? (
                <div className="admin-empty">
                  <p>No products found.</p>

                  <span>Add your first Aurevyn product.</span>
                </div>
              ) : (
                <div className="admin-product-items">
                  {products.map((product) => (
                    <motion.article
                      className={`admin-product-item ${
                        editingProductId === product._id ? "is-editing" : ""
                      }`}
                      key={product._id}
                      whileHover={{
                        y: -4,
                      }}
                    >
                      <div className="admin-product-image-wrap">
                        <img src={product.image} alt={product.name} />

                        <span>{product.badge || "AUREVYN"}</span>
                      </div>

                      <div className="admin-product-info">
                        <h3>{product.name}</h3>

                        <span>
                          {product.category} / {product.gender}
                        </span>

                        <strong>
                          Rs. {Number(product.price).toLocaleString()}
                        </strong>

                        {product.variants?.length > 0 && (
                          <small>{product.variants.length} variants</small>
                        )}
                      </div>

                      <div className="admin-product-actions">
                        <motion.button
                          type="button"
                          className="admin-edit"
                          onClick={() => handleEdit(product)}
                          whileHover={{
                            y: -2,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                        >
                          {editingProductId === product._id
                            ? "Editing"
                            : "Edit"}
                        </motion.button>

                        <motion.button
                          type="button"
                          className="admin-delete"
                          onClick={() => handleDelete(product._id)}
                          disabled={deleting === product._id}
                          whileHover={{
                            y: -2,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                        >
                          {deleting === product._id ? "..." : "Delete"}
                        </motion.button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminProducts;

import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsApi } from "../../services/productApi";
import "./Women.css";

const Women = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const orbitRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProductsApi();

        const womenProducts = (response.products || [])
          .filter(
            (product) =>
              product.gender === "Women" || product.gender === "Unisex",
          )
          .slice(0, 6)
          .map((product) => ({
            ...product,
            id: product._id,
          }));

        setProducts(womenProducts);
      } catch (error) {
        console.error("WOMEN CATEGORY ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".women__eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".women__title",
          {
            opacity: 0,
            y: 70,
            duration: 1.05,
            ease: "power4.out",
          },
          "-=0.4",
        )
        .from(
          ".women__hero-text",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.55",
        )
        .from(
          ".women__hero-action",
          {
            opacity: 0,
            y: 18,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35",
        )
        .from(
          heroImageRef.current,
          {
            opacity: 0,
            scale: 1.1,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=1.1",
        );

      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          rotate: 360,
          duration: 27,
          repeat: -1,
          ease: "none",
        });
      }

      gsap.to(heroImageRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="women-page">
      {/* HERO */}
      <section ref={heroRef} className="women__hero">
        <div className="women__hero-image">
          <img
            ref={heroImageRef}
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&auto=format&fit=crop&q=88"
            alt="Aurevyn women's collection"
          />
        </div>

        <div className="women__hero-overlay" />

        <div ref={orbitRef} className="women__hero-orbit" aria-hidden="true">
          <svg viewBox="0 0 600 600">
            <circle
              cx="300"
              cy="300"
              r="225"
              fill="none"
              stroke="rgba(201,169,107,0.18)"
              strokeWidth="1"
            />

            <circle
              cx="300"
              cy="300"
              r="178"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="2 11"
            />

            <circle
              cx="300"
              cy="300"
              r="130"
              fill="none"
              stroke="rgba(201,169,107,0.12)"
              strokeWidth="1"
            />

            <path
              d="M300 72 A228 228 0 0 1 495 190"
              fill="none"
              stroke="rgba(201,169,107,0.12)"
              strokeWidth="1"
            />

            <circle cx="300" cy="72" r="3" fill="#c9a76a" />
          </svg>
        </div>

        <div className="women__hero-inner">
          <span className="women__eyebrow">AUREVYN / WOMEN</span>

          <h1 className="women__title">
            Quiet
            <span>confidence.</span>
          </h1>

          <p className="women__hero-text">
            Modern womenswear refined through soft structure, thoughtful detail
            and effortless movement.
          </p>

          <div className="women__hero-action">
            <Link to="/shop?category=women">
              Explore women's collection
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="women__hero-meta">
            <span>WOMEN'S COLLECTION</span>
            <span>02 / 02</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="women__intro">
        <div className="women__container">
          <div className="women__intro-label">
            <span>01</span>
            <span>THE AUREVYN WOMAN</span>
          </div>

          <motion.div
            className="women__intro-copy"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75 }}
          >
            <h2>
              Effortless form
              <em>with intention.</em>
            </h2>

            <p>
              Pieces designed to feel considered without feeling complicated.
              Soft lines, modern balance and silhouettes made for real life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="women__products">
        <div className="women__container">
          <div className="women__section-head">
            <div>
              <span>CURATED FOR HER</span>
              <h2>
                Women's
                <em>essentials</em>
              </h2>
            </div>

            <Link to="/shop?category=women">
              View all
              <ChevronRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="women__loading">Curating the collection...</div>
          ) : (
            <div className="women__grid">
              {products.map((product, index) => (
                <motion.article
                  key={product.id}
                  className="women-card"
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                  }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="women-card__image"
                  >
                    <img loading="lazy" decoding="async" src={product.image} alt={product.name} />

                    <span className="women-card__glint" />

                    <span className="women-card__badge">
                      {product.badge || "NEW"}
                    </span>
                  </Link>

                  <div className="women-card__info">
                    <div className="women-card__meta">
                      <span>{product.category || "Essentials"}</span>

                      <div>
                        <Star size={10} fill="currentColor" />

                        <span>{Number(product.rating || 4.8).toFixed(1)}</span>
                      </div>
                    </div>

                    <h3>{product.name}</h3>

                    <p>
                      Rs. {Number(product.price || 0).toLocaleString("en-PK")}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="women__editorial">
        <div className="women__editorial-image">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600&auto=format&fit=crop&q=88"
            alt="Aurevyn womenswear editorial"
          />
        </div>

        <div className="women__editorial-overlay" />

        <div className="women__editorial-content">
          <span>THE AUREVYN EDIT</span>

          <h2>
            Modern
            <em>silhouettes.</em>
          </h2>

          <p>
            Thoughtful pieces that bring softness, structure and quiet
            confidence into every day.
          </p>

          <Link to="/shop?category=women">
            Discover the edit
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Women;

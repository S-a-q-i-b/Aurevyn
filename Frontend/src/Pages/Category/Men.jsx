import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsApi } from "../../services/productApi";
import "./Men.css";

const Men = () => {
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

        const menProducts = (response.products || [])
          .filter(
            (product) =>
              product.gender === "Men" || product.gender === "Unisex",
          )
          .slice(0, 6)
          .map((product) => ({
            ...product,
            id: product._id,
          }));

        setProducts(menProducts);
      } catch (error) {
        console.error("MEN CATEGORY ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".men__eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".men__title",
          {
            opacity: 0,
            y: 70,
            duration: 1.05,
            ease: "power4.out",
          },
          "-=0.4",
        )
        .from(
          ".men__hero-text",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.55",
        )
        .from(
          ".men__hero-action",
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
          duration: 26,
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
    <main ref={pageRef} className="men-page">
      {/* HERO */}
      <section ref={heroRef} className="men__hero">
        <div className="men__hero-image">
          <img
            ref={heroImageRef}
            src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1800&auto=format&fit=crop&q=88"
            alt="Aurevyn men's collection"
          />
        </div>

        <div className="men__hero-overlay" />

        <div ref={orbitRef} className="men__hero-orbit" aria-hidden="true">
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
              r="175"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="3 12"
            />

            <circle
              cx="300"
              cy="300"
              r="125"
              fill="none"
              stroke="rgba(201,169,107,0.1)"
              strokeWidth="1"
            />

            <circle cx="300" cy="72" r="3" fill="#c9a76a" />
          </svg>
        </div>

        <div className="men__hero-inner">
          <span className="men__eyebrow">AUREVYN / MEN</span>

          <h1 className="men__title">
            Refined.
            <span>Distinct.</span>
          </h1>

          <p className="men__hero-text">
            Contemporary menswear shaped by clean silhouettes, considered
            details and effortless everyday style.
          </p>

          <div className="men__hero-action">
            <Link to="/shop?category=men">
              Explore men's collection
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </div>

          <div className="men__hero-meta">
            <span>MEN'S COLLECTION</span>
            <span>01 / 02</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="men__intro">
        <div className="men__container">
          <div className="men__intro-label">
            <span>01</span>
            <span>THE AUREVYN MAN</span>
          </div>

          <motion.div
            className="men__intro-copy"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75 }}
          >
            <h2>
              Quiet confidence
              <em>in every layer.</em>
            </h2>

            <p>
              From relaxed tailoring to everyday essentials, each piece is
              designed to move naturally between moments, seasons and spaces.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="men__products">
        <div className="men__container">
          <div className="men__section-head">
            <div>
              <span>CURATED FOR HIM</span>
              <h2>
                Men's
                <em>essentials</em>
              </h2>
            </div>

            <Link to="/shop?category=men">
              View all
              <ChevronRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="men__loading">Curating the collection...</div>
          ) : (
            <div className="men__grid">
              {products.map((product, index) => (
                <motion.article
                  key={product.id}
                  className="men-card"
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
                    className="men-card__image"
                  >
                    <img loading="lazy" decoding="async" src={product.image} alt={product.name} />

                    <span className="men-card__glint" />

                    <span className="men-card__badge">
                      {product.badge || "NEW"}
                    </span>
                  </Link>

                  <div className="men-card__info">
                    <div className="men-card__meta">
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
      <section className="men__editorial">
        <div className="men__editorial-image">
          <img
            src="https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=1600&auto=format&fit=crop&q=88"
            alt="Aurevyn menswear editorial"
          />
        </div>

        <div className="men__editorial-overlay" />

        <div className="men__editorial-content">
          <span>THE NEW STANDARD</span>

          <h2>
            Made for
            <em>every day.</em>
          </h2>

          <p>
            Essentials that do more with less. Clean forms, subtle texture and a
            silhouette designed to last.
          </p>

          <Link to="/shop?category=men">
            Discover the edit
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Men;

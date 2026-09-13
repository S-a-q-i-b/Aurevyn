import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./FeaturedCollection.css";

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    id: 1,
    title: "Essentials",
    subtitle: "EVERYDAY / REFINED",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
    className: "featured-card--large",
  },
  {
    id: 2,
    title: "Outerwear",
    subtitle: "STRUCTURE / FORM",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85",
    className: "featured-card--small",
  },
  {
    id: 3,
    title: "Street Edit",
    subtitle: "MODERN / BOLD",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85",
    className: "featured-card--small",
  },
];

const FeaturedCollection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const eyebrow = ".featured__eyebrow";
      const heading = ".featured__heading";
      const cards = ".featured-card";

      gsap.fromTo(
        eyebrow,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        heading,
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
        cards,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".featured__grid",
            start: "top 85%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="featured" ref={sectionRef} id="featured">
      <div className="featured__container">
        <div className="featured__header">
          <div>
            <p className="featured__eyebrow">01 / COLLECTIONS</p>

            <h2 className="featured__heading">
              Pieces made
              <br />
              <span>to be remembered.</span>
            </h2>
          </div>

          <p className="featured__intro">
            Carefully designed essentials that balance timeless silhouettes with
            a modern point of view.
          </p>
        </div>

        <div className="featured__grid">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              className={`featured-card ${collection.className}`}
              whileHover="hover"
            >
              <Link to="/shop" className="featured-card__link">
                <div className="featured-card__image-wrap">
                  <motion.img
                    src={collection.image}
                    alt={collection.title}
                    className="featured-card__image"
                    variants={{
                      hover: {
                        scale: 1.06,
                      },
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                <div className="featured-card__overlay" />

                <div className="featured-card__content">
                  <div>
                    <p className="featured-card__subtitle">
                      {collection.subtitle}
                    </p>

                    <h3>{collection.title}</h3>
                  </div>

                  <motion.span
                    className="featured-card__arrow"
                    variants={{
                      hover: {
                        x: 5,
                        y: -5,
                      },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight size={22} strokeWidth={1.5} />
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;

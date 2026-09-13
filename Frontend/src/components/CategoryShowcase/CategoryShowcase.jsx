import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./CategoryShowcase.css";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "Men",
    description: "Modern essentials for every day.",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=85",
    path: "/shop?category=men",
    className: "category-card--large",
  },
  {
    id: 2,
    name: "Women",
    description: "Refined silhouettes with attitude.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
    path: "/shop?category=women",
    className: "category-card--small",
  },
  {
    id: 3,
    name: "Hoodies",
    description: "Comfort meets contemporary design.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
    path: "/shop?category=hoodies",
    className: "category-card--small",
  },
  {
    id: 4,
    name: "Denim",
    description: "Timeless pieces, modern fit.",
    image:
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=1000&q=85",
    path: "/shop?category=jeans",
    className: "category-card--wide",
  },
];

const CategoryShowcase = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".category__header",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".category-card",
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
            trigger: ".category__grid",
            start: "top 85%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="category" ref={sectionRef}>
      <div className="category__container">
        <div className="category__header">
          <div>
            <p className="category__eyebrow">03 / CATEGORIES</p>

            <h2 className="category__title">
              Find your
              <br />
              <span>signature.</span>
            </h2>
          </div>

          <p className="category__intro">
            Explore curated collections designed around movement, expression,
            and everyday style.
          </p>
        </div>

        <div className="category__grid">
          {categories.map((category) => (
            <motion.article
              className={`category-card ${category.className}`}
              key={category.id}
              whileHover="hover"
            >
              <Link to={category.path} className="category-card__link">
                <div className="category-card__image-wrap">
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="category-card__image"
                    variants={{
                      hover: {
                        scale: 1.07,
                      },
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                <div className="category-card__overlay" />

                <div className="category-card__content">
                  <div>
                    <p className="category-card__description">
                      {category.description}
                    </p>

                    <h3>{category.name}</h3>
                  </div>

                  <motion.span
                    className="category-card__arrow"
                    variants={{
                      hover: {
                        x: 6,
                        y: -6,
                      },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight size={21} strokeWidth={1.5} />
                  </motion.span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;

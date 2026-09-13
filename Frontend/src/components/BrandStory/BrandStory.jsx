import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./BrandStory.css";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: "2026",
    label: "Founded",
  },
  {
    value: "100%",
    label: "Original Design",
  },
  {
    value: "04",
    label: "Core Collections",
  },
];

const BrandStory = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".brand-story__image",
        {
          scale: 1.12,
        },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".brand-story__content > *",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".brand-story__stat",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".brand-story__stats",
            start: "top 90%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="brand-story" ref={sectionRef}>
      <div className="brand-story__container">
        <div className="brand-story__visual">
          <div className="brand-story__image-wrap">
            <img
              className="brand-story__image"
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1400&q=85"
              alt="Aurevyn fashion editorial"
            />
          </div>

          <div className="brand-story__image-label">AUREVYN / VISUAL 01</div>
        </div>

        <div className="brand-story__content">
          <p className="brand-story__eyebrow">04 / THE AUREVYN WAY</p>

          <h2 className="brand-story__title">
            More than
            <br />
            <span>what you wear.</span>
          </h2>

          <p className="brand-story__text">
            Aurevyn was created around a simple idea: clothing should feel like
            an extension of who you are. We combine clean silhouettes,
            considered details, and a modern perspective to create pieces that
            stay relevant beyond a single season.
          </p>

          <p className="brand-story__text brand-story__text--secondary">
            No unnecessary noise. Just thoughtful design, confident form, and
            clothing made for the way you move.
          </p>

          <Link to="/shop" className="brand-story__link">
            Discover Aurevyn
            <ArrowUpRight size={19} strokeWidth={1.5} />
          </Link>

          <div className="brand-story__stats">
            {stats.map((stat) => (
              <motion.div
                className="brand-story__stat"
                key={stat.label}
                whileHover={{ y: -4 }}
              >
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;

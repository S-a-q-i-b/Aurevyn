import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";

import "./Hero.css";
import Magnetic from "../Magnetic/Magnetic";

const MotionLink = motion.create(Link);

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      timeline
        .from(".hero__eyebrow", {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(
          ".hero__title-line",
          {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.35",
        )
        .from(
          ".hero__description",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .from(
          ".hero__buttons",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          imageRef.current,
          {
            scale: 1.12,
            opacity: 0,
            duration: 1.4,
            ease: "power3.out",
          },
          "-=1",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero__overlay" />

      <div className="hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow">AUREVYN / AUTUMN COLLECTION</p>

          <h1 className="hero__title">
            <span className="hero__title-line">DEFINE</span>

            <span className="hero__title-line hero__title-line--outline">
              YOUR
            </span>

            <span className="hero__title-line">STYLE.</span>
          </h1>

          <p className="hero__description">
            Contemporary essentials designed for those who make their own rules.
          </p>

          <div className="hero__buttons">
            <Magnetic>
              <MotionLink
                to="/shop"
                className="hero__button hero__button--primary"
                whileHover={{
                  scale: 1.03,
                  x: 3,
                  borderRadius: 10,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Shop Collection
                <ArrowRight size={18} strokeWidth={1.8} />
              </MotionLink>
            </Magnetic>

            <motion.a
              href="#featured"
              className="hero__button hero__button--secondary"
              whileHover={{ x: 5 }}
            >
              Explore
              <MdOutlineKeyboardArrowDown size={18} />
            </motion.a>
          </div>
        </div>

        <div className="hero__visual" data-cursor-image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=72">
          <picture>
            <source media="(max-width: 767px)" srcSet="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=78&fm=avif 700w, https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80&fm=avif 1000w" sizes="100vw" type="image/avif" />
            <source srcSet="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=78&fm=webp 900w, https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=82&fm=webp 1400w, https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=84&fm=webp 1800w" sizes="(max-width: 1100px) 52vw, 48vw" type="image/webp" />
            <img ref={imageRef} src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85" alt="Aurevyn fashion collection" width="1400" height="1750" sizes="(max-width: 1100px) 52vw, 48vw" fetchPriority="high" decoding="async" />
          </picture>

          <div className="hero__vertical-label">AUREVYN — EST. 2026</div>
        </div>
      </div>

      <motion.a
        href="#featured"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span>SCROLL TO DISCOVER</span>
        <ArrowDown size={17} strokeWidth={1.5} />
      </motion.a>
    </section>
  );
};

export default Hero;

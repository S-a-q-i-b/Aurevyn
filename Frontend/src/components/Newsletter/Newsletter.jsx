
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check } from "lucide-react";

import "./Newsletter.css";

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const sectionRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".newsletter__content > *",
        {
          y: 45,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="newsletter" ref={sectionRef}>
      <div className="newsletter__background-text">AUREVYN</div>

      <div className="newsletter__container">
        <div className="newsletter__content">
          <p className="newsletter__eyebrow">05 / STAY IN THE LOOP</p>

          <h2 className="newsletter__title">
            Never miss
            <br />
            <span>a drop.</span>
          </h2>

          <p className="newsletter__description">
            Join the Aurevyn community for new collections, exclusive access,
            and early updates.
          </p>

          {!submitted ? (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                required
              />

              <motion.button
                type="submit"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={21} strokeWidth={1.7} />
              </motion.button>
            </form>
          ) : (
            <div className="newsletter__success">
              <span>
                <Check size={17} strokeWidth={2} />
              </span>

              <p>You're on the list. Welcome to Aurevyn.</p>
            </div>
          )}

          <p className="newsletter__note">
            By subscribing, you agree to receive emails from Aurevyn.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;


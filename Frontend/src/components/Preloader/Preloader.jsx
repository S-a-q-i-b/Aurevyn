import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./Preloader.css";

const preloadImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=72",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=700&q=72",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=72",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=72",
];

const Preloader = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setProgress(100);
      setDone(true);
      return undefined;
    }

    let loaded = 0;
    const total = preloadImages.length;
    const finish = () => {
      loaded += 1;
      if (mounted) setProgress(Math.round((loaded / total) * 100));
      if (loaded >= total && mounted)
        window.setTimeout(() => setDone(true), 250);
    };

    preloadImages.forEach((src) => {
      const image = new Image();
      image.onload = finish;
      image.onerror = finish;
      image.src = src;
    });

    const fallback = window.setTimeout(() => mounted && setDone(true), 3500);
    return () => {
      mounted = false;
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            className="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="preloader__grain" />
            <div className="preloader__images">
              {preloadImages.map((src, index) => (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  className="preloader__image"
                  style={{
                    left: `${14 + index * 22}%`,
                    top: `${12 + (index % 2) * 24}%`,
                  }}
                  initial={{ y: -140, opacity: 0 }}
                  animate={{ y: [-140, 30, 90], opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 3.2 + index * 0.2,
                    repeat: Infinity,
                    delay: index * 0.28,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
            <div className="preloader__center">
              <span className="preloader__eyebrow">AUREVYN / 2026</span>
              <h1>AUREVYN</h1>
              <div className="preloader__progress">
                <span style={{ width: `${progress}%` }} />
              </div>
              <strong>{String(progress).padStart(2, "0")} %</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default Preloader;

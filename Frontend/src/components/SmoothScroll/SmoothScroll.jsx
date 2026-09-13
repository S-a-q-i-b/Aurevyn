import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "../../animations";

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    let scroll;
    try {
      scroll = new LocomotiveScroll({
        lenisOptions: { duration: 1.05, lerp: 0.08, smoothWheel: true },
      });

      const onScroll = () => ScrollTrigger.update();
      const tick = (time) => { if (scroll?.raf) scroll.raf(time * 1000); };
      if (scroll.on) scroll.on("scroll", onScroll);

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        if (scroll?.off) scroll.off("scroll", onScroll);
        if (scroll?.destroy) scroll.destroy();
      };
    } catch (error) {
      console.warn("Smooth scroll disabled:", error);
      return undefined;
    }
  }, []);

  return children;
};

export default SmoothScroll;

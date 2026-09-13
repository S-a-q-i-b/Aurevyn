import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ overwrite: "auto" });

gsap.config({ nullTargetWarn: false });

export const easeLuxury = "power4.out";
export const revealY = (target, options = {}) =>
  gsap.fromTo(
    target,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: easeLuxury, ...options },
  );
export const fadeUp = (target, options = {}) =>
  gsap.fromTo(
    target,
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", ...options },
  );
export const splitWords = (text) => text.split(/\s+/).filter(Boolean);
export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export { gsap, ScrollTrigger };

import { useEffect, useState } from "react";
import "./GlobalCursor.css";

const GlobalCursor = () => {
  const [point, setPoint] = useState({ x: -100, y: -100, visible: false, image: "" });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return undefined;
    const move = (event) => {
      const target = event.target.closest?.("[data-cursor-image]");
      setPoint({ x: event.clientX, y: event.clientY, visible: true, image: target?.dataset.cursorImage || "" });
    };
    const leave = () => setPoint((current) => ({ ...current, visible: false }));
    window.addEventListener("pointermove", move); window.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerleave", leave); };
  }, []);
  return <div className={`global-cursor ${point.visible ? "is-visible" : ""}`} style={{ left: point.x, top: point.y }}>{point.image && <img src={point.image} alt="" loading="lazy" />}</div>;
};
export default GlobalCursor;

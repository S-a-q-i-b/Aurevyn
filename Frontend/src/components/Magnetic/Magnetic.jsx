import { useEffect, useRef } from "react";

const Magnetic = ({ children, strength = 0.18, className = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = ref.current;
    if (reduced || !node) return undefined;
    const move = (event) => { const r=node.getBoundingClientRect(); const x=event.clientX-(r.left+r.width/2); const y=event.clientY-(r.top+r.height/2); node.style.transform=`translate(${x*strength}px, ${y*strength}px)`; };
    const leave = () => { node.style.transform="translate(0,0)"; };
    node.addEventListener("pointermove", move); node.addEventListener("pointerleave", leave);
    return () => { node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return <div ref={ref} className={`magnetic ${className}`}>{children}</div>;
};
export default Magnetic;

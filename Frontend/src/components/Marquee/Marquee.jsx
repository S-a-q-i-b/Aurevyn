import { motion } from "framer-motion";
import "./Marquee.css";

const marqueeItems = ["QUIET LUXURY", "MODERN FORM", "EVERYDAY EDIT"];

const MarqueeGroup = () => (
  <div className="aurevyn-marquee__group">
    {marqueeItems.map((item) => (
      <span key={item}>{item}</span>
    ))}

    <i>✦</i>
  </div>
);

const Marquee = () => (
  <section
    className="aurevyn-marquee"
    aria-label="Aurevyn collection statement"
  >
    <motion.div
      className="aurevyn-marquee__track"
      animate={{ x: ["-50%", "0%"] }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <MarqueeGroup />
      <MarqueeGroup />
    </motion.div>
  </section>
);

export default Marquee;

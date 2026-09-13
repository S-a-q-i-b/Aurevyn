import { motion } from "framer-motion";
import "./Marquee.css";

const Marquee = () => (
  <section
    className="aurevyn-marquee"
    aria-label="Aurevyn collection statement"
  >
    <div className="aurevyn-marquee__track">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <span>QUIET LUXURY</span>
        <i>✦</i>
        <span>MODERN FORM</span>
        <i>✦</i>
        <span>EVERYDAY EDIT</span>
        <i>✦</i>
        <span>QUIET LUXURY</span>
        <i>✦</i>
        <span>MODERN FORM</span>
        <i>✦</i>
        <span>EVERYDAY EDIT</span>
      </motion.div>
    </div>
  </section>
);
export default Marquee;

import { motion } from "framer-motion";
import "./CinematicVideo.css";

const CinematicVideo = () => {
  const src = "/videos/10547312-uhd_4096_2160_25fps.mp4";

  return (
    <section className="cinematic-video">
      <video
        className="cinematic-video__media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="cinematic-video__veil" />

      <motion.div
        className="cinematic-video__copy"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <span>AUREVYN / MOVING IMAGE</span>

        <h2>
          Made to
          <br />
          <em>move.</em>
        </h2>
      </motion.div>
    </section>
  );
};

export default CinematicVideo;

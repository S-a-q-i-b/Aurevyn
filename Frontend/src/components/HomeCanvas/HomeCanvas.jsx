import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import "./HomeCanvas.css";

gsap.registerPlugin(ScrollTrigger);

const frames = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=78",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=78",
];

const HomeCanvas = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const stateRef = useRef({ frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !section || !context) return undefined;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const images = frames.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });
    imagesRef.current = images;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      const image = images[stateRef.current.frame];
      if (!image?.complete || !image.naturalWidth) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.max(vw / image.naturalWidth, vh / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.clearRect(0, 0, vw, vh);
      context.drawImage(
        image,
        (vw - width) / 2,
        (vh - height) / 2,
        width,
        height,
      );
    };

    images.forEach((image) => {
      image.onload = draw;
      image.onerror = draw;
    });
    resize();
    window.addEventListener("resize", resize);

    let trigger;
    if (!reduced) {
      trigger = gsap.to(stateRef.current, {
        frame: images.length - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: draw,
        },
      });
    }

    return () => {
      window.removeEventListener("resize", resize);
      trigger?.scrollTrigger?.kill();
      trigger?.kill();
    };
  }, []);

  return (
    <section
      className="home-canvas"
      ref={sectionRef}
      aria-label="Aurevyn cinematic fashion sequence"
    >
      <div className="home-canvas__sticky">
        <canvas ref={canvasRef} className="home-canvas__canvas" />
        <div className="home-canvas__veil" />
        <div className="home-canvas__copy">
          <span>AUREVYN / MOTION EDIT</span>
          <h2>
            Wear the
            <br />
            <em>moment.</em>
          </h2>
          <p>Scroll through the collection as imagery shifts frame by frame.</p>
        </div>
        <div className="home-canvas__meta">
          <span>SCROLL</span>
          <i />
        </div>
      </div>
    </section>
  );
};

export default HomeCanvas;


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
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!canvas || !section) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const images = frames.map((src) => {
      const image = new Image();

      image.crossOrigin = "anonymous";
      image.decoding = "async";
      image.loading = "eager";
      image.src = src;

      return image;
    });

    imagesRef.current = images;

    let viewportWidth = 0;
    let viewportHeight = 0;
    let dpr = 1;

    const getLoadedImage = (requestedIndex) => {
      const total = images.length;

      if (!total) {
        return null;
      }

      const start = Math.max(
        0,
        Math.min(requestedIndex, total - 1),
      );

      for (let offset = 0; offset < total; offset += 1) {
        const backward = start - offset;

        if (
          backward >= 0 &&
          images[backward]?.complete &&
          images[backward]?.naturalWidth > 0
        ) {
          currentFrameRef.current = backward;
          return images[backward];
        }

        const forward = start + offset;

        if (
          forward < total &&
          images[forward]?.complete &&
          images[forward]?.naturalWidth > 0
        ) {
          currentFrameRef.current = forward;
          return images[forward];
        }
      }

      return null;
    };

    const draw = () => {
      const frameIndex = Math.round(stateRef.current.frame);
      const image = getLoadedImage(frameIndex);

      if (!image) {
        context.fillStyle = "#090909";
        context.fillRect(0, 0, viewportWidth, viewportHeight);
        return;
      }

      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;

      const scale = Math.max(
        viewportWidth / imageWidth,
        viewportHeight / imageHeight,
      );

      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;

      const x = (viewportWidth - drawWidth) / 2;
      const y = (viewportHeight - drawHeight) / 2;

      context.clearRect(0, 0, viewportWidth, viewportHeight);

      context.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight,
      );
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      viewportWidth = Math.max(1, Math.round(rect.width));
      viewportHeight = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      canvas.width = Math.round(viewportWidth * dpr);
      canvas.height = Math.round(viewportHeight * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      draw();

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    images.forEach((image) => {
      image.onload = () => {
        draw();
      };

      image.onerror = () => {
        console.warn("Failed to load canvas frame:", image.src);
        draw();
      };
    });

    resize();

    window.addEventListener("resize", resize);

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        stateRef.current.frame = 0;
        draw();
        return;
      }

      gsap.to(stateRef.current, {
        frame: images.length - 1,
        ease: "none",
        snap: {
          frame: 1,
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: draw,
        },
      });
    }, section);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      draw();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", resize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="home-canvas"
      aria-label="Aurevyn cinematic fashion sequence"
    >
      <div className="home-canvas__sticky">
        <canvas
          ref={canvasRef}
          className="home-canvas__canvas"
        />

        <div className="home-canvas__veil" />

        <div className="home-canvas__copy">
          <span>AUREVYN / MOTION EDIT</span>

          <h2>
            Wear the
            <br />
            <em>moment.</em>
          </h2>

          <p>
            Scroll through the collection as imagery shifts frame by
            frame.
          </p>
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


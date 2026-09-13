import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Globe,
  MapPin,
  Ruler,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Preferences.css";

const Preferences = () => {
  const pageRef = useRef(null);
  const orbitRef = useRef(null);
  const lineRef = useRef(null);

  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("PKR");
  const [region, setRegion] = useState("Pakistan");
  const [measurement, setMeasurement] = useState("Metric");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          rotate: 360,
          duration: 28,
          repeat: -1,
          ease: "none",
        });
      }

      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          delay: 0.35,
          ease: "power3.out",
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="preferences-page">
      {/* ======================================
          HERO
      ====================================== */}

      <section className="preferences-hero">
        <div className="preferences-hero-grid" />

        <div
          ref={orbitRef}
          className="preferences-hero-orbit"
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 600">
            <circle
              cx="300"
              cy="300"
              r="225"
              fill="none"
              stroke="rgba(201,169,107,0.16)"
              strokeWidth="1"
            />

            <circle
              cx="300"
              cy="300"
              r="180"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="3 12"
            />

            <circle
              cx="300"
              cy="300"
              r="130"
              fill="none"
              stroke="rgba(201,169,107,0.12)"
              strokeWidth="1"
              strokeDasharray="1 10"
            />

            <path
              d="M300 80 A220 220 0 0 1 500 240"
              fill="none"
              stroke="rgba(201,169,107,0.1)"
              strokeWidth="1"
            />

            <circle cx="300" cy="75" r="3" fill="#c9a76a" />

            <circle cx="475" cy="300" r="2" fill="#ffffff" opacity="0.4" />
          </svg>
        </div>

        <div className="preferences-hero-inner">
          <Link to="/account/settings" className="preferences-back">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Settings
          </Link>

          <motion.div
            className="preferences-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <span className="preferences-eyebrow">AUREVYN / PREFERENCES</span>

            <h1>
              Your
              <span>world.</span>
            </h1>

            <p>
              Set your language, currency, region and measurement preferences
              for a more personal Aurevyn experience.
            </p>

            <div ref={lineRef} className="preferences-hero-line" />

            <div className="preferences-hero-meta">
              <span>LANGUAGE & REGION</span>
              <span>04 / 04</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================
          CONTENT
      ====================================== */}

      <div className="preferences-container">
        <motion.section
          className="preferences-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="preferences-section-heading">
            <span>REGION</span>

            <h2>
              Make it
              <em>yours</em>
            </h2>

            <p>
              These preferences help Aurevyn display information in a way that
              feels natural to you.
            </p>
          </div>

          <div className="preferences-list">
            {/* LANGUAGE */}
            <div className="preference-row">
              <div className="preference-icon">
                <Globe size={20} strokeWidth={1.5} />
              </div>

              <div className="preference-info">
                <h3>Language</h3>
                <p>
                  Choose the language used throughout your Aurevyn experience.
                </p>
              </div>

              <div className="preference-select-wrap">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="preference-select"
                >
                  <option>English</option>
                  <option>Urdu</option>
                </select>

                <ChevronDown size={15} strokeWidth={1.5} />
              </div>
            </div>

            {/* CURRENCY */}
            <div className="preference-row">
              <div className="preference-icon">
                <span className="currency-symbol">₨</span>
              </div>

              <div className="preference-info">
                <h3>Currency</h3>
                <p>Select the currency you want product prices displayed in.</p>
              </div>

              <div className="preference-select-wrap">
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="preference-select"
                >
                  <option>PKR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>

                <ChevronDown size={15} strokeWidth={1.5} />
              </div>
            </div>

            {/* REGION */}
            <div className="preference-row">
              <div className="preference-icon">
                <MapPin size={20} strokeWidth={1.5} />
              </div>

              <div className="preference-info">
                <h3>Region</h3>
                <p>Set your region to receive relevant shopping information.</p>
              </div>

              <div className="preference-select-wrap">
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="preference-select"
                >
                  <option>Pakistan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                </select>

                <ChevronDown size={15} strokeWidth={1.5} />
              </div>
            </div>

            {/* MEASUREMENT */}
            <div className="preference-row">
              <div className="preference-icon">
                <Ruler size={20} strokeWidth={1.5} />
              </div>

              <div className="preference-info">
                <h3>Measurements</h3>
                <p>Choose how clothing measurements are presented to you.</p>
              </div>

              <div className="preference-select-wrap">
                <select
                  value={measurement}
                  onChange={(event) => setMeasurement(event.target.value)}
                  className="preference-select"
                >
                  <option>Metric</option>
                  <option>Imperial</option>
                </select>

                <ChevronDown size={15} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </motion.section>

        {/* SUMMARY */}
        <motion.section
          className="preferences-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="preferences-summary">
            <div className="preferences-summary-icon">
              <Check size={22} strokeWidth={1.5} />
            </div>

            <div className="preferences-summary-content">
              <span>PREFERENCE OVERVIEW</span>

              <h3>Your Aurevyn experience is set.</h3>

              <p>
                {language} · {currency} · {region} · {measurement}
              </p>
            </div>
          </div>
        </motion.section>

        {/* INFO */}
        <motion.section
          className="preferences-info-card"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="preferences-info-art">
            <svg viewBox="0 0 300 300" aria-hidden="true">
              <circle
                cx="150"
                cy="150"
                r="105"
                fill="none"
                stroke="rgba(201,169,107,0.17)"
                strokeWidth="1"
              />

              <circle
                cx="150"
                cy="150"
                r="68"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
                strokeDasharray="2 9"
              />

              <path
                d="M82 150 H218"
                fill="none"
                stroke="#c9a76a"
                strokeWidth="1"
              />

              <path
                d="M150 82 V218"
                fill="none"
                stroke="#c9a76a"
                strokeWidth="1"
              />

              <circle
                cx="150"
                cy="150"
                r="5"
                fill="none"
                stroke="#c9a76a"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="preferences-info-content">
            <span>ABOUT YOUR PREFERENCES</span>

            <h3>
              A more
              <em>personal experience.</em>
            </h3>

            <p>
              Your selected preferences help Aurevyn show prices, measurements
              and shopping information in a familiar format.
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Preferences;

import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  KeyRound,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Security.css";

const Security = () => {
  const pageRef = useRef(null);
  const heroCircleRef = useRef(null);
  const heroLineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(heroCircleRef.current, {
        rotate: 360,
        duration: 28,
        repeat: -1,
        ease: "none",
      });

      gsap.from(heroLineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        delay: 0.35,
        ease: "power3.out",
      });

      gsap.from(".security-floating-dot", {
        opacity: 0,
        scale: 0,
        duration: 0.7,
        stagger: 0.15,
        delay: 0.5,
        ease: "back.out(1.7)",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="security-page">
      {/* ======================================
          HERO
      ====================================== */}
      <section className="security-hero">
        <div className="security-hero-grid" />

        <div
          ref={heroCircleRef}
          className="security-hero-orbit"
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 600">
            <circle
              cx="300"
              cy="300"
              r="230"
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

            <circle cx="300" cy="70" r="3" fill="#c9a76a" />

            <circle cx="530" cy="300" r="2" fill="#fff" opacity="0.4" />
          </svg>
        </div>

        <span className="security-floating-dot security-dot-one" />
        <span className="security-floating-dot security-dot-two" />

        <div className="security-hero-inner">
          <Link to="/account/settings" className="security-back">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Settings
          </Link>

          <motion.div
            className="security-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="security-eyebrow">AUREVYN / SECURITY</span>

            <h1>
              Protect your
              <span>account.</span>
            </h1>

            <p>
              Keep your personal information secure with a strong password and a
              few simple security habits.
            </p>

            <div ref={heroLineRef} className="security-hero-line" />

            <div className="security-hero-meta">
              <span>SECURITY CENTER</span>
              <span>02 / 04</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================
          CONTENT
      ====================================== */}
      <div className="security-container">
        {/* STATUS */}
        <motion.section
          className="security-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.7 }}
        >
          <div className="security-section-heading">
            <span>STATUS</span>
            <h2>
              Your account is
              <em>protected</em>
            </h2>
            <p>Your basic account security is currently in good standing.</p>
          </div>

          <div className="security-status-card">
            <div className="security-status-icon">
              <ShieldCheck size={25} strokeWidth={1.5} />
            </div>

            <div className="security-status-content">
              <span>SECURITY STATUS</span>

              <h3>Good protection</h3>

              <p>Your account has the essential security measures enabled.</p>
            </div>

            <div className="security-status-check">
              <Check size={18} strokeWidth={1.8} />
            </div>
          </div>
        </motion.section>

        {/* PASSWORD */}
        <motion.section
          className="security-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.7 }}
        >
          <div className="security-section-heading">
            <span>PASSWORD</span>
            <h2>
              Manage your
              <em>password</em>
            </h2>
            <p>
              Use a strong password that you do not reuse on other websites.
            </p>
          </div>

          <div className="security-password-card">
            <div className="security-password-icon">
              <KeyRound size={22} strokeWidth={1.5} />
            </div>

            <div className="security-password-content">
              <h3>Password</h3>

              <p>
                Last updated recently. A strong password helps protect your
                personal account information.
              </p>

              <button type="button" className="security-action-button">
                Change Password
                <ChevronRight size={15} strokeWidth={1.5} />
              </button>
            </div>

            <Lock
              className="security-password-watermark"
              size={145}
              strokeWidth={0.45}
            />
          </div>
        </motion.section>

        {/* TWO FACTOR */}
        <motion.section
          className="security-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.7 }}
        >
          <div className="security-section-heading">
            <span>ADVANCED</span>
            <h2>
              Extra
              <em>protection</em>
            </h2>
            <p>Add another layer of protection to your Aurevyn account.</p>
          </div>

          <div className="security-advanced-card">
            <div className="security-advanced-icon">
              <Smartphone size={22} strokeWidth={1.5} />
            </div>

            <div className="security-advanced-content">
              <h3>Two-step verification</h3>

              <p>
                Require an additional verification step when signing into your
                account.
              </p>
            </div>

            <div className="security-coming-soon">COMING SOON</div>
          </div>
        </motion.section>

        {/* ACTIVITY */}
        <motion.section
          className="security-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.7 }}
        >
          <div className="security-section-heading">
            <span>ACTIVITY</span>
            <h2>
              Recent
              <em>activity</em>
            </h2>
            <p>Review the latest security-related account activity.</p>
          </div>

          <div className="security-activity-list">
            <div className="security-activity-item">
              <div className="security-activity-icon">
                <Clock3 size={18} strokeWidth={1.5} />
              </div>

              <div className="security-activity-info">
                <h3>Password security</h3>
                <p>Your account security settings are up to date.</p>
              </div>

              <span className="security-activity-time">Just now</span>
            </div>

            <div className="security-activity-item">
              <div className="security-activity-icon">
                <Lock size={18} strokeWidth={1.5} />
              </div>

              <div className="security-activity-info">
                <h3>Account protection</h3>
                <p>No unusual security activity detected.</p>
              </div>

              <span className="security-activity-time">Today</span>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Security;

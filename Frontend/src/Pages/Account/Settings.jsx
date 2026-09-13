import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Bell,
  ChevronRight,
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Settings.css";

const settingsItems = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your personal information",
    to: "/account",
  },
  {
    icon: Lock,
    title: "Password & Security",
    description: "Manage your password and account security",
    to: "/account/settings/security",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Choose how Aurevyn contacts you",
    to: "/account/settings/notifications",
  },
  {
    icon: Globe,
    title: "Language & Region",
    description: "Manage language, currency and region",
    to: "/account/settings/preferences",
  },
];

const Settings = () => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroLineRef = useRef(null);
  const orbitRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroItems = heroRef.current?.querySelectorAll(
        ".settings-eyebrow, h1, .settings-header-text",
      );

      if (heroItems?.length) {
        gsap.from(heroItems, {
          opacity: 0,
          y: 35,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        });
      }

      if (heroLineRef.current) {
        gsap.from(heroLineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          delay: 0.25,
          ease: "power3.out",
        });
      }

      if (orbitRef.current) {
        gsap.to(orbitRef.current, {
          rotate: 360,
          duration: 24,
          repeat: -1,
          ease: "none",
        });
      }

      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        gsap.from(section, {
          opacity: 0,
          y: 45,
          duration: 0.8,
          delay: index * 0.08,
          ease: "power3.out",
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const addSectionRef = (element) => {
    if (element && !sectionsRef.current.includes(element)) {
      sectionsRef.current.push(element);
    }
  };

  return (
    <main ref={pageRef} className="settings-page">
      {/* ======================================
          HERO
      ====================================== */}

      <section ref={heroRef} className="settings-header">
        <div className="settings-header-noise" />

        <div className="settings-orbit" ref={orbitRef}>
          <svg
            viewBox="0 0 600 600"
            aria-hidden="true"
            className="settings-orbit-svg"
          >
            <circle
              cx="300"
              cy="300"
              r="220"
              fill="none"
              stroke="rgba(201,169,107,0.18)"
              strokeWidth="1"
            />

            <circle
              cx="300"
              cy="300"
              r="175"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="3 12"
            />

            <circle
              cx="300"
              cy="300"
              r="124"
              fill="none"
              stroke="rgba(201,169,107,0.14)"
              strokeWidth="1"
              strokeDasharray="1 10"
            />

            <circle cx="300" cy="80" r="3" fill="#c9a76a" />

            <circle cx="482" cy="300" r="2" fill="#ffffff" opacity="0.45" />
          </svg>
        </div>

        <div className="settings-header-inner">
          <div className="settings-header-content">
            <motion.span
              className="settings-eyebrow"
              initial={{
                opacity: 0,
                letterSpacing: "0.12em",
              }}
              animate={{
                opacity: 1,
                letterSpacing: "0.28em",
              }}
              transition={{
                duration: 0.9,
                delay: 0.15,
              }}
            >
              MY AUREVYN
            </motion.span>

            <h1>
              Account
              <span>Settings</span>
            </h1>

            <p className="settings-header-text">
              Shape your Aurevyn experience. Manage your account, security,
              notifications and personal preferences from one refined space.
            </p>

            <div ref={heroLineRef} className="settings-hero-line" />

            <div className="settings-hero-meta">
              <span>PERSONAL SPACE</span>
              <span>01 / 04</span>
            </div>
          </div>
        </div>
      </section>

      <div className="settings-container">
        <motion.section
          ref={addSectionRef}
          className="settings-section"
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
          <div className="settings-section-heading">
            <span>ACCOUNT</span>

            <h2>
              Account
              <em>preferences</em>
            </h2>

            <p>
              Manage the essential details that shape your Aurevyn account
              experience.
            </p>
          </div>

          <div className="settings-list">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    x: -24,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <Link to={item.to} className="settings-item">
                    <div className="settings-index">0{index + 1}</div>

                    <div className="settings-item-icon">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>

                    <div className="settings-item-content">
                      <h3>{item.title}</h3>

                      <p>{item.description}</p>
                    </div>

                    <ChevronRight
                      className="settings-item-arrow"
                      size={20}
                      strokeWidth={1.4}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          ref={addSectionRef}
          className="settings-section"
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
          <div className="settings-section-heading">
            <span>SECURITY</span>

            <h2>
              Account
              <em>protection</em>
            </h2>

            <p>
              Keep your Aurevyn account protected with a strong, private
              password.
            </p>
          </div>

          <div className="security-card">
            <div className="security-card-glow" />

            <div className="security-card-art">
              <svg
                viewBox="0 0 340 340"
                className="security-svg"
                aria-hidden="true"
              >
                <circle
                  cx="170"
                  cy="170"
                  r="130"
                  fill="none"
                  stroke="rgba(201,169,107,0.15)"
                  strokeWidth="2"
                />

                <circle
                  cx="170"
                  cy="170"
                  r="88"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  strokeDasharray="2 11"
                />

                <path
                  d="M170 75 L235 98 V153C235 198 205 234 170 250C135 234 105 198 105 153V98L170 75Z"
                  fill="none"
                  stroke="#c9a76a"
                  strokeWidth="1"
                />

                <path
                  d="M146 165 L162 181 L197 143"
                  fill="none"
                  stroke="#c9a76a"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="security-card-content">
              <div className="security-icon">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>

              <span className="security-small-label">AUREVYN SECURITY</span>

              <h3>
                Your account is
                <span>protected.</span>
              </h3>

              <p>
                Keep your password private and use a strong password to protect
                your Aurevyn account.
              </p>

              <Link to="/account/settings/security" className="security-button">
                Manage Security
                <ChevronRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* SIGN OUT */}

        <motion.section
          ref={addSectionRef}
          className="settings-section settings-danger-section"
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
          <div className="settings-section-heading">
            <span>ACCOUNT</span>

            <h2>
              Sign
              <em>out</em>
            </h2>
          </div>

          <div className="logout-panel">
            <div>
              <h3>Leave Aurevyn?</h3>

              <p>
                You can sign back in anytime using your account credentials.
              </p>
            </div>

            <button type="button" className="logout-button">
              <LogOut size={17} strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Settings;

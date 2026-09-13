import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Mail,
  MessageSquare,
  Package,
  ShoppingBag,
  Tag,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Notifications.css";

const notificationOptions = [
  {
    id: "orders",
    icon: Package,
    title: "Order updates",
    description: "Get updates about confirmations, shipping and delivery.",
    defaultValue: true,
  },
  {
    id: "messages",
    icon: MessageSquare,
    title: "Account messages",
    description: "Receive important messages about your Aurevyn account.",
    defaultValue: true,
  },
  {
    id: "promotions",
    icon: Tag,
    title: "Promotions & offers",
    description:
      "Hear about new collections, exclusive offers and special drops.",
    defaultValue: false,
  },
  {
    id: "wishlist",
    icon: ShoppingBag,
    title: "Wishlist updates",
    description: "Get notified when saved pieces change or become available.",
    defaultValue: true,
  },
];

const Notifications = () => {
  const pageRef = useRef(null);
  const orbitRef = useRef(null);
  const lineRef = useRef(null);

  const [notifications, setNotifications] = useState(() =>
    notificationOptions.reduce((acc, item) => {
      acc[item.id] = item.defaultValue;
      return acc;
    }, {}),
  );

  const [emailUpdates, setEmailUpdates] = useState(true);

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

      gsap.from(".notification-hero-dot", {
        opacity: 0,
        scale: 0,
        duration: 0.6,
        stagger: 0.14,
        delay: 0.45,
        ease: "back.out(1.7)",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const toggleNotification = (id) => {
    setNotifications((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <main ref={pageRef} className="notifications-page">
      {/* ======================================
          HERO
      ====================================== */}
      <section className="notifications-hero">
        <div className="notifications-hero-grid" />

        <div
          ref={orbitRef}
          className="notifications-hero-orbit"
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
              r="178"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="3 12"
            />

            <circle
              cx="300"
              cy="300"
              r="128"
              fill="none"
              stroke="rgba(201,169,107,0.12)"
              strokeWidth="1"
              strokeDasharray="1 10"
            />

            <path
              d="M300 90 A210 210 0 0 1 492 210"
              fill="none"
              stroke="rgba(201,169,107,0.14)"
              strokeWidth="1"
            />

            <circle cx="300" cy="75" r="3" fill="#c9a76a" />

            <circle cx="476" cy="300" r="2" fill="#fff" opacity="0.4" />
          </svg>
        </div>

        <span className="notification-hero-dot notification-dot-one" />
        <span className="notification-hero-dot notification-dot-two" />

        <div className="notifications-hero-inner">
          <Link to="/account/settings" className="notifications-back">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Settings
          </Link>

          <motion.div
            className="notifications-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="notifications-eyebrow">
              AUREVYN / NOTIFICATIONS
            </span>

            <h1>
              Stay
              <span>connected.</span>
            </h1>

            <p className="notifications-hero-text">
              Choose what you want to hear about and let Aurevyn keep you
              informed without the unnecessary noise.
            </p>

            <div ref={lineRef} className="notifications-hero-line" />

            <div className="notifications-hero-meta">
              <span>COMMUNICATION CENTER</span>
              <span>03 / 04</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================
          MAIN
      ====================================== */}
      <div className="notifications-container">
        {/* PREFERENCES */}
        <motion.section
          className="notifications-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
        >
          <div className="notifications-section-heading">
            <span>YOUR PREFERENCES</span>

            <h2>
              Choose what
              <em>matters</em>
            </h2>

            <p>Control the notifications you receive from Aurevyn.</p>
          </div>

          <div className="notifications-list">
            {notificationOptions.map((item, index) => {
              const Icon = item.icon;
              const active = notifications[item.id];

              return (
                <motion.div
                  key={item.id}
                  className="notification-row"
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                  }}
                >
                  <div className="notification-number">0{index + 1}</div>

                  <div className="notification-icon">
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  <div className="notification-info">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <button
                    type="button"
                    className={`notification-toggle ${
                      active ? "notification-toggle--active" : ""
                    }`}
                    onClick={() => toggleNotification(item.id)}
                    aria-label={`Toggle ${item.title}`}
                    aria-pressed={active}
                  >
                    <span />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* EMAIL */}
        <motion.section
          className="notifications-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
        >
          <div className="notifications-section-heading">
            <span>EMAIL</span>

            <h2>
              Inbox
              <em>preferences</em>
            </h2>

            <p>
              Decide whether Aurevyn can send account-related emails to you.
            </p>
          </div>

          <div className="email-card">
            <div className="email-icon">
              <Mail size={21} strokeWidth={1.5} />
            </div>

            <div className="email-content">
              <span>EMAIL COMMUNICATION</span>

              <h3>Receive Aurevyn emails</h3>

              <p>
                Get useful updates, order information and important account
                communication by email.
              </p>
            </div>

            <button
              type="button"
              className={`notification-toggle ${
                emailUpdates ? "notification-toggle--active" : ""
              }`}
              onClick={() => setEmailUpdates((value) => !value)}
              aria-label="Toggle email communication"
              aria-pressed={emailUpdates}
            >
              <span />
            </button>
          </div>
        </motion.section>

        {/* PREVIEW */}
        <motion.section
          className="notifications-section"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
        >
          <div className="notifications-section-heading">
            <span>PREVIEW</span>

            <h2>
              Your
              <em>notification style</em>
            </h2>
          </div>

          <div className="notification-preview">
            <div className="notification-preview-top">
              <div className="notification-preview-brand">
                <Bell size={17} strokeWidth={1.5} />
                <span>AUREVYN</span>
              </div>

              <span className="notification-preview-time">NOW</span>
            </div>

            <div className="notification-preview-content">
              <span>ORDER UPDATE</span>

              <h3>Your Aurevyn order is on its way.</h3>

              <p>A simple preview of how important notifications can appear.</p>
            </div>

            <div className="notification-preview-footer">
              <div>
                <Check size={14} strokeWidth={1.7} />
                Notifications enabled
              </div>

              <ChevronRight size={16} strokeWidth={1.4} />
            </div>
          </div>
        </motion.section>

        {/* FOOTNOTE */}
        <div className="notifications-footnote">
          <UserRound size={15} strokeWidth={1.4} />

          <p>
            You can update these preferences anytime from your account settings.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Notifications;

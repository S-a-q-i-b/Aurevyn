import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ArrowRight,
  Heart,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Account.css";

gsap.registerPlugin(ScrollTrigger);

const MotionLink = motion.create(Link);

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Account = () => {
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const layoutRef = useRef(null);
  const quickGridRef = useRef(null);
  const editorialRef = useRef(null);
  const profileRef = useRef(null);
  const ordersRef = useRef(null);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".account__content-heading",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",

          scrollTrigger: {
            trigger: ".account__content-heading",
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".account__sidebar",
        {
          opacity: 0,
          x: -25,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",

          scrollTrigger: {
            trigger: layoutRef.current,
            start: "top 82%",
            once: true,
          },
        },
      );

      if (quickGridRef.current) {
        gsap.fromTo(
          quickGridRef.current.querySelectorAll(".account__quick-card"),
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",

            scrollTrigger: {
              trigger: quickGridRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // Editorial
      if (editorialRef.current) {
        gsap.fromTo(
          editorialRef.current,
          {
            opacity: 0,
            y: 55,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: editorialRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          editorialRef.current.querySelector(".account__editorial-content"),
          {
            opacity: 0,
            x: -35,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: 0.15,
            ease: "power3.out",

            scrollTrigger: {
              trigger: editorialRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      // Profile
      if (profileRef.current) {
        gsap.fromTo(
          profileRef.current,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",

            scrollTrigger: {
              trigger: profileRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          profileRef.current.querySelectorAll(".account__detail"),
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: "power2.out",

            scrollTrigger: {
              trigger: profileRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      // Your Journey
      if (ordersRef.current) {
        gsap.fromTo(
          ordersRef.current,
          {
            opacity: 0,
            y: 55,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: ordersRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );

        gsap.fromTo(
          ordersRef.current.querySelector(".account__orders-content"),
          {
            opacity: 0,
            x: -35,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: 0.15,
            ease: "power3.out",

            scrollTrigger: {
              trigger: ordersRef.current,
              start: "top 76%",
              once: true,
            },
          },
        );
      }
    }, layoutRef);

    return () => ctx.revert();
  }, [loading, user]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="account">
        <div className="account__loading">
          <span className="account__loading-line" />

          <p>Preparing your account</p>
        </div>
      </main>
    );
  }

  // =========================================
  // GUEST
  // =========================================

  if (!user) {
    return (
      <main className="account account--guest">
        <motion.div
          className="account__guest"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="account__eyebrow">AUREVYN / ACCOUNT</p>

          <h1>
            Your style
            <span>awaits.</span>
          </h1>

          <p className="account__guest-text">
            Sign in to manage your orders, saved pieces and personal
            information.
          </p>

          <MotionLink
            to="/login"
            className="account__primary-btn"
            whileHover={{
              y: -3,
              gap: 13,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            Sign In
            <ArrowRight size={17} strokeWidth={1.6} />
          </MotionLink>
        </motion.div>
      </main>
    );
  }

  const firstLetter = user.name?.charAt(0)?.toUpperCase() || "A";

  const menuItems = [
    {
      to: "/account",
      icon: UserRound,
      label: "Overview",
    },
    {
      to: "/orders",
      icon: Package,
      label: "Orders",
    },
    {
      to: "/wishlist",
      icon: Heart,
      label: "Wishlist",
    },
    {
      to: "/cart",
      icon: ShoppingBag,
      label: "Shopping Bag",
    },
    {
      to: "/account/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  const fashionImages = {
    hero: "https://media.istockphoto.com/id/2233679825/photo/young-man-adjusting-sunglasses-and-smiling-while-commuting-in-the-city.webp?a=1&b=1&s=612x612&w=0&k=20&c=lkVueFks5Nj4NT_V4emFwRvJdUDlwOXrIsL-h0X2-_A=",

    order:
      "https://images.unsplash.com/photo-1743877428891-7b05eb7b4444?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGNsb3RoZXMlMjBtYW58ZW58MHx8MHx8fDA%3D",

    wishlist:
      "https://images.unsplash.com/photo-1604072374690-0e7d7bddd54e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNsb3RoZXN8ZW58MHx8MHx8fDA%3D",

    bag: "https://plus.unsplash.com/premium_photo-1699973055451-c2061752297b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFNob3BpbmclMjBiYWclMjBjbG90aGVzfGVufDB8fDB8fHww",

    editorial:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1300&q=85",
  };

  return (
    <main className="account">
      <motion.section
        className="account__hero"
        initial="hidden"
        animate="visible"
      >
        <img
          className="account__hero-bg"
          src={fashionImages.hero}
          alt=""
          aria-hidden="true"
        />

        <div className="account__hero-overlay" />

        <div className="account__hero-inner">
          <motion.div className="account__hero-copy" variants={fadeUp}>
            <p className="account__eyebrow">MY AUREVYN</p>

            <h1>
              Welcome back,
              <span>{user.name}</span>
            </h1>

            <motion.p
              className="account__hero-text"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
            >
              Your personal space for everything AUREVYN. Discover your saved
              pieces, track your orders and define your style.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <MotionLink
                to="/shop"
                className="account__hero-button"
                whileHover={{
                  y: -4,
                  gap: 13,
                  backgroundColor: "#d0ad6a",
                  scaleX: 1.08,
                  scaleY: 1.03,
                  borderRadius: 10,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Explore collection
                <ArrowRight size={16} strokeWidth={1.5} />
              </MotionLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <section ref={layoutRef} className="account__layout">
        <aside className="account__sidebar">
          <div className="account__sidebar-top">
            <motion.div
              className="account__avatar"
              whileHover={{
                scale: 1.05,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 18,
              }}
            >
              {user.avatar ? (
                <img loading="lazy" decoding="async" src={user.avatar} alt={user.name} />
              ) : (
                firstLetter
              )}
            </motion.div>

            <div className="account__profile-info">
              <span>ACCOUNT</span>

              <h2>{user.name}</h2>

              <p>{user.email}</p>
            </div>
          </div>

          <nav className="account__menu">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/account"}
                  className={({ isActive }) =>
                    `account__menu-link ${
                      isActive ? "account__menu-link--active" : ""
                    }`
                  }
                >
                  <Icon size={17} strokeWidth={1.5} />

                  <span>{item.label}</span>

                  <ArrowRight
                    className="account__menu-arrow"
                    size={14}
                    strokeWidth={1.5}
                  />
                </NavLink>
              );
            })}
          </nav>

          <motion.button
            type="button"
            className="account__logout"
            onClick={handleLogout}
            disabled={loggingOut}
            whileTap={{
              scale: 0.98,
            }}
            whileHover={{
              x: 3,
            }}
          >
            <LogOut size={16} strokeWidth={1.5} />

            <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
          </motion.button>
        </aside>

        <div className="account__content">
          <div className="account__content-heading">
            <div>
              <p className="account__eyebrow">OVERVIEW</p>

              <h2>Your AUREVYN space</h2>
            </div>

            <MotionLink
              to="/shop"
              className="account__shop-link"
              whileHover={{
                gap: 12,
              }}
            >
              Explore collection
              <ArrowRight size={15} strokeWidth={1.5} />
            </MotionLink>
          </div>

          <div ref={quickGridRef} className="account__quick-grid">
            <MotionLink
              to="/orders"
              className="account__quick-card"
              whileHover={{
                y: -7,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.985,
              }}
            >
              <div className="account__quick-image">
                <img loading="lazy" decoding="async" src={fashionImages.order} alt="Order history" />

                <div className="account__quick-image-overlay" />
              </div>

              <div className="account__quick-content">
                <div className="account__quick-top">
                  <span>01</span>

                  <Package size={19} strokeWidth={1.4} />
                </div>

                <div className="account__quick-bottom">
                  <div>
                    <small>YOUR ORDERS</small>

                    <h3>Order history</h3>
                  </div>

                  <ArrowRight size={18} strokeWidth={1.4} />
                </div>
              </div>
            </MotionLink>

            <MotionLink
              to="/wishlist"
              className="account__quick-card"
              whileHover={{
                y: -7,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.985,
              }}
            >
              <div className="account__quick-image">
                <img loading="lazy" decoding="async" src={fashionImages.wishlist} alt="Wishlist" />

                <div className="account__quick-image-overlay" />
              </div>

              <div className="account__quick-content">
                <div className="account__quick-top">
                  <span>02</span>

                  <Heart size={19} strokeWidth={1.4} />
                </div>

                <div className="account__quick-bottom">
                  <div>
                    <small>SAVED PIECES</small>

                    <h3>Your wishlist</h3>
                  </div>

                  <ArrowRight size={18} strokeWidth={1.4} />
                </div>
              </div>
            </MotionLink>

            <MotionLink
              to="/cart"
              className="account__quick-card"
              whileHover={{
                y: -7,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.985,
              }}
            >
              <div className="account__quick-image">
                <img loading="lazy" decoding="async" src={fashionImages.bag} alt="Shopping bag" />

                <div className="account__quick-image-overlay" />
              </div>

              <div className="account__quick-content">
                <div className="account__quick-top">
                  <span>03</span>

                  <ShoppingBag size={19} strokeWidth={1.4} />
                </div>

                <div className="account__quick-bottom">
                  <div>
                    <small>READY TO GO</small>

                    <h3>Shopping bag</h3>
                  </div>

                  <ArrowRight size={18} strokeWidth={1.4} />
                </div>
              </div>
            </MotionLink>
          </div>

          <section ref={editorialRef} className="account__editorial">
            <img
              src={fashionImages.editorial}
              alt="Aurevyn editorial collection"
            />

            <div className="account__editorial-overlay" />

            <div className="account__editorial-content">
              <p className="account__eyebrow">THE AUREVYN EDIT</p>

              <h3>
                Dress
                <span>with intention.</span>
              </h3>

              <p>
                Explore silhouettes, textures and timeless pieces curated for
                the season.
              </p>

              <MotionLink
                to="/shop"
                className="account__editorial-link"
                whileHover={{
                  gap: 12,
                }}
              >
                Shop the edit
                <ArrowRight size={16} strokeWidth={1.5} />
              </MotionLink>
            </div>
          </section>

          <section ref={profileRef} className="account__profile-section">
            <div className="account__section-top">
              <div>
                <p className="account__eyebrow">PROFILE</p>

                <h3>Personal details</h3>
              </div>

              <MotionLink
                to="/account/settings"
                className="account__edit-link"
                whileHover={{
                  gap: 11,
                }}
              >
                Edit profile
                <ArrowRight size={14} strokeWidth={1.5} />
              </MotionLink>
            </div>

            <div className="account__profile-details">
              <div className="account__detail">
                <span>FULL NAME</span>

                <strong>{user.name}</strong>
              </div>

              <div className="account__detail">
                <span>EMAIL ADDRESS</span>

                <strong>{user.email}</strong>
              </div>

              <div className="account__detail">
                <span>ACCOUNT TYPE</span>

                <strong>
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </strong>
              </div>
            </div>
          </section>

          <section ref={ordersRef} className="account__orders">
            <div className="account__orders-image">
              <img loading="lazy" decoding="async" src={fashionImages.hero} alt="Aurevyn collection" />

              <div className="account__orders-image-overlay" />
            </div>

            <div className="account__orders-content">
              <p className="account__eyebrow">YOUR JOURNEY</p>

              <h3>
                Your first
                <span>piece awaits.</span>
              </h3>

              <p>
                Your AUREVYN orders will appear here after your first purchase.
                Discover pieces made to define your style.
              </p>

              <MotionLink
                to="/shop"
                className="account__primary-btn"
                whileHover={{
                  y: -3,
                  gap: 13,
                  borderRadius: 10,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                Discover AUREVYN
                <ArrowRight size={17} strokeWidth={1.6} />
              </MotionLink>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Account;

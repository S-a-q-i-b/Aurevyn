import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrdersApi } from "../../services/orderApi";

import "./Orders.css";

gsap.registerPlugin(ScrollTrigger);

const MotionLink = motion.create(Link);

const formatPrice = (price) => {
  return `PKR ${Number(price || 0).toLocaleString("en-PK")}`;
};

const formatDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatOrderId = (order) => {
  if (!order?._id) {
    return "AUR-ORDER";
  }

  return `AUR-${order._id.slice(-6).toUpperCase()}`;
};

const formatStatus = (status) => {
  if (!status) {
    return "Pending";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusIcon = (status) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "delivered") {
    return <Check size={13} strokeWidth={2} />;
  }

  if (normalizedStatus === "shipped") {
    return <Truck size={13} strokeWidth={1.8} />;
  }

  return <Package size={13} strokeWidth={1.8} />;
};

const Orders = () => {
  const pageRef = useRef(null);
  const ordersRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrdersApi();

        setOrders(Array.isArray(response?.orders) ? response.orders : []);
      } catch (err) {
        console.error("GET ORDERS ERROR:", err);

        if (err.response?.status === 401) {
          setError("Please login to view your orders.");
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load your orders.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const orderCountText = useMemo(() => {
    return `${String(orders.length).padStart(2, "0")} ${
      orders.length === 1 ? "ORDER" : "ORDERS"
    }`;
  }, [orders.length]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".orders__hero-content",
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".orders__back",
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.1,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        ".orders__hero-line",
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1.2,
          delay: 0.25,
          transformOrigin: "left center",
          ease: "power3.out",
        },
      );

      if (ordersRef.current) {
        const cards =
          ordersRef.current.querySelectorAll(".orders__card");

        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 55,
              rotateX: 4,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              stagger: 0.16,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ordersRef.current,
                start: "top 82%",
                once: true,
              },
            },
          );
        }
      }

      gsap.to(".orders__hero-glow", {
        x: 90,
        y: -35,
        scale: 1.12,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orders__hero-orbit", {
        y: 90,
        rotation: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".orders__hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [loading]);

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId,
    );
  };

  return (
    <main ref={pageRef} className="orders-page">
      <section className="orders__hero">
        <div className="orders__hero-glow" />

        <div className="orders__hero-orbit">
          <span />
          <span />
        </div>

        <div className="orders__hero-inner">
          <motion.div
            className="orders__hero-top"
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <MotionLink
              to="/account"
              className="orders__back"
              whileHover={{
                x: -5,
                gap: 12,
                color: "#e7dfd1",
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="orders__back-icon"
              />
              Back to account
            </MotionLink>
          </motion.div>

          <div className="orders__hero-content">
            <motion.p
              className="orders__eyebrow"
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
            >
              AUREVYN / ORDER HISTORY
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: 45,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Your
              <span>journey.</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Every order, every piece, every moment that becomes
              part of your AUREVYN story.
            </motion.p>

            <motion.div
              className="orders__hero-meta"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.58,
              }}
            >
              <span>CURATED WITH INTENTION</span>

              <i />

              <span>MADE FOR YOUR STYLE</span>
            </motion.div>
          </div>

          <div className="orders__hero-bottom">
            <div className="orders__hero-line" />

            <span className="orders__hero-count">
              {orderCountText}
            </span>
          </div>
        </div>
      </section>

      <section className="orders__content">
        <div className="orders__content-heading">
          <div>
            <p className="orders__eyebrow">ORDER HISTORY</p>

            <h2>
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </h2>
          </div>

          <MotionLink
            to="/shop"
            className="orders__shop-link"
            whileHover={{
              gap: 13,
            }}
          >
            Continue shopping
            <ArrowRight size={15} strokeWidth={1.5} />
          </MotionLink>
        </div>

        {loading ? (
          <motion.div
            className="orders__empty"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="orders__empty-icon">
              <ShoppingBag
                size={28}
                strokeWidth={1.2}
              />
            </div>

            <p className="orders__eyebrow">AUREVYN</p>

            <h3>
              Loading your
              <span>journey.</span>
            </h3>

            <p>
              Gathering your latest orders and preparing them for
              you.
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="orders__empty"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="orders__empty-icon">
              <X size={28} strokeWidth={1.2} />
            </div>

            <p className="orders__eyebrow">ORDER HISTORY</p>

            <h3>
              We couldn't load
              <span>your orders.</span>
            </h3>

            <p>{error}</p>

            {error.includes("login") && (
              <MotionLink
                to="/login"
                className="orders__empty-button"
                whileHover={{
                  y: -3,
                  gap: 13,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                Login to continue
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                />
              </MotionLink>
            )}
          </motion.div>
        ) : orders.length > 0 ? (
          <div ref={ordersRef} className="orders__list">
            {orders.map((order, index) => {
              const isExpanded =
                expandedOrder === order._id;

              const displayStatus = formatStatus(
                order.status,
              );

              return (
                <motion.article
                  key={order._id}
                  className="orders__card"
                  layout
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    layout: {
                      duration: 0.4,
                    },
                  }}
                >
                  <div className="orders__card-top">
                    <div className="orders__order-number">
                      <motion.span
                        whileHover={{
                          scale: 1.1,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </motion.span>

                      <div>
                        <small>ORDER</small>

                        <strong>
                          {formatOrderId(order)}
                        </strong>
                      </div>
                    </div>

                    <motion.div
                      className={`orders__status orders__status--${(
                        order.status || "pending"
                      ).toLowerCase()}`}
                      animate={{
                        opacity: 1,
                      }}
                      initial={{
                        opacity: 0,
                      }}
                      transition={{
                        delay: 0.15 + index * 0.1,
                      }}
                    >
                      {getStatusIcon(order.status)}

                      {displayStatus}
                    </motion.div>
                  </div>

                  <div className="orders__card-body">
                    <div className="orders__visual">
                      <div className="orders__items-preview">
                        {order.items?.slice(0, 3).map(
                          (item, itemIndex) => (
                            <motion.div
                              key={`${item.productId || item.name}-${itemIndex}`}
                              className="orders__item-thumb"
                              initial={{
                                opacity: 0,
                                scale: 0.85,
                                x: 18,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                              }}
                              transition={{
                                duration: 0.55,
                                delay: itemIndex * 0.1,
                                ease: [
                                  0.22,
                                  1,
                                  0.36,
                                  1,
                                ],
                              }}
                              whileHover={{
                                y: -8,
                                scale: 1.05,
                                zIndex: 5,
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                              />

                              <span />
                            </motion.div>
                          ),
                        )}

                        {(order.items?.length || 0) > 3 && (
                          <div className="orders__item-more">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="orders__visual-label">
                        <ShoppingBag
                          size={13}
                          strokeWidth={1.5}
                        />

                        {order.items?.length || 0}{" "}
                        {order.items?.length === 1
                          ? "piece"
                          : "pieces"}
                      </div>
                    </div>

                    <div className="orders__summary">
                      <div>
                        <span>PLACED</span>

                        <strong>
                          {formatDate(order.createdAt)}
                        </strong>
                      </div>

                      <div>
                        <span>ITEMS</span>

                        <strong>
                          {order.items?.length || 0}
                        </strong>
                      </div>

                      <div>
                        <span>TOTAL</span>

                        <strong>
                          {formatPrice(order.total)}
                        </strong>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      className="orders__view-button"
                      onClick={() =>
                        toggleOrder(order._id)
                      }
                      whileHover={{
                        backgroundColor: "#e3ddcf",
                        color: "#25211c",
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                    >
                      {isExpanded
                        ? "Hide details"
                        : "View details"}

                      <motion.span
                        animate={{
                          rotate: isExpanded ? 180 : 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <ChevronDown
                          size={16}
                          strokeWidth={1.5}
                        />
                      </motion.span>
                    </motion.button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        className="orders__details"
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        transition={{
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div className="orders__details-inner">
                          <div className="orders__details-heading">
                            <div>
                              <p className="orders__eyebrow">
                                ORDER DETAILS
                              </p>

                              <h3>Your pieces</h3>
                            </div>

                            <ChevronUp
                              size={18}
                              strokeWidth={1.3}
                            />
                          </div>

                          <div className="orders__products">
                            {(order.items || []).map(
                              (item, itemIndex) => (
                                <motion.div
                                  key={`${item.productId || item.name}-${itemIndex}`}
                                  className="orders__product"
                                  initial={{
                                    opacity: 0,
                                    x: -20,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                  }}
                                  transition={{
                                    delay: itemIndex * 0.1,
                                  }}
                                >
                                  <motion.div
                                    className="orders__product-image"
                                    whileHover={{
                                      scale: 1.04,
                                    }}
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                    />
                                  </motion.div>

                                  <div className="orders__product-info">
                                    <small>
                                      {item.category ||
                                        "AUREVYN"}
                                    </small>

                                    <h4>{item.name}</h4>

                                    <div className="orders__product-meta">
                                      {item.size && (
                                        <span>
                                          Size {item.size}
                                        </span>
                                      )}

                                      {item.color && (
                                        <span>
                                          {item.color}
                                        </span>
                                      )}

                                      <span>
                                        Qty {item.quantity}
                                      </span>
                                    </div>
                                  </div>

                                  <strong className="orders__product-price">
                                    {formatPrice(
                                      Number(item.price) *
                                        Number(
                                          item.quantity || 1,
                                        ),
                                    )}
                                  </strong>
                                </motion.div>
                              ),
                            )}
                          </div>

                          <div className="orders__total">
                            <span>ORDER TOTAL</span>

                            <strong>
                              {formatPrice(order.total)}
                            </strong>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="orders__empty"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="orders__empty-icon">
              <ShoppingBag
                size={28}
                strokeWidth={1.2}
              />
            </div>

            <p className="orders__eyebrow">YOUR JOURNEY</p>

            <h3>
              Your first piece
              <span>awaits.</span>
            </h3>

            <p>
              You haven't placed an order yet. Discover the
              AUREVYN collection and find something that feels
              like you.
            </p>

            <MotionLink
              to="/shop"
              className="orders__empty-button"
              whileHover={{
                y: -3,
                gap: 13,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              Explore collection
              <ArrowRight
                size={16}
                strokeWidth={1.5}
              />
            </MotionLink>
          </motion.div>
        )}

        <div className="orders__cta">
          <div>
            <p className="orders__eyebrow">
              STILL LOOKING?
            </p>

            <h3>
              Find your next
              <span>signature piece.</span>
            </h3>
          </div>

          <MotionLink
            to="/shop"
            className="account__primary-btn"
            whileHover={{
              y: -3,
              gap: 20,
              borderRadius: 10,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            Shop AUREVYN
            <ArrowRight
              size={17}
              strokeWidth={1.6}
            />
          </MotionLink>
        </div>
      </section>
    </main>
  );
};

export default Orders;

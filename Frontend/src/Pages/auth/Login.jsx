import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useAuth } from "../../context/AuthContext";

import "./Auth.css";

gsap.registerPlugin(ScrollTrigger);

const MotionLink = motion.create(Link);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const pageRef = useRef(null);
  const glowRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(
        ".auth-page__container",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
      );


      gsap.fromTo(
        ".auth-page__field",
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.25,
          ease: "power3.out",
        },
      );

      // Submit reveal
      gsap.fromTo(
        ".auth-page__submit",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.55,
          ease: "power3.out",
        },
      );

      // Bottom switch reveal
      gsap.fromTo(
        ".auth-page__switch",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.7,
          ease: "power3.out",
        },
      );

      // Ambient gold movement
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: 45,
          y: -25,
          scale: 1.08,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ScrollTrigger
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          {
            y: 20,
          },
          {
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // LOGIN
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(formData);

      if (!data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to connect to server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main ref={pageRef} className="auth-page auth-page--login">


      <div ref={glowRef} className="auth-page__ambient" />

      <div className="auth-page__container">
        <motion.div
          className="auth-page__content"
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
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* =====================================
              LOGO
          ====================================== */}

          <motion.div
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
              delay: 0.1,
            }}
          >
            <MotionLink
              to="/"
              className="auth-page__logo"
              whileHover={{
                letterSpacing: "0.28em",
                color: "#c9a66a",
              }}
              transition={{
                duration: 0.35,
              }}
            >
              AUREVYN
            </MotionLink>
          </motion.div>

          {/* =====================================
              HEADING
          ====================================== */}

          <motion.div
            className="auth-page__heading"
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
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.p
              className="auth-page__eyebrow"
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.25,
              }}
            >
              WELCOME BACK
            </motion.p>

            <h1>Login your account</h1>

            <p>Enter your details to continue your Aurevyn experience.</p>
          </motion.div>

          {/* =====================================
              ERROR
          ====================================== */}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="auth-page__error"
                role="alert"
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* =====================================
              FORM
          ====================================== */}

          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="auth-page__form"
          >
            {/* EMAIL */}

            <motion.div
              className="auth-page__field"
              whileFocus={{
                y: -2,
              }}
            >
              <label htmlFor="email">Email</label>

              <motion.input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                whileFocus={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.25,
                }}
              />
            </motion.div>

            {/* PASSWORD */}

            <motion.div
              className="auth-page__field"
              whileFocus={{
                y: -2,
              }}
            >
              <label htmlFor="password">Password</label>

              <div className="auth-page__password">
                <motion.input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  whileFocus={{
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                />

                {/* PASSWORD TOGGLE */}

                <motion.button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="auth-page__password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  whileHover={{
                    scale: 1.1,
                    color: "#c9a66a",
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.span
                        key="eye-off"
                        initial={{
                          opacity: 0,
                          rotate: -20,
                          scale: 0.7,
                        }}
                        animate={{
                          opacity: 1,
                          rotate: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          rotate: 20,
                          scale: 0.7,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        <EyeOff size={18} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="eye"
                        initial={{
                          opacity: 0,
                          rotate: 20,
                          scale: 0.7,
                        }}
                        animate={{
                          opacity: 1,
                          rotate: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          rotate: -20,
                          scale: 0.7,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        <Eye size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>



            <motion.button
              type="submit"
              className="auth-page__submit"
              disabled={loading}
              whileHover={
                !loading
                  ? {
                      y: -4,
                      scale: 1.015,
                      backgroundColor: "#d0ad6a",
                      borderRadius:10
                    }
                  : {}
              }
              whileTap={
                !loading
                  ? {
                      scale: 0.97,
                    }
                  : {}
              }
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {loading ? (
                <motion.span
                  className="auth-page__submit-loading"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <LoaderCircle size={18} className="auth-page__spinner" />
                  Login...
                </motion.span>
              ) : (
                <motion.span
                  className="auth-page__submit-content"
                  whileHover={{
                    gap: 12,
                  }}
                >
                  Login
                  <ArrowRight size={17} strokeWidth={1.5} />
                </motion.span>
              )}
            </motion.button>
          </motion.form>

          {/* =====================================
              REGISTER LINK
          ====================================== */}

          <motion.p
            className="auth-page__switch"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.8,
            }}
          >
            Don't have an account?{" "}
            <MotionLink
              to="/register"
              whileHover={{
                color: "#c9a66a",
                x: 3,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              Create one
            </MotionLink>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;

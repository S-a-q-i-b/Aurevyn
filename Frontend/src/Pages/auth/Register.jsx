
import {
  Eye,
  EyeOff,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useAuth } from "../../context/AuthContext";

import "./Auth.css";

gsap.registerPlugin(ScrollTrigger);

const MotionLink = motion.create(Link);

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const pageRef = useRef(null);
  const glowRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
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
          stagger: 0.1,
          delay: 0.25,
          ease: "power3.out",
        },
      );

      // Submit button reveal
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
          delay: 0.65,
          ease: "power3.out",
        },
      );

      // Switch text reveal
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
          delay: 0.8,
          ease: "power3.out",
        },
      );

      // Small floating background movement
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

      // ScrollTrigger for form
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
  // SUBMIT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const data = await register(formData);

      if (!data.success) {
        setError(
          data.message || "Registration failed.",
        );
        return;
      }

      navigate("/login");
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
    <main
      ref={pageRef}
      className="auth-page auth-page--register"
    >
      {/* =====================================
          AMBIENT BACKGROUND
      ====================================== */}

      <div
        ref={glowRef}
        className="auth-page__ambient"
      />

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
              JOIN AUREVYN
            </motion.p>

            <h1>Create your account</h1>

            <p>
              Create an account and make every look
              your own.
            </p>
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
            {/* NAME */}

            <motion.div
              className="auth-page__field"
              whileFocus={{
                y: -2,
              }}
            >
              <label htmlFor="name">
                Full Name
              </label>

              <motion.input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                whileFocus={{
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.25,
                }}
              />
            </motion.div>

            {/* EMAIL */}

            <motion.div
              className="auth-page__field"
              whileFocus={{
                y: -2,
              }}
            >
              <label htmlFor="email">
                Email
              </label>

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
              <label htmlFor="password">
                Password
              </label>

              <div className="auth-page__password">
                <motion.input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  whileFocus={{
                    scale: 1.01,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                />

                <motion.button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="auth-page__password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <LoaderCircle
                    size={18}
                    className="auth-page__spinner"
                  />

                  Creating account...
                </motion.span>
              ) : (
                <motion.span
                  className="auth-page__submit-content"
                  whileHover={{
                    gap: 12,
                  }}
                >
                  Create Account

                  <ArrowRight
                    size={17}
                    strokeWidth={1.5}
                  />
                </motion.span>
              )}
            </motion.button>
          </motion.form>

          {/* =====================================
              SWITCH
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
            Already have an account?{" "}

            <MotionLink
              to="/login"
              whileHover={{
                color: "#c9a66a",
                x: 3,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              Sign in
            </MotionLink>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
};

export default Register;


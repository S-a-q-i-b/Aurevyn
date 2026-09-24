import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { AiFillFacebook } from "react-icons/ai";
import { FaSquareInstagram } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";

import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer__glow footer__glow--one" />
      <div className="footer__glow footer__glow--two" />

      <div className="footer__container">
        <div className="footer__intro">
          <div className="footer__eyebrow">
            <span />
            THE AUREVYN EDIT
            <span />
          </div>

          <div className="footer__intro-content">
            <h2>
              Define your
              <br />
              <em>own style.</em>
            </h2>

            <Link to="/shop" className="footer__shop-button">
              <span>Explore collection</span>
              <ArrowRight size={17} strokeWidth={1.7} />
            </Link>
          </div>
        </div>

        <div className="footer__divider" />

        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              AUREVYN
            </Link>

            <div className="footer__brand-line" />

            <p>
              Contemporary clothing for people who define their own style.
              Crafted with intention, designed to be remembered.
            </p>

            <div className="footer__socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="insta"
              >
                <FaSquareInstagram size={16} />
                <span>Instagram</span>
                <ArrowUpRight size={13} />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="facebook"
              >
                <AiFillFacebook size={16} />
                <span>Facebook</span>
                <ArrowUpRight size={13} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="you"
              >
                <IoLogoYoutube size={17} />
                <span>YouTube</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          <div className="footer__columns">
            <div className="footer__column">
              <h3>Explore</h3>

              <Link to="/">
                <span>Home</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/shop">
                <span>Shop</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/shop?category=men">
                <span>Men</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/shop?category=women">
                <span>Women</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/shop?category=new-arrivals">
                <span>New Arrivals</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/shop?category=sale">
                <span>Sale</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="footer__column">
              <h3>Help</h3>

              <Link to="/contact">
                <span>Contact</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/shipping">
                <span>Shipping & Delivery</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/returns">
                <span>Returns</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/faq">
                <span>FAQ</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/privacy">
                <span>Privacy</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/terms">
                <span>Terms</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="footer__column">
              <h3>Account</h3>

              <Link to="/login">
                <span>Login</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/register">
                <span>Register</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/profile">
                <span>My Account</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/wishlist">
                <span>Wishlist</span>
                <ArrowUpRight size={13} />
              </Link>

              <Link to="/cart">
                <span>Cart</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer__middle">
          <div className="footer__est">
            <span className="footer__est-dot" />
            AUREVYN / EST. 2026
          </div>

          <button
            type="button"
            className="footer__top-button"
            onClick={scrollToTop}
          >
            <span>Back to top</span>
            <span className="footer__top-icon">
              <ArrowUp size={15} strokeWidth={1.7} />
            </span>
          </button>
        </div>

        <div className="footer__bottom">
          <span>© 2026 AUREVYN. All rights reserved.</span>

          <span className="footer__bottom-center">DESIGNED WITH INTENTION</span>

          <Link to="/" className="footer__bottom-link">
            AUREVYN
          </Link>
        </div>

        <div className="footer__watermark">AUREVYN</div>
      </div>
    </footer>
  );
};

export default Footer;

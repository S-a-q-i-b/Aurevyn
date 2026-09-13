import { ArrowUp } from "lucide-react";
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
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              AUREVYN
            </Link>

            <p>Contemporary clothing for people who define their own style.</p>

            <div className="footer__socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaSquareInstagram size={16} />; Instagram
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <AiFillFacebook size={16} />
                Facebook
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <IoLogoYoutube size={16} />
                YouTube
              </a>
            </div>
          </div>

          <div className="footer__columns">
            <div className="footer__column">
              <h3>Explore</h3>

              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/shop?category=men">Men</Link>
              <Link to="/shop?category=women">Women</Link>
              <Link to="/shop?category=new-arrivals">New Arrivals</Link>
              <Link to="/shop?category=sale">Sale</Link>
            </div>

            <div className="footer__column">
              <h3>Help</h3>

              <Link to="/contact">Contact</Link>
              <Link to="/shipping">Shipping & Delivery</Link>
              <Link to="/returns">Returns</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>

            <div className="footer__column">
              <h3>Account</h3>

              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/profile">My Account</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">Cart</Link>
            </div>
          </div>
        </div>

        <div className="footer__middle">
          <span>AUREVYN / EST. 2026</span>

          <button
            type="button"
            className="footer__top-button"
            onClick={scrollToTop}
          >
            Back to top
            <ArrowUp size={16} strokeWidth={1.7} />
          </button>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Aurevyn. All rights reserved.</span>

          <span>Designed with intention.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

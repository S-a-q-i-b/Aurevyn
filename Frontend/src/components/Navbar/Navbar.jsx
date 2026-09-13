import {
  ArrowUpRight,
  Crown,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import SearchOverlay from "../SearchOverlay/SearchOverlay";

import "./Navbar.css";

const Navbar = () => {
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      closeMenu();

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar__container">
     

        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span>AUREVYN</span>
          <i />
        </Link>



        <nav
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
        >
          <Link
            to="/"
            className={isActive("/") ? "is-active" : ""}
            onClick={closeMenu}
          >
            <span>Home</span>
          </Link>

          <Link
            to="/shop"
            className={isActive("/shop") ? "is-active" : ""}
            onClick={closeMenu}
          >
            <span>Shop</span>
          </Link>

          <Link
            to="/men"
            className={isActive("/men") ? "is-active" : ""}
            onClick={closeMenu}
          >
            <span>Men</span>
          </Link>

          <Link
            to="/women"
            className={isActive("/women") ? "is-active" : ""}
            onClick={closeMenu}
          >
            <span>Women</span>
          </Link>

          <Link to="/shop?category=new-arrivals" onClick={closeMenu}>
            <span>New Arrivals</span>
          </Link>

          <Link to="/shop?category=sale" onClick={closeMenu}>
            <span>Sale</span>
          </Link>

          {/* Mobile Auth */}

          {isAuthenticated ? (
            <Link
              to="/account"
              className="navbar__mobile-auth"
              onClick={closeMenu}
            >
              <UserRound size={17} strokeWidth={1.7} />

              <span>{user?.name || "Account"}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="navbar__mobile-auth"
              onClick={closeMenu}
            >
              <LogIn size={17} strokeWidth={1.7} />

              <span>Login</span>
            </Link>
          )}

          {/* Mobile Admin */}

          {user?.role === "admin" && (
            <Link
              to="/admin/products"
              className="navbar__mobile-admin"
              onClick={closeMenu}
            >
              <Crown size={16} strokeWidth={1.7} />

              <span>Admin Studio</span>

              <ArrowUpRight size={14} strokeWidth={1.6} />
            </Link>
          )}
        </nav>

        {/* Actions */}

        <div className="navbar__actions">
          {/* Search */}

          <button
            type="button"
            className="navbar__action"
            aria-label="Search"
            title="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={21} strokeWidth={1.7} />
          </button>

          {/* Admin */}

          {user?.role === "admin" && (
            <Link
              to="/admin/products"
              className={`navbar__admin ${
                isActive("/admin/products") ? "is-active" : ""
              }`}
              aria-label="Admin Studio"
              title="Admin Studio"
              onClick={closeMenu}
            >
              <Crown size={16} strokeWidth={1.8} />

              <span>Admin</span>

              <ArrowUpRight size={13} strokeWidth={1.7} />
            </Link>
          )}

          {/* Account */}

          {isAuthenticated ? (
            <div className="navbar__account">
              <Link
                to="/account"
                className="navbar__action"
                aria-label="My account"
                title={user?.name || "My account"}
              >
                <UserRound size={21} strokeWidth={1.7} />
              </Link>

              <button
                type="button"
                className="navbar__logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut size={16} strokeWidth={1.7} />

                <span>{loggingOut ? "Signing out..." : "Logout"}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar__action navbar__login-action"
              aria-label="Login"
              title="Login"
            >
              <LogIn size={21} strokeWidth={1.7} />
            </Link>
          )}

          {/* Cart */}

          <Link
            to="/cart"
            className="navbar__action navbar__cart-action"
            aria-label="Shopping bag"
            title="Shopping bag"
          >
            <ShoppingBag size={21} strokeWidth={1.7} />

            <span className="navbar__cart-count">{cartCount}</span>
          </Link>

          {/* Mobile menu */}

          <button
            type="button"
            className="navbar__menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={23} strokeWidth={1.7} />
            ) : (
              <Menu size={23} strokeWidth={1.7} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}

      {menuOpen && (
        <button
          type="button"
          className="navbar__mobile-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;

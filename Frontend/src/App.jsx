import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import PageTransition from "./components/PageTransition/PageTransition";

const Home = lazy(() => import("./Pages/Home/Home"));
const Shop = lazy(() => import("./Pages/Shop/Shop"));
const Account = lazy(() => import("./Pages/Account/Account"));
const Settings = lazy(() => import("./Pages/Account/Settings"));
const Notifications = lazy(() => import("./Pages/Account/Notifications"));
const Preferences = lazy(() => import("./Pages/Account/Preferences"));
const Security = lazy(() => import("./Pages/Account/Security"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Men = lazy(() => import("./Pages/Category/Men"));
const Women = lazy(() => import("./Pages/Category/Women"));
const Checkout = lazy(() => import("./Pages/Checkout/Checkout"));
const Orders = lazy(() => import("./Pages/Orders/Orders"));
const ProductDetails = lazy(
  () => import("./Pages/ProductDetails/ProductDetails"),
);
const Wishlist = lazy(() => import("./Pages/Wishlist/Wishlist"));
const Login = lazy(() => import("./Pages/auth/Login"));
const Register = lazy(() => import("./Pages/auth/Register"));
const AdminProducts = lazy(
  () => import("./Pages/Admin/Products/AdminProducts"),
);

const RouteFallback = () => (
  <div className="route-fallback" role="status" aria-live="polite">
    <span>AUREVYN</span>
    <i />
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<RouteFallback />}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/account/settings" element={<Settings />} />
            <Route path="/account/settings/security" element={<Security />} />
            <Route
              path="/account/settings/notifications"
              element={<Notifications />}
            />
            <Route
              path="/account/settings/preferences"
              element={<Preferences />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </>
  );
}

export default App;

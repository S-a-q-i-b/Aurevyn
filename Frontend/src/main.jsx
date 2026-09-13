import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Preloader from "./components/Preloader/Preloader";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";
import GlobalCursor from "./components/GlobalCursor/GlobalCursor";
import "./styles/global.css";
import "./styles/variables.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Preloader>
              <SmoothScroll>
                <GlobalCursor />
                <App />
              </SmoothScroll>
            </Preloader>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

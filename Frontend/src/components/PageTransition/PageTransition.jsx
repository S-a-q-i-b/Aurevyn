import { useLocation } from "react-router-dom";
import "./PageTransition.css";

const PageTransition = ({ children }) => {
  useLocation();

  return <div className="page-transition">{children}</div>;
};

export default PageTransition;

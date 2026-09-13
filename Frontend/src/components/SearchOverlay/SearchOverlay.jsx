import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSearchSuggestionsApi } from "../../services/productApi";
import "./SearchOverlay.css";

const SearchOverlay = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(async () => {
      if (!query.trim()) { setSuggestions([]); return; }
      try { const response = await getSearchSuggestionsApi(query.trim()); setSuggestions(response.suggestions || []); } catch { setSuggestions([]); }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  const submit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return <AnimatePresence>{open && <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button className="search-overlay__close" type="button" onClick={onClose} aria-label="Close search"><X size={24} /></button>
    <div className="search-overlay__inner">
      <span className="search-overlay__eyebrow">AUREVYN / SEARCH</span>
      <form onSubmit={submit} className="search-overlay__form">
        <Search size={28} strokeWidth={1.3} />
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pieces, categories, brands..." aria-label="Search products" />
      </form>
      <div className="search-overlay__suggestions">
        {suggestions.map((item) => <Link key={item._id} to={`/product/${item._id}`} onClick={onClose} className="search-overlay__item"><img loading="lazy" decoding="async" src={item.image} alt="" loading="lazy" width="56" height="72" /><span><strong>{item.name}</strong><small>{item.category}</small></span></Link>)}
        {query && !suggestions.length && <p className="search-overlay__empty">No matching pieces yet.</p>}
      </div>
    </div>
  </motion.div>}</AnimatePresence>;
};

export default SearchOverlay;

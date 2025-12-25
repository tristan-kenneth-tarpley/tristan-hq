import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import AttentionLab from "./pages/AttentionLab";
import RingAttention from "./pages/RingAttention";
import SelfAttention from "./pages/SelfAttention";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attention" element={<AttentionLab />} />
        <Route path="/ring-attention" element={<RingAttention />} />
        <Route path="/self-attention" element={<SelfAttention />} />
      </Routes>
    </Router>
  );
}

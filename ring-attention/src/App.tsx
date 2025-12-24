import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AttentionLab from "./pages/AttentionLab";
import RingAttention from "./pages/RingAttention";
import SelfAttention from "./pages/SelfAttention";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attention" element={<AttentionLab />} />
        <Route path="/ring-attention" element={<RingAttention />} />
        <Route path="/self-attention" element={<SelfAttention />} />
      </Routes>
    </Router>
  );
}

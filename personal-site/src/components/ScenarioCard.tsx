import { BookOpen, BookMarked, Zap, Sparkles } from "lucide-react";
import { type Mode } from "../constants";
import { motion } from "framer-motion";

interface ScenarioCardProps {
  mode: Mode;
  storyText: string;
  techText: string;
}

export const ScenarioCard = ({
  mode,
  storyText,
  techText,
}: ScenarioCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,242,255,0.05)]"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <BookOpen size={120} />
      </div>

      {/* Decorative Corner Sparkle */}
      <div className="absolute top-4 right-4 text-[#00f2ff]/20">
        <Sparkles size={16} />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center">
        <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-[#00f2ff]/20 to-[#ff00e5]/20 flex items-center justify-center text-[#00f2ff] border border-white/10 shadow-lg">
          {mode === "story" ? <BookMarked size={28} /> : <Zap size={28} />}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.3em] mb-1 italic">
            The Scenario
          </h3>
          <p className="text-blue-100/70 leading-relaxed italic text-sm font-medium">
            {mode === "story" ? storyText : techText}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

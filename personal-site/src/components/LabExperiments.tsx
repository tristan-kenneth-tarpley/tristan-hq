import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, BookOpen } from "lucide-react";

export default function LabExperiments() {
  return (
    <section className="space-y-8 relative">
      <div className="flex items-center justify-center gap-4">
        <div className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" />
        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#00f2ff]">
          Lab Experiments
        </h2>
        <div className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" />
      </div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md mx-auto">
        <Link to="/attention" className="group relative">
          <div className="absolute inset-0 bg-[#00f2ff]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            className="bg-[#16164d]/80 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white/10 group-hover:border-[#00f2ff]/50 transition-all flex items-center justify-between shadow-2xl relative z-10"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20 group-hover:bg-[#00f2ff]/20 transition-all">
                <Rocket
                  size={28}
                  className="group-hover:rotate-45 transition-transform duration-500"
                />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black italic tracking-tight text-white">
                  Attention Lab
                </h2>
                <p className="text-blue-300/50 text-[10px] uppercase font-black tracking-widest mt-1">
                  Visualizing LLM attention mechanisms
                </p>
              </div>
            </div>
            <ArrowRight
              className="text-white/20 group-hover:text-[#00f2ff] group-hover:translate-x-2 transition-all"
              size={28}
            />
          </motion.div>
        </Link>

        <Link to="/essays" className="group relative">
          <div className="absolute inset-0 bg-[#ff00e5]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <motion.div
            whileHover={{ y: -8, scale: 1.05 }}
            className="bg-[#16164d]/80 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white/10 group-hover:border-[#ff00e5]/50 transition-all flex items-center justify-between shadow-2xl relative z-10"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] border border-[#ff00e5]/20 group-hover:bg-[#ff00e5]/20 transition-all">
                <BookOpen size={28} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black italic tracking-tight text-white">
                  Stuff I Wrote
                </h2>
                <p className="text-blue-300/50 text-[10px] uppercase font-black tracking-widest mt-1">
                  Essays and musings
                </p>
              </div>
            </div>
            <ArrowRight
              className="text-white/20 group-hover:text-[#ff00e5] group-hover:translate-x-2 transition-all"
              size={28}
            />
          </motion.div>
        </Link>
      </div>
    </section>
  );
}

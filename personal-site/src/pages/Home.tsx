import { motion } from "framer-motion";
import { Sparkles, Radio } from "lucide-react";
import Footer from "../components/Footer";
import Profile from "../components/Profile";
import LabExperiments from "../components/LabExperiments";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#00f2ff]/30 font-sans relative">
      {/* Space Age Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Planetary Rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 30 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border-[40px] border-[#00f2ff]/5 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: -15 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] border-[20px] border-[#ff00e5]/5 rounded-full"
        />

        {/* Starbursts */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "backOut", delay: 0.8 }}
          className="absolute top-[20%] left-[10%] text-[#00f2ff]"
        >
          <div className="animate-pulse">
            <Sparkles size={40} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 180 }}
          animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "backOut", delay: 1 }}
          className="absolute bottom-[30%] right-[15%] text-[#ff00e5]"
        >
          <div className="animate-pulse delay-700">
            <Sparkles size={32} />
          </div>
        </motion.div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl text-center"
        >
          {/* The Floating Pod Header */}
          <div className="relative mb-16">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] p-12 shadow-[0_0_50px_rgba(0,242,255,0.15)] relative z-10 transform-gpu"
            >
              {/* Retro Antenna */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-1 h-12 bg-white/20" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-4 h-4 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff]"
                />
              </div>

              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-full">
                <Radio size={12} className="text-[#00f2ff] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff]">
                  Houston, Texas
                </span>
              </div>

              <h1 className="text-7xl font-black tracking-tighter text-white mb-6 bg-gradient-to-b from-white to-[#00f2ff] bg-clip-text text-transparent italic">
                Welcome to Tristan HQ
              </h1>

              <p className="text-xl text-blue-100/70 leading-relaxed max-w-lg mx-auto font-medium italic">
                Home of tinkerings, musings, and happenings
              </p>

              {/* Jetson Stilts/Legs - Moved inside for better layering */}
              <div className="absolute top-[100%] left-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent -z-10" />
              <div className="absolute top-[100%] right-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent -z-10" />
            </motion.div>
          </div>
          <Profile />
          <LabExperiments />
        </motion.div>
        <Footer />
      </main>
    </div>
  );
}

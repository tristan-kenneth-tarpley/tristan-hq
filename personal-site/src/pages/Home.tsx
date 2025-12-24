import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Radio } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#00f2ff]/30 overflow-hidden font-sans relative">
      {/* Space Age Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Planetary Rings */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border-[40px] border-[#00f2ff]/5 rounded-full rotate-[30deg]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] border-[20px] border-[#ff00e5]/5 rounded-full rotate-[-15deg]" />

        {/* Starbursts */}
        <div className="absolute top-[20%] left-[10%] opacity-20 animate-pulse text-[#00f2ff]">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-[30%] right-[15%] opacity-20 animate-pulse delay-700 text-[#ff00e5]">
          <Sparkles size={32} />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl text-center"
        >
          {/* The Floating Pod Header */}
          <div className="relative mb-24">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] p-12 shadow-[0_0_50px_rgba(0,242,255,0.15)] relative"
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
                  Orbiting Space City (Houston)
                </span>
              </div>

              <h1 className="text-7xl font-black tracking-tighter text-white mb-6 bg-gradient-to-b from-white to-[#00f2ff] bg-clip-text text-transparent italic">
                Tristan Tarpley
              </h1>

              <p className="text-xl text-blue-100/70 leading-relaxed max-w-lg mx-auto font-medium">
                Staff Engineer at{" "}
                <span className="text-white font-black underline decoration-[#ff00e5] decoration-4 underline-offset-4">
                  Webflow
                </span>
                .
                <br />I just wanna build things...
              </p>
            </motion.div>

            {/* Jetson Stilts/Legs */}
            <div className="absolute top-[90%] left-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent -z-10" />
            <div className="absolute top-[90%] right-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent -z-10" />
          </div>

          <section className="space-y-8 relative">
            <div className="flex items-center justify-center gap-4">
              <div className="w-3 h-3 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" />
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#ff00e5]">
                Lab Experiments
              </h2>
              <div className="w-3 h-3 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" />
            </div>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md mx-auto">
              <Link to="/attention" className="group relative">
                {/* Hovering Glow Effect */}
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
                        Visualizing LLM attention mechanisms.
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="text-white/20 group-hover:text-[#00f2ff] group-hover:translate-x-2 transition-all"
                    size={28}
                  />
                </motion.div>
              </Link>
            </div>
          </section>
        </motion.div>

        {/* Space Dust Footer */}
        <div className="mt-24 text-blue-100/20 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
          <span>Stardate 2025</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>Sector: Houston</span>
        </div>
      </main>

      {/* Retro-Futurist Font Overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700;900&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
}

import { motion } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import { LINKS } from "../constants";

export default function Profile() {
  return (
    <section className="mb-20 space-y-8 relative z-20">
      <div className="flex items-center justify-center gap-4">
        <div className="w-2 h-2 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff00e5] italic">
          Profile
        </h2>
        <div className="w-2 h-2 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border-2 border-white/10 flex flex-col md:flex-row items-center gap-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" />

        {/* Profile Image Frame */}
        <div className="w-28 h-28 rounded-full border-4 border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.3)] overflow-hidden shrink-0 bg-[#0a0a2e] relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff00e5]/20 to-transparent opacity-50 z-10" />
          <div className="w-full h-full flex items-center justify-center text-[#00f2ff]/20">
            <img
              src="/headshot.JPG"
              alt="Profile Picture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-left flex-1 relative z-10">
          <h3 className="text-lg font-black text-white italic mb-2 tracking-tight uppercase">
            Tristan Tarpley
          </h3>
          <p className="text-sm text-blue-100/70 leading-relaxed font-medium italic">
            I'm a Staff Engineer + TLM at{" "}
            <a
              href="https://www.webflow.com/"
              target="_blank"
              rel="noopener"
              className="text-white font-black underline decoration-[#00f2ff] decoration-2 underline-offset-4"
            >
              Webflow
            </a>{" "}
            building generative design products. I live in Houston, Texas,
            with my wife, Andréa, and daughter, Amélie.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a
              href={LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:text-[#ff00e5] transition-colors group/link"
            >
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </a>
            <a
              href={LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:text-[#ff00e5] transition-colors group/link"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

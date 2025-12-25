import { Link } from "react-router-dom";
import {
  ArrowRight,
  CircleDot,
  LayoutGrid,
  Brain,
  Cpu,
  GraduationCap,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AttentionLab() {
  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white selection:bg-[#00f2ff]/30 font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff00e5]/5 blur-[150px] rounded-full" />
      </div>

      <nav className="max-w-5xl mx-auto px-6 pt-12 relative z-10">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-300/40 hover:text-[#00f2ff] transition-all italic"
        >
          <ArrowLeft
            size={12}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Base
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#00f2ff]/10 rounded-full border border-[#00f2ff]/20 text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] mb-6 italic shadow-[0_0_15px_rgba(0,242,255,0.1)]">
            <Sparkles size={10} className="animate-pulse" />
            Interactive Lab
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-6 italic">
            <span className="text-[#00f2ff]">Attention</span> in LLMs
          </h1>
          <p className="mb-4 text-blue-100/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic">
            Large Language Models are essentially massive neural networks
            supercharged by an{" "}
            <span className="text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4">
              Attention Mechanism
            </span>
            .
          </p>
          <p className="text-blue-100/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic">
            In an effort to better understand what's going on under the hood, I
            built a couple of visualizers. I hope it's somewhat illustrative for
            you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <PageCard
            title="Standard Attention"
            desc="The foundation of modern LLMs. Understand the quadratic memory wall and why context length is limited."
            href="/self-attention"
            icon={<LayoutGrid className="text-[#00f2ff]" size={32} />}
            mode="The Breakthrough"
          />
          <PageCard
            title="Ring Attention"
            desc="The distributed solution for infinite context. See how KV blocks rotate through a cluster without information loss."
            href="/ring-attention"
            icon={<CircleDot className="text-[#ff00e5]" size={32} />}
            mode="The Scaling Mechanism"
          />
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 w-full grid grid-cols-1 md:grid-cols-3 gap-12">
          <Feature
            icon={<Brain className="text-[#00f2ff]" size={24} />}
            title="Dual Metaphor"
            desc="Switch between 'Story Mode' for intuition and 'Tech Mode' for precision."
          />
          <Feature
            icon={<Cpu className="text-[#ff00e5]" size={24} />}
            title="Real-Time Math"
            desc="Watch Online Softmax update as context rotates through the cluster."
          />
          <Feature
            icon={<GraduationCap className="text-[#00f2ff]" size={24} />}
            title="No Information Loss"
            desc="Learn why Ring Attention is bit-perfect, unlike RAG or sliding windows."
          />
        </div>
      </main>
    </div>
  );
}

function PageCard({
  title,
  desc,
  href,
  icon,
  mode,
}: {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  mode: string;
}) {
  return (
    <Link to={href} className="group">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/5 group-hover:border-[#00f2ff]/30 transition-all h-full flex flex-col shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          {icon}
        </div>
        <div className="mb-8">{icon}</div>
        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]/60 italic">
          {mode}
        </div>
        <h2 className="text-2xl font-black mb-4 group-hover:text-[#00f2ff] transition-colors italic tracking-tight">
          {title}
        </h2>
        <p className="text-blue-100/50 text-sm leading-relaxed mb-12 flex-1 font-medium">
          {desc}
        </p>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all italic text-[#ff00e5]">
          Check it out <ArrowRight size={16} />
        </div>
      </motion.div>
    </Link>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 shadow-lg">
        {icon}
      </div>
      <h3 className="font-black text-white uppercase text-[10px] tracking-[0.3em] italic">
        {title}
      </h3>
      <p className="text-blue-100/40 text-xs leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

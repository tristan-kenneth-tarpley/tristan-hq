import { Link } from "react-router-dom";
import {
  ArrowRight,
  CircleDot,
  LayoutGrid,
  Brain,
  Cpu,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full" />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">
            Understanding LLM concepts
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Understanding Attention
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Visualizing the evolution from standard self-attention to
            distributed ring-attention.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <PageCard
            title="Standard Attention"
            desc="The foundation of modern LLMs. Understand the quadratic memory wall and why context length is limited."
            href="/self-attention"
            icon={<LayoutGrid className="text-blue-400" size={32} />}
            mode="The Quadratic Wall"
          />
          <PageCard
            title="Ring Attention"
            desc="The distributed solution for infinite context. See how KV blocks rotate through a cluster without information loss."
            href="/ring-attention"
            icon={<CircleDot className="text-purple-400" size={32} />}
            mode="Linear Scaling"
          />
        </div>

        <div className="mt-32 pt-12 border-t border-gray-900 w-full grid grid-cols-1 md:grid-cols-3 gap-12">
          <Feature
            icon={<Brain size={24} />}
            title="Dual Metaphor"
            desc="Switch between 'Story Mode' for intuition and 'Tech Mode' for precision."
          />
          <Feature
            icon={<Cpu size={24} />}
            title="Real-Time Math"
            desc="Watch Online Softmax update as context rotates through the cluster."
          />
          <Feature
            icon={<GraduationCap size={24} />}
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
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800 hover:border-gray-600 transition-all h-full flex flex-col shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          {icon}
        </div>
        <div className="mb-8">{icon}</div>
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-500/60">
          {mode}
        </div>
        <h2 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-12 flex-1">
          {desc}
        </p>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
          Explore Visualizer <ArrowRight size={16} />
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
      <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-gray-400 border border-gray-800">
        {icon}
      </div>
      <h3 className="font-bold text-white uppercase text-xs tracking-widest">
        {title}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

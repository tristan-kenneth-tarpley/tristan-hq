import { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Cpu,
  GraduationCap,
  Zap,
  Flashlight,
  Notebook,
  Calculator,
  BookOpen,
  BookMarked,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Popover from "@radix-ui/react-popover";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Constants ---
type Mode = "story" | "tech";

const STORY_DATA = [
  {
    id: 0,
    text: "The Manor House stood silent under the moonlight. Clues are hidden in every wing.",
    score: 0.4,
  },
  {
    id: 1,
    text: "At 12:00 AM, the butler was seen leaving the kitchen with a mysterious tray.",
    score: 0.95,
  },
  {
    id: 2,
    text: "A silver key was found in the rose garden, covered in fresh, dark mud.",
    score: 0.6,
  },
  {
    id: 3,
    text: "The heavy rain washed away any footprints near the library window.",
    score: 0.3,
  },
  {
    id: 4,
    text: "The clock struck twelve, echoing through the silent corridors of the east wing.",
    score: 0.5,
  },
  {
    id: 5,
    text: "The cook confirmed that everyone was in the dining hall until 11 PM sharp.",
    score: 0.2,
  },
  {
    id: 6,
    text: "A witness saw a tall shadow moving towards the safe exactly at midnight.",
    score: 0.85,
  },
  {
    id: 7,
    text: "The safe was found open; only a single blue feather was left inside.",
    score: 0.55,
  },
];

const TECH_DATA = [
  {
    id: 0,
    text: "attention_weights = softmax(Q @ K.T / sqrt(d_k))",
    score: 0.4,
  },
  { id: 1, text: "ring_communication_step(kv_buffer, next_rank)", score: 0.95 },
  { id: 2, text: "v_accum = v_accum + attention_weights @ V", score: 0.6 },
  { id: 3, text: "linear_complexity = O(N_seq / N_devices)", score: 0.3 },
  {
    id: 4,
    text: "causal_masking = torch.tril(ones(seq_len, seq_len))",
    score: 0.5,
  },
  { id: 5, text: "multi_head_projection = W_q(x), W_k(x), W_v(x)", score: 0.2 },
  { id: 6, text: "online_softmax_update(max, sum, new_weights)", score: 0.85 },
  { id: 7, text: "lossless_context_scaling = True", score: 0.55 },
];

const METAPHORS = {
  story: {
    title: "The Study Circle",
    unit: "Student",
    data: "Page",
    transfer: "Original Notes",
    searchTool: "Flashlight",
    storage: "Context Notebook",
    mathTerm: "Perfect Recall",
    query: "What was the butler doing at midnight?",
    icon: <GraduationCap size={20} />,
  },
  tech: {
    title: "Ring Attention",
    unit: "GPU Node",
    data: "Token",
    transfer: "KV Block",
    searchTool: "Query Beam",
    storage: "Attention Output",
    mathTerm: "Online Softmax",
    query: "ring_communication_step(kv_buffer, next_rank)",
    icon: <Cpu size={20} />,
  },
};

const DEFINITIONS = {
  score: {
    title: "Current Similarity Score",
    story:
      "How well this specific page matches your flashlight's search. A 95% match means this page likely contains the answer you're looking for.",
    tech: "The dot product of the Query (Q) and the current Key (K). It measures the 'relevance' of these tokens to your search vector.",
  },
  max: {
    title: "Global Max (M)",
    story:
      "The highest similarity score you've found across all steps so far. It's like keeping track of the single most important clue found yet.",
    tech: "The maximum logit encountered. We track this to perform 'Numerical Stabilization,' ensuring the exponential math doesn't overflow.",
  },
  sum: {
    title: "Accumulated Sum (S)",
    story:
      "The total 'volume' of all clues found so far. We need this total at the end to properly weight how much attention to pay to each clue.",
    tech: "The running denominator of the Softmax function. It allows us to calculate an identical result to standard attention without seeing all data at once.",
  },
};

const MemoryMeter = ({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) => {
  const isOOM = percentage >= 100;
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className={isOOM ? "text-red-500" : "text-gray-500"}>
          {label}
        </span>
        <span className={cn(isOOM ? "text-red-500" : "text-blue-400")}>
          {Math.min(100, Math.round(percentage))}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <motion.div
          className={cn(
            "h-full transition-colors duration-500",
            isOOM ? "bg-red-600" : "bg-blue-500",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<Mode>("story");
  const [sequenceLength, setSequenceLength] = useState(2048);
  const [numDevices, setNumDevices] = useState(4);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState(0);

  const m = METAPHORS[mode];
  const dataSet = mode === "story" ? STORY_DATA : TECH_DATA;

  const currentScores = useMemo(() => {
    return Array.from(
      { length: numDevices },
      (_, i) => dataSet[i % dataSet.length].score,
    );
  }, [numDevices, dataSet]);

  const currentBlockId = (selectedNode - step + numDevices) % numDevices;
  const currentBlockData = dataSet[currentBlockId % dataSet.length];
  const currentScore = currentBlockData.score;

  const [mathState, setMathState] = useState({ max: 0, sum: 0 });

  useEffect(() => {
    if (step === 0) {
      setMathState({
        max: currentScores[selectedNode % currentScores.length],
        sum: currentScores[selectedNode % currentScores.length],
      });
    } else {
      setMathState((prev) => {
        const newMax = Math.max(prev.max, currentScore);
        const newSum =
          newMax > prev.max
            ? prev.sum * Math.exp(prev.max - newMax) + currentScore
            : prev.sum + currentScore;
        return { max: newMax, sum: newSum };
      });
    }
  }, [step, selectedNode, currentScores, currentScore]);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((s) => (s + 1) % numDevices);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, numDevices]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
    setMathState({ max: 0, sum: 0 });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-blue-500/30">
      <nav className="border-b border-gray-900 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-black text-white text-xs">
              R
            </div>
            <h1 className="font-bold text-white uppercase text-[10px] tracking-tighter hidden sm:block">
              AttentionLab
            </h1>
          </div>

          <div className="flex flex-1 items-center justify-center gap-8">
            <div className="hidden md:flex flex-col gap-0.5 min-w-[140px]">
              <div className="flex justify-between items-end">
                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                  {m.data}s
                </label>
                <span className="font-mono text-[10px] font-bold text-blue-400">
                  {sequenceLength.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="512"
                max="16384"
                step="512"
                value={sequenceLength}
                onChange={(e) => {
                  setSequenceLength(parseInt(e.target.value));
                  reset();
                }}
                className="w-full h-1 accent-blue-500 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Ring Size Toggle (Sticky) */}
            <div className="hidden lg:flex flex-col gap-0.5 shrink-0">
              <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                Ring Size
              </label>
              <div className="flex bg-black/40 p-0.5 rounded-lg border border-gray-800">
                {[2, 4, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setNumDevices(n);
                      reset();
                    }}
                    className={cn(
                      "px-2.5 py-0.5 rounded text-[9px] font-bold transition-all",
                      numDevices === n
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-300",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex bg-black/40 p-0.5 rounded-lg border border-gray-800 shrink-0">
              {" "}
              <button
                onClick={reset}
                className="p-1.5 hover:bg-gray-800 rounded text-gray-500 transition-colors"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "flex items-center justify-center w-8 h-7 rounded font-bold transition-all shadow-lg active:scale-95 mx-0.5",
                  isPlaying
                    ? "bg-red-500/10 text-red-400"
                    : "bg-white text-black hover:bg-gray-100",
                )}
              >
                {isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
              </button>
              <button
                onClick={() => setStep((s) => (s + 1) % numDevices)}
                className="p-1.5 hover:bg-gray-800 rounded text-gray-500 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-baseline gap-1.5 shrink-0">
              <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                Phase
              </div>
              <div className="text-lg font-mono font-black text-white leading-none tracking-tighter">
                {step + 1}
                <span className="text-gray-500 text-xs">/</span>
                {numDevices}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-900 p-0.5 rounded-lg border border-gray-800 shrink-0">
            <button
              onClick={() => setMode("story")}
              className={cn(
                "px-3 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1.5",
                mode === "story" ? "bg-blue-600 text-white" : "text-gray-500",
              )}
            >
              <GraduationCap size={12} />{" "}
              <span className="hidden xl:inline">Story</span>
            </button>
            <button
              onClick={() => setMode("tech")}
              className={cn(
                "px-3 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1.5",
                mode === "tech" ? "bg-purple-600 text-white" : "text-gray-500",
              )}
            >
              <Cpu size={12} /> <span className="hidden xl:inline">Tech</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 leading-tight">
                {mode === "story" ? "The Study Circle" : "Ring Attention"}
              </h2>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
                {mode === "story"
                  ? "A group of students sharing the work of reading a massive 10,000-page mystery without losing a single detail."
                  : "Distributing global attention across a P2P ring of accelerators to handle massive context lengths without memory crashes."}
              </p>
            </div>

            <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen size={100} />
              </div>
              <div className="relative z-10 flex gap-6 items-center">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg">
                  {mode === "story" ? (
                    <BookMarked size={24} />
                  ) : (
                    <Zap size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">
                    The Scenario
                  </h3>
                  <p className="text-gray-300 leading-relaxed italic text-xs">
                    {mode === "story"
                      ? "Imagine a book titled 'Midnight at Manor House,' a complex 10,000-page murder mystery. A group of students is tasked with understanding exactly what happened, without skipping a single detail or relying on a vague summary."
                      : "To compute full attention without crashing a single GPU's memory, we distribute the sequence across a cluster. Each node computes local attention and then passes its data in a ring, ensuring bit-perfect global context."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[280px] flex items-center justify-center bg-gray-900/20 rounded-full border border-gray-800 shadow-2xl">
              <div className="absolute inset-8 border-2 border-dashed border-gray-800/50 rounded-full" />
              <div className="absolute inset-6 border-2 border-dashed border-gray-800/30 rounded-full" />
              {Array.from({ length: numDevices }).map((_, i) => {
                const angle = (i * 360) / numDevices - 90;
                const radius = 100;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    initial={false}
                    animate={{ x, y }}
                    onClick={() => setSelectedNode(i)}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-all -translate-x-1/2 -translate-y-1/2",
                        selectedNode === i
                          ? "bg-blue-600 border-blue-400 shadow-lg scale-125"
                          : "bg-gray-900 border-gray-800 hover:border-gray-600",
                      )}
                    >
                      {mode === "story" ? (
                        <GraduationCap size={16} />
                      ) : (
                        <Cpu size={16} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
                  Cluster
                </div>
                <div className="text-xs font-bold text-gray-400">P2P Ring</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="bg-[#0A0A0A] rounded-[1.5rem] border-2 border-gray-800 p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                  {mode === "story" ? (
                    <GraduationCap size={20} />
                  ) : (
                    <Cpu size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {m.unit} {selectedNode + 1}'s Desk
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Processing {m.transfer} from Node {currentBlockId + 1}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                  Precision
                </div>
                <div className="text-xs font-bold text-white">
                  {m.mathTerm}: <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col xl:flex-row gap-4 xl:gap-6 min-h-[300px] items-stretch">
              <div className="flex-1 flex flex-col p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Search size={14} className="text-blue-400" />
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    1. My Local Search
                  </h4>
                </div>
                <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                  <div className="text-[9px] font-bold text-blue-400 uppercase mb-1 opacity-60">
                    My Question
                  </div>
                  <div className="text-xs font-bold text-white italic line-clamp-2">
                    "{m.query}"
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center py-2">
                  <div className="relative group scale-75">
                    <div className="w-16 h-16 bg-blue-600/20 border-2 border-blue-500/40 rounded-2xl flex items-center justify-center relative z-10">
                      <Flashlight size={32} className="text-blue-400" />
                    </div>
                    <motion.div
                      className="absolute top-1/2 left-1/2 origin-top h-40 w-20 -z-10 bg-gradient-to-b from-blue-500/30 to-transparent blur-xl pointer-events-none"
                      animate={
                        isPlaying
                          ? {
                              rotate: [0, 15, -15, 0],
                              opacity: [0.3, 0.6, 0.3],
                            }
                          : { opacity: 0 }
                      }
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{ translateX: "-50%" }}
                    />
                  </div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator size={12} className="text-purple-400" />
                    <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      My Scorecard
                    </h5>
                  </div>
                  <div className="space-y-1 font-mono">
                    {[
                      {
                        id: "score",
                        label: "Similarity",
                        value: `${(currentScore * 100).toFixed(1)}%`,
                        color: "text-purple-400",
                      },
                      {
                        id: "max",
                        label: "Max (M)",
                        value: mathState.max.toFixed(4),
                        color: "text-white",
                      },
                      {
                        id: "sum",
                        label: "Sum (S)",
                        value: mathState.sum.toFixed(4),
                        color: "text-white",
                      },
                    ].map((item) => (
                      <Popover.Root key={item.id}>
                        <Popover.Trigger asChild>
                          <button className="w-full flex justify-between items-center text-[9px] p-1 hover:bg-white/5 rounded transition-colors text-left group">
                            <span className="text-gray-400 border-b border-gray-700 border-dotted group-hover:text-gray-200">
                              {item.label}
                            </span>
                            <span className={cn("font-bold", item.color)}>
                              {item.value}
                            </span>
                          </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content
                            sideOffset={5}
                            className="z-50 w-72 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200"
                          >
                            <div className="space-y-2">
                              <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                                {
                                  DEFINITIONS[
                                    item.id as keyof typeof DEFINITIONS
                                  ].title
                                }
                              </div>
                              <p className="text-xs font-sans leading-relaxed text-gray-300">
                                {mode === "story"
                                  ? DEFINITIONS[
                                      item.id as keyof typeof DEFINITIONS
                                    ].story
                                  : DEFINITIONS[
                                      item.id as keyof typeof DEFINITIONS
                                    ].tech}
                              </p>
                            </div>
                            <Popover.Arrow className="fill-gray-800" />
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center opacity-20">
                <ChevronRight
                  size={32}
                  className="text-blue-500 xl:rotate-0 rotate-90"
                />
              </div>

              <div className="w-full xl:w-64 flex flex-col p-4 bg-purple-600/5 rounded-2xl border border-purple-500/10 space-y-4 items-center justify-center shrink-0">
                <div className="text-center w-full mb-auto">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    2. Incoming Context
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="relative w-full min-h-[100px] bg-purple-600/10 rounded-xl flex flex-col items-center justify-center border-2 border-purple-400/30 p-4 shadow-lg mx-auto"
                    >
                      <div className="text-[9px] font-black text-purple-400 uppercase mb-1">
                        Block {currentBlockId + 1}
                      </div>
                      <div className="text-xs font-medium text-white text-center leading-snug line-clamp-3">
                        "{currentBlockData.text}"
                      </div>
                      {isPlaying && currentScore > 0.7 && (
                        <motion.div
                          className="absolute inset-0 border-2 border-white rounded-xl"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: 1.05, opacity: [0, 0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="relative h-12 w-1 flex flex-col items-center">
                  {isPlaying &&
                    Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full blur-[1px]"
                        animate={{ y: [0, 48], opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                </div>
                <div className="text-[9px] text-gray-600 text-center px-4 font-bold uppercase tracking-widest mb-2">
                  Comparing...
                </div>
              </div>

              <div className="flex items-center justify-center opacity-20">
                <ChevronRight
                  size={32}
                  className="text-blue-500 xl:rotate-0 rotate-90"
                />
              </div>

              <div className="flex-1 flex flex-col p-4 bg-green-600/5 rounded-2xl border border-green-500/10 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookMarked size={14} className="text-green-500" />
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    3. My Final Learnings
                  </h4>
                </div>
                <div className="relative w-full flex-1 bg-white rounded-xl shadow-xl border-2 border-gray-800 overflow-hidden min-h-[180px]">
                  <div className="p-4 h-full flex flex-col">
                    <Notebook size={20} className="text-gray-300 mb-4" />
                    <div className="space-y-1 flex-1 flex flex-col-reverse overflow-hidden">
                      {Array.from({ length: numDevices }).map((_, i) => {
                        const isFilled =
                          (numDevices + selectedNode - i) % numDevices <= step;
                        const blockData = dataSet[i % dataSet.length];
                        const blockWeight = blockData.score;
                        return (
                          <Popover.Root key={i}>
                            <Popover.Trigger asChild>
                              <motion.button
                                initial={{ height: 0 }}
                                animate={{
                                  height: isFilled
                                    ? `${blockWeight * 30}px`
                                    : 0,
                                }}
                                className={cn(
                                  "w-full rounded-sm mb-0.5 transition-colors duration-500 relative flex items-center justify-center overflow-hidden",
                                  !isFilled
                                    ? "opacity-0 pointer-events-none"
                                    : "",
                                  i === currentBlockId
                                    ? "bg-purple-500 animate-pulse"
                                    : "bg-blue-600/80 hover:bg-blue-500",
                                )}
                              >
                                {isFilled && blockWeight > 0.4 && (
                                  <span className="text-[7px] font-black text-white/40">
                                    B{i + 1}
                                  </span>
                                )}
                              </motion.button>
                            </Popover.Trigger>
                            <Popover.Portal>
                              <Popover.Content
                                side="left"
                                sideOffset={10}
                                className="z-50 w-64 bg-white border-2 border-gray-200 p-4 rounded-xl shadow-xl animate-in fade-in slide-in-from-right-2 duration-200"
                              >
                                <div className="space-y-2 text-left text-gray-900">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-blue-600 uppercase">
                                      Block {i + 1}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                      Relevance:{" "}
                                      {(blockWeight * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="p-2 bg-gray-50 rounded italic text-xs leading-snug">
                                    "{blockData.text}"
                                  </div>
                                </div>
                                <Popover.Arrow className="fill-white" />
                              </Popover.Content>
                            </Popover.Portal>
                          </Popover.Root>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-black uppercase text-gray-400">
                    Recall Score
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="w-1.5 h-1.5 bg-green-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-black/40 p-4 rounded-xl border border-gray-800/50 flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 shrink-0">
                <Zap size={20} />
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                <strong>The {m.searchTool}</strong> compares its data to every{" "}
                <strong>{m.transfer}</strong>. The Scorecard maintains
                bit-perfect accuracy, ensuring{" "}
                <strong>infinite distance with zero loss.</strong>
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-900 pt-8">
          <div className="space-y-2">
            <h4 className="text-lg font-black text-white">
              Lossy Methods (RAG/Sliding)
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Summarizing data or using a "moving window" means you're throwing
              information away. A student might forget Chapter 1 by the time
              they reach Chapter 100.
            </p>
          </div>
          <div className="space-y-2 text-right">
            <h4 className="text-lg font-black text-white">Ring Attention</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              By rotating the <strong>raw, original source material</strong> and
              using a running scorecard, you maintain 100% mathematical
              accuracy. Every connection is found.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

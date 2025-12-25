import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Cpu,
  Flashlight,
  Notebook,
  BookMarked,
  Search,
  ChevronRight,
  Zap,
  Radio,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Navbar } from "../components/Navbar";
import { Scorecard } from "../components/Scorecard";
import { ScenarioCard } from "../components/ScenarioCard";
import { cn } from "../components/ui-elements";
import { STORY_DATA, TECH_DATA, METAPHORS, type Mode } from "../constants";

export default function RingAttention() {
  const [mode, setMode] = useState<Mode>("story");
  const [sequenceLength, setSequenceLength] = useState(2048);
  const [numDevices, setNumDevices] = useState(4);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState(0);

  // --- Latency & Overlap State ---
  const [isOverlapped, setIsOverlapped] = useState(true);
  const [networkLatency, setNetworkLatency] = useState(30);
  const [, setIsComputing] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

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

  const mathState = useMemo(() => {
    // Re-calculate the cumulative max/sum up to the current step
    let max = currentScores[selectedNode % currentScores.length];
    let sum = currentScores[selectedNode % currentScores.length];

    // If step > 0, we need to iterate from step 1 to the current step
    // Note: The original logic seemed to accumulate based on the sequence of blocks
    // as they arrive. We mimic that accumulation here.
    for (let s = 1; s <= step; s++) {
      const bid = (selectedNode - s + numDevices) % numDevices;
      const score = dataSet[bid % dataSet.length].score;

      const newMax = Math.max(max, score);
      sum = newMax > max ? sum * Math.exp(max - newMax) + score : sum + score;
      max = newMax;
    }

    return { max, sum };
  }, [step, selectedNode, currentScores, numDevices, dataSet]);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(
        () => {
          if (!isOverlapped) {
            setIsComputing(true);
            setIsTransferring(false);
            setTimeout(() => {
              setIsComputing(false);
              setIsTransferring(true);
              setTimeout(() => {
                setStep((s) => (s + 1) % numDevices);
              }, networkLatency * 20);
            }, 1500);
          } else {
            setIsComputing(true);
            setIsTransferring(true);
            setTimeout(() => {
              setStep((s) => (s + 1) % numDevices);
            }, 2500);
          }
        },
        isOverlapped ? 2500 : 1500 + networkLatency * 20 + 500,
      );
    }
    return () => clearInterval(interval);
  }, [isPlaying, numDevices, isOverlapped, networkLatency]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white font-sans selection:bg-[#00f2ff]/30">
      {/* Space Age Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f2ff]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff00e5]/5 blur-[120px] rounded-full" />
      </div>

      <Navbar
        mode={mode}
        setMode={setMode}
        sequenceLength={sequenceLength}
        setSequenceLength={setSequenceLength}
        numDevices={numDevices}
        setNumDevices={setNumDevices}
        step={step}
        setStep={setStep}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        reset={reset}
        maxSteps={numDevices}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 pb-20">
        {/* NETWORK & LATENCY CONFIG */}
        <div className="mb-12 grid grid-cols-1 gap-8 rounded-[2.5rem] border-2 border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff00e5]/20 text-[#ff00e5] border border-[#ff00e5]/20 shadow-[0_0_15px_rgba(255,0,229,0.2)]">
                  <Radio size={16} className="animate-pulse" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
                  Network Configuration
                </h3>
              </div>
              <button
                onClick={() => setIsOverlapped(!isOverlapped)}
                className={cn(
                  "border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic",
                  isOverlapped
                    ? "border-[#00f2ff]/50 bg-[#00f2ff]/10 text-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    : "border-white/10 bg-white/5 text-blue-300/40",
                )}
              >
                {isOverlapped ? "✓ Overlap Enabled" : "Sequential Pass"}
              </button>
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-blue-100/50 italic">
              {isOverlapped
                ? "Pipelined Execution: Nodes receive next data blocks while processing current ones."
                : "Standard Link: Hardware waits for full data synchronization before starting computation."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between px-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-300/40">
                Network Latency
              </label>
              <span
                className={cn(
                  "font-mono text-sm font-black italic",
                  networkLatency > 60 ? "text-[#ff00e5]" : "text-[#00f2ff]",
                )}
              >
                {networkLatency}ms
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={networkLatency}
              onChange={(e) => setNetworkLatency(parseInt(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#00f2ff]"
            />
            <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/20">
              <span>Low Latency</span>
              <span>High Latency</span>
            </div>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h2 className="text-5xl font-black italic tracking-tighter text-white mb-4">
                {mode === "story"
                  ? "The Collaborative Circle"
                  : "Ring Attention"}
              </h2>
              <p className="text-blue-100/60 text-lg max-w-2xl leading-relaxed font-medium italic">
                {mode === "story"
                  ? "A distributed system where students share notes efficiently without losing any context."
                  : "A linear complexity attention mechanism distributed across a compute cluster."}
              </p>
            </motion.div>

            <ScenarioCard
              mode={mode}
              storyText="Imagine a book titled 'Midnight at Manor House,' a complex 10,000-page murder mystery. A group of students is tasked with understanding exactly what happened, without skipping a single detail."
              techText="To compute full attention without crashing a single GPU's memory, we distribute the sequence across a cluster. Each node passes its data in a ring, ensuring bit-perfect global context."
            />
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[320px] flex items-center justify-center bg-white/5 rounded-full border-4 border-white/5 shadow-[0_0_50px_rgba(0,242,255,0.05)]">
              {/* Spinning Orbital Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-dashed border-[#00f2ff]/20 rounded-full"
              />
              <div className="absolute inset-12 border border-[#ff00e5]/10 rounded-full" />

              {Array.from({ length: numDevices }).map((_, i) => {
                const angle = (i * 360) / numDevices - 90;
                const radius = 110;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                const isNodeTransferring = isPlaying && isTransferring;

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
                        "group relative flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 transition-all -translate-x-1/2 -translate-y-1/2 overflow-hidden backdrop-blur-xl",
                        selectedNode === i
                          ? "bg-white/20 border-[#00f2ff] shadow-[0_0_30px_rgba(0,242,255,0.4)] scale-125"
                          : "bg-[#0a0a2e] border-white/10 hover:border-white/30",
                        isNodeTransferring &&
                          !isOverlapped &&
                          "border-[#ff00e5] shadow-[0_0_20px_#ff00e5]",
                      )}
                    >
                      {mode === "story" ? (
                        <GraduationCap size={20} />
                      ) : (
                        <Cpu size={20} />
                      )}
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-end justify-center pb-1">
                          <div
                            className={cn(
                              "w-full h-1",
                              isNodeTransferring && !isOverlapped
                                ? "bg-[#ff00e5]"
                                : "bg-[#00f2ff]",
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="font-mono text-xs font-black text-white italic tracking-widest">
                  Student {selectedNode + 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-8">
          <div
            className={cn(
              "bg-white/5 rounded-[3rem] border-2 p-8 relative overflow-hidden transition-all duration-700 backdrop-blur-xl shadow-2xl",
              isPlaying && isTransferring && !isOverlapped
                ? "border-[#ff00e5]/30 shadow-[0_0_50px_rgba(255,0,229,0.1)]"
                : "border-white/10",
            )}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20 shadow-lg">
                  {mode === "story" ? (
                    <GraduationCap size={28} />
                  ) : (
                    <Cpu size={28} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tight">
                    {m.unit} {selectedNode + 1} Status
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
                      <span className="text-[10px] font-black text-blue-300/60 uppercase tracking-widest">
                        Phase {step + 1}
                      </span>
                    </div>
                    {isPlaying && (
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full italic tracking-widest",
                          isTransferring && !isOverlapped
                            ? "bg-[#ff00e5]/20 text-[#ff00e5] shadow-[0_0_10px_rgba(255,0,229,0.2)]"
                            : "bg-[#00f2ff]/20 text-[#00f2ff]",
                        )}
                      >
                        {isTransferring && !isOverlapped
                          ? "I/O Wait"
                          : "Processing"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="text-[9px] font-black text-blue-300/40 uppercase tracking-[0.3em] mb-1">
                  Computation
                </div>
                <div className="text-sm font-black text-white italic tracking-tight">
                  {m.mathTerm}: <span className="text-[#00f2ff]">OPTIMAL</span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[350px] items-stretch">
              {/* 1. THE SEARCH (Local State) */}
              <div className="flex-1 flex flex-col p-6 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-1">
                  <Search size={18} className="text-[#00f2ff]" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic">
                    1. {mode === "tech" ? "Query (Q)" : "The Inquiry"}
                  </h4>
                </div>

                <div className="p-4 bg-[#0a0a2e] border-2 border-white/5 rounded-2xl shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Zap size={40} className="text-[#00f2ff]" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-[#00f2ff]/40 mb-2 italic tracking-widest">
                    Search Intent
                  </div>
                  <div className="text-sm font-bold italic text-white leading-relaxed">
                    "{m.query}"
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative scale-90">
                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 shadow-[0_0_30px_rgba(0,242,255,0.1)] backdrop-blur-md">
                      <Flashlight size={48} className="text-[#00f2ff]" />
                    </div>
                    <motion.div
                      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-32 origin-top bg-gradient-to-b from-[#00f2ff]/20 to-transparent blur-2xl"
                      animate={
                        isPlaying
                          ? {
                              rotate: [0, 15, -15, 0],
                              opacity: [0.3, 0.6, 0.3],
                            }
                          : { opacity: 0 }
                      }
                      transition={{ repeat: Infinity, duration: 3 }}
                      style={{ translateX: "-50%" }}
                    />
                  </div>
                </div>

                <Scorecard
                  currentScore={currentScore}
                  max={mathState.max}
                  sum={mathState.sum}
                  mode={mode}
                />
              </div>

              {/* FLOW ARROW 1 */}
              <div className="flex items-center justify-center opacity-10">
                <ChevronRight
                  size={48}
                  className="rotate-90 text-[#00f2ff] md:rotate-0 animate-pulse"
                />
              </div>

              {/* 2. THE CACHE (Incoming Context) */}
              <div className="flex w-full flex-col items-center justify-center shrink-0 space-y-6 rounded-[2.5rem] border border-white/5 bg-white/5 p-6 md:w-64">
                <div className="mb-auto w-full text-center">
                  <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic">
                    2. {mode === "tech" ? "KV Cache" : "The Data"}
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ y: -30, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 30, opacity: 0, scale: 0.9 }}
                      className="relative mx-auto flex min-h-[140px] w-full flex-col overflow-hidden rounded-[2rem] border-2 border-white/10 bg-[#0a0a2e] shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff00e5]">
                          {mode === "tech" ? "Key (K)" : "Note Tag"}
                        </span>
                        <div className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00f2ff]">
                          ID_{currentBlockId + 1}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <span className="mb-2 text-[9px] font-black uppercase tracking-widest text-blue-300/30 italic">
                          {mode === "tech" ? "Value (V)" : "Original Text"}
                        </span>
                        <div className="line-clamp-4 text-xs font-medium leading-relaxed text-blue-50 italic">
                          "{currentBlockData.text}"
                        </div>
                      </div>

                      <div className="border-t border-white/5 bg-white/5 px-4 py-2">
                        <p className="text-[9px] leading-tight text-blue-300/40 italic">
                          {mode === "tech"
                            ? "Output += Softmax(Q @ K) @ V"
                            : "Extracting % of Text via Q Match."}
                        </p>
                      </div>

                      {isPlaying && currentScore > 0.7 && (
                        <motion.div
                          className="absolute inset-0 border-4 border-[#00f2ff]/30 rounded-[2rem]"
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: 1.1, opacity: [0, 0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative flex h-16 w-1 flex-col items-center">
                  {isPlaying &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-2 w-2 rounded-full bg-[#00f2ff] blur-[2px]"
                        animate={{ y: [0, 64], opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: i * 0.4,
                        }}
                      />
                    ))}
                </div>

                <div className="px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#ff00e5] italic">
                  Data Stream
                </div>
              </div>

              {/* FLOW ARROW 2 */}
              <div className="flex items-center justify-center opacity-10">
                <ChevronRight
                  size={48}
                  className="rotate-90 text-[#00f2ff] md:rotate-0 animate-pulse"
                />
              </div>

              {/* 3. THE STORE (Final Output) */}
              <div className="flex-1 flex flex-col p-6 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-1">
                  <BookMarked size={18} className="text-[#ff00e5]" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic">
                    3.{" "}
                    {mode === "tech" ? "Attention Output (Z)" : "The Summary"}
                  </h4>
                </div>

                <div className="relative w-full flex-1 bg-white rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] border-4 border-[#0a0a2e] overflow-hidden min-h-[220px]">
                  <div className="p-6 h-full flex flex-col">
                    <Notebook size={24} className="text-blue-200/20 mb-6" />
                    <div className="space-y-1.5 flex-1 flex flex-col-reverse overflow-hidden">
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
                                    ? `${blockWeight * 40}px`
                                    : 0,
                                }}
                                className={cn(
                                  "w-full rounded-md mb-1 transition-all duration-700 relative flex items-center justify-center overflow-hidden shrink-0",
                                  !isFilled
                                    ? "opacity-0 pointer-events-none"
                                    : "",
                                  i === currentBlockId
                                    ? "bg-[#ff00e5] shadow-[0_0_15px_#ff00e5]"
                                    : "bg-[#00f2ff]/60 hover:bg-[#00f2ff]",
                                )}
                              >
                                {isFilled && blockWeight > 0.4 && (
                                  <span className="text-[8px] font-black text-white/60 italic tracking-widest">
                                    DATA_{i + 1}
                                  </span>
                                )}
                              </motion.button>
                            </Popover.Trigger>
                            <Popover.Portal>
                              <Popover.Content
                                side="top"
                                sideOffset={15}
                                collisionPadding={10}
                                className="z-50 w-72 bg-white border-2 border-white/20 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300 text-gray-900"
                              >
                                <div className="space-y-3 text-left">
                                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-[10px] font-black text-[#ff00e5] uppercase tracking-widest italic">
                                      Data Block {i + 1}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 font-mono">
                                      VAL_{(blockWeight * 100).toFixed(0)}
                                    </span>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-2xl italic text-xs leading-relaxed font-medium">
                                    "{blockData.text}"
                                  </div>
                                  <p className="text-[9px] text-gray-400 font-bold leading-tight uppercase tracking-widest">
                                    Bit-Perfect Storage Verified
                                  </p>
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

                <div className="flex justify-between items-center px-2">
                  <span className="text-[9px] font-black uppercase text-blue-300/40 tracking-widest italic">
                    Integrity Check
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_8px_#00f2ff]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-5 backdrop-blur-md">
              <div className="p-3 bg-[#00f2ff]/10 rounded-full text-[#00f2ff] shadow-lg border border-[#00f2ff]/20">
                <Zap size={24} className="animate-pulse" />
              </div>
              <p className="text-xs text-blue-100/50 leading-relaxed font-medium italic">
                <strong className="text-white not-italic">
                  Context Synchronization:
                </strong>{" "}
                The system compares local search intents to remote memory
                packets. With bit-perfect synchronization, physical distribution
                is irrelevant. Zero loss, total clarity.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
          <div className="space-y-3">
            <h4 className="text-xl font-black text-white italic tracking-tight">
              Analog Methods (Lossy)
            </h4>
            <p className="text-sm text-blue-100/40 leading-relaxed font-medium italic">
              Summarization is a shadow of the truth. Throwing data away leads
              to a foggy past. By step 100, the context is forgotten.
            </p>
          </div>
          <div className="space-y-3 text-right">
            <h4 className="text-xl font-black text-[#00f2ff] italic tracking-tight text-white">
              Ring Topology (Lossless)
            </h4>
            <p className="text-sm text-blue-100/40 leading-relaxed font-medium italic">
              By rotating raw source material, we maintain 100% mathematical
              truth. Every connection is preserved, forever.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

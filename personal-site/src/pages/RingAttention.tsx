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
  const [networkLatency, setNetworkLatency] = useState(30); // 0-100
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
      // Simulate the Pipeline: Compute -> Comm -> Step
      interval = setInterval(
        () => {
          if (!isOverlapped) {
            // Naive Sequential Mode:
            // 1. Compute
            setIsComputing(true);
            setIsTransferring(false);

            setTimeout(() => {
              // 2. Transfer (Blocked)
              setIsComputing(false);
              setIsTransferring(true);

              setTimeout(() => {
                setStep((s) => (s + 1) % numDevices);
              }, networkLatency * 20); // Network wait
            }, 1500); // Compute time
          } else {
            // Overlapped Mode:
            // Recv next while computing current. Transfer is hidden!
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

  // ... (rest of the component)

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
    setMathState({ max: 0, sum: 0 });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
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

      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* NETWORK & LATENCY CONFIG */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-900/40 border border-gray-800 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Network Optimization
                </h3>
              </div>
              <button
                onClick={() => setIsOverlapped(!isOverlapped)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold transition-all border",
                  isOverlapped
                    ? "bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    : "bg-gray-800 border-gray-700 text-gray-500",
                )}
              >
                {isOverlapped ? "✓ Overlapping Active" : "Sequential (Slow)"}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed italic">
              {isOverlapped
                ? "Modern Ring Attention overlaps communication with computation. GPUs never stop reading while they receive the next block."
                : "Naive Ring Attention waits for the network to finish before reading. High latency creates massive 'bubbles' of idle time."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Network Latency (P2P Delay)
              </label>
              <span
                className={cn(
                  "font-mono text-xs font-bold",
                  networkLatency > 60 ? "text-red-400" : "text-blue-400",
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
              className="w-full h-1 accent-blue-500 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase">
              <span>Fast (NVLink)</span>
              <span>Slow (Ethernet)</span>
            </div>
          </div>
        </div>

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

            <ScenarioCard
              mode={mode}
              storyText="Imagine a book titled 'Midnight at Manor House,' a complex 10,000-page murder mystery. A group of students is tasked with understanding exactly what happened, without skipping a single detail or relying on a vague summary."
              techText="To compute full attention without crashing a single GPU's memory, we distribute the sequence across a cluster. Each node computes local attention and then passes its data in a ring, ensuring bit-perfect global context."
            />
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
                        "w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 cursor-pointer transition-all -translate-x-1/2 -translate-y-1/2 overflow-hidden",
                        selectedNode === i
                          ? "bg-blue-600 border-blue-400 shadow-lg scale-125"
                          : "bg-gray-900 border-gray-800 hover:border-gray-600",
                        isNodeTransferring &&
                          !isOverlapped &&
                          "border-yellow-500 animate-pulse",
                      )}
                    >
                      {mode === "story" ? (
                        <GraduationCap size={16} />
                      ) : (
                        <Cpu size={16} />
                      )}
                      {/* STATUS OVERLAY */}
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-end justify-center pb-0.5">
                          <div
                            className={cn(
                              "w-full h-1",
                              isNodeTransferring && !isOverlapped
                                ? "bg-yellow-500"
                                : "bg-blue-400",
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
                  {isPlaying && isTransferring && !isOverlapped
                    ? "Transferring..."
                    : "Computing"}
                </div>
                <div className="text-xs font-bold text-gray-400">P2P Ring</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div
            className={cn(
              "bg-[#0A0A0A] rounded-[1.5rem] border-2 p-6 relative overflow-hidden transition-colors duration-500",
              isPlaying && isTransferring && !isOverlapped
                ? "border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.05)]"
                : "border-gray-800",
            )}
          >
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
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      Step {step + 1}
                    </p>
                    {isPlaying && (
                      <span
                        className={cn(
                          "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                          isTransferring && !isOverlapped
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-blue-500/20 text-blue-400",
                        )}
                      >
                        {isTransferring && !isOverlapped
                          ? "Blocked: Waiting for Network"
                          : "Active: Reading Content"}
                      </span>
                    )}
                  </div>
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
              <div className="flex flex-1 flex-col space-y-4 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-4">
                <div className="mb-1 flex items-center gap-2">
                  <Search size={14} className="text-blue-400" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    1. {mode === "tech" ? "Query (Q)" : "The Question"}
                  </h4>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-600/10 p-3">
                  <div className="mb-1 text-[9px] font-bold uppercase text-blue-400 opacity-60">
                    My Search Intent
                  </div>
                  <div className="line-clamp-2 text-xs font-bold italic text-white">
                    "{m.query}"
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center py-2">
                  <div className="relative group scale-75">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-500/40 bg-blue-600/20 shadow-inner">
                      <Flashlight size={32} className="text-blue-400" />
                    </div>
                    <motion.div
                      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-20 origin-top bg-gradient-to-b from-blue-500/30 to-transparent blur-xl"
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
                <Scorecard
                  currentScore={currentScore}
                  max={mathState.max}
                  sum={mathState.sum}
                  mode={mode}
                />
              </div>

              <div className="flex items-center justify-center opacity-20">
                <ChevronRight
                  size={32}
                  className="rotate-90 text-blue-500 xl:rotate-0"
                />
              </div>

              <div className="flex w-full flex-col items-center justify-center shrink-0 space-y-4 rounded-2xl border border-purple-500/10 bg-purple-600/5 p-4 xl:w-64">
                <div className="mb-auto w-full text-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                    2. {mode === "tech" ? "KV Cache" : "The Notes"}{" "}
                    {step === 0
                      ? "(Local)"
                      : `(From Node ${((selectedNode - 1 + numDevices) % numDevices) + 1})`}
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="relative mx-auto flex min-h-[110px] w-full flex-col overflow-hidden rounded-xl border-2 border-purple-400/30 bg-purple-600/10 shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-purple-400/20 bg-purple-400/10 px-3 py-1.5">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-purple-400">
                          {mode === "tech" ? "Key (K)" : "Note Tag"}
                        </span>
                        <div className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                          BLOCK_{currentBlockId + 1}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-3">
                        <span className="mb-1 text-[8px] font-black uppercase tracking-tighter text-purple-400/60">
                          {mode === "tech" ? "Value (V)" : "Original Text"}
                        </span>
                        <div className="line-clamp-3 text-xs font-medium leading-snug text-white">
                          "{currentBlockData.text}"
                        </div>
                      </div>

                      <div className="bg-black/40 px-3 py-1.5 border-t border-purple-400/10 text-left">
                        <p className="text-[8px] text-gray-500 leading-tight">
                          {mode === "tech"
                            ? "Match = Softmax(Q @ K). Output += Match @ V."
                            : "Match Q to Tag. If they align, copy Text to Summary."}
                        </p>
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
                        className="absolute h-1.5 w-1.5 bg-blue-400 rounded-full blur-[1px]"
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
                  Pulling Data...
                </div>
              </div>

              <div className="flex items-center justify-center opacity-20">
                <ChevronRight
                  size={32}
                  className="rotate-90 text-blue-500 xl:rotate-0"
                />
              </div>

              <div className="flex-1 flex flex-col p-4 bg-green-600/5 rounded-2xl border border-green-500/10 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookMarked size={14} className="text-green-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    3.{" "}
                    {mode === "tech" ? "Attention Output (Z)" : "The Summary"}
                  </h4>
                </div>{" "}
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
                                collisionPadding={10}
                                className="z-50 w-[calc(100vw-40px)] max-w-64 bg-white border-2 border-gray-200 p-4 rounded-xl shadow-xl animate-in fade-in slide-in-from-right-2 duration-200"
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

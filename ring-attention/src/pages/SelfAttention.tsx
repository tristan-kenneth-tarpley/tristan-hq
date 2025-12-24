import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Cpu,
  AlertTriangle,
  Search,
  BookMarked,
  Notebook,
  Zap,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Navbar } from "../components/Navbar";
import { ScenarioCard } from "../components/ScenarioCard";
import { MemoryMeter, cn } from "../components/ui-elements";
import { STORY_DATA, TECH_DATA, METAPHORS, type Mode } from "../constants";

export default function SelfAttention() {
  const [mode, setMode] = useState<Mode>("story");
  const [sequenceLength, setSequenceLength] = useState(2048);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const m = METAPHORS[mode];
  const dataSet = mode === "story" ? STORY_DATA : TECH_DATA;

  // Logic: Standard Attention OOMs quadratically
  const standardMemory = (sequenceLength / 4096) ** 2 * 80;
  const isOOM = standardMemory >= 100;

  useEffect(() => {
    let interval: number;
    if (isPlaying && !isOOM) {
      interval = setInterval(() => {
        setStep((s) => (s + 1) % 64);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOOM]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <Navbar
        mode={mode}
        setMode={setMode}
        sequenceLength={sequenceLength}
        setSequenceLength={setSequenceLength}
        step={step}
        setStep={setStep}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        reset={reset}
        maxSteps={64}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 leading-tight">
                {mode === "story"
                  ? "The Overwhelmed Student"
                  : "Standard Self-Attention"}
              </h2>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
                {mode === "story"
                  ? "A single student attempting to read and cross-reference every single page of a 10,000-page book at once."
                  : "Computing global attention on a single accelerator. Memory usage scales quadratically (N²) with sequence length."}
              </p>
            </div>

            <ScenarioCard
              mode={mode}
              storyText="Imagine a student sitting in a room filled with 10,000 loose pages. To understand the story, they try to keep every single page spread out on one giant floor. Eventually, the room simply isn't big enough."
              techText="Standard attention requires storing an N x N matrix. As N (sequence length) grows, the VRAM required grows four times faster. This creates the 'Quadratic Memory Wall' that crashes GPUs."
            />
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className={cn(
                "relative aspect-square w-full max-w-70 flex flex-col items-center justify-center rounded-3xl border-2 transition-all duration-500",
                isOOM
                  ? "bg-red-950/20 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                  : "bg-gray-900/20 border-gray-800 shadow-2xl",
              )}
            >
              {isOOM ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center p-6"
                >
                  <AlertTriangle
                    size={48}
                    className="text-red-500 mx-auto mb-4 animate-pulse"
                  />
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    Out of Memory
                  </h3>
                  <p className="text-[10px] text-red-400 mt-2">
                    The context is too large for a single unit to handle.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-2xl bg-blue-600/20 border-2 border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
                    {mode === "story" ? (
                      <GraduationCap size={40} />
                    ) : (
                      <Cpu size={40} />
                    )}
                  </div>
                  <div className="text-center px-6">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      System Load
                    </span>
                    <div className="mt-2 w-40">
                      <MemoryMeter
                        percentage={standardMemory}
                        label="VRAM Usage"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Search Matrix */}
          {!isOOM ? (
            <div className="bg-[#0A0A0A] rounded-3xl border-2 border-gray-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-900">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-blue-400" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    The Search Matrix
                  </h3>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">
                  Size: {sequenceLength} x {sequenceLength}
                </div>
              </div>

              <div className="grid grid-cols-8 gap-1 aspect-square w-full max-w-110 mx-auto">
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const queryToken = dataSet[row % dataSet.length];
                  const keyToken = dataSet[col % dataSet.length];
                  const isActive = i === step % 64;

                  return (
                    <Popover.Root key={i}>
                      <Popover.Trigger asChild>
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.005 }}
                          className={cn(
                            "rounded-sm border border-white/5 flex items-center justify-center text-[8px] font-mono transition-all duration-300",
                            isActive
                              ? "bg-blue-600 border-blue-400 shadow-lg scale-110 z-10"
                              : "bg-gray-900/50 hover:bg-gray-800 hover:border-white/20",
                          )}
                        ></motion.button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          sideOffset={5}
                          collisionPadding={10}
                          className="z-50 w-[calc(100vw-40px)] max-w-72 bg-white border-2 border-gray-200 p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200"
                        >
                          <div className="space-y-3 text-left text-gray-900">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="text-[10px] font-black text-blue-600 uppercase">
                                Attention Cell [{row}, {col}]
                              </span>
                              <span className="text-[10px] font-bold text-gray-400">
                                {mode === "tech" ? "Softmax(QKᵀ)" : "Match"}:{" "}
                                {(
                                  queryToken.score *
                                  keyToken.score *
                                  100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>

                            <div className="space-y-3">
                              {/* QUERY */}
                              <div>
                                <div className="text-[8px] font-black text-blue-500 uppercase tracking-tighter mb-1 flex justify-between">
                                  <span>
                                    {mode === "tech"
                                      ? "Query (Q)"
                                      : "My Question"}
                                  </span>
                                  <span className="opacity-50">Row {row}</span>
                                </div>
                                <div className="p-2 bg-blue-50 rounded text-[10px] italic leading-snug text-blue-900 font-medium line-clamp-2">
                                  "{queryToken.text}"
                                </div>
                              </div>

                              <div className="flex justify-center opacity-20">
                                <Zap size={12} className="text-blue-400" />
                              </div>

                              {/* KEY */}
                              <div>
                                <div className="text-[8px] font-black text-purple-500 uppercase tracking-tighter mb-1 flex justify-between">
                                  <span>
                                    {mode === "tech" ? "Key (K)" : "Note Label"}
                                  </span>
                                  <span className="opacity-50">Col {col}</span>
                                </div>
                                <div className="p-2 bg-purple-50 rounded text-[10px] font-mono text-purple-900 font-bold">
                                  BLOCK_TAG_{col}_REF
                                </div>
                              </div>

                              {/* VALUE */}
                              <div>
                                <div className="text-[8px] font-black text-green-600 uppercase tracking-tighter mb-1">
                                  {mode === "tech"
                                    ? "Value (V)"
                                    : "The Information"}
                                </div>
                                <div className="p-2 bg-green-50 rounded text-[10px] italic leading-snug text-green-900 line-clamp-2">
                                  "{keyToken.text}"
                                </div>
                              </div>
                            </div>

                            <p className="text-[9px] text-gray-400 leading-tight pt-2 border-t border-gray-100">
                              {mode === "tech"
                                ? "The match (Q @ K) determines the attention weight. This weight decides how much of the Value (V) is added to the output notebook."
                                : "The Question searches for the Note Tag. If they relate, we copy the relevant part of the Content into our Summary."}
                            </p>
                          </div>
                          <Popover.Arrow className="fill-white" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  );
                })}
              </div>

              <div className="mt-6 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-[10px] text-gray-400 text-center leading-relaxed">
                Standard Attention computes every connection{" "}
                <strong>simultaneously</strong>. 10x tokens = 100x more cells.
              </div>
            </div>
          ) : (
            <div className="bg-red-950/10 rounded-3xl border-2 border-red-900/30 p-12 flex flex-col items-center justify-center text-center aspect-square">
              <AlertTriangle
                size={48}
                className="text-red-500 mb-4 opacity-50"
              />
              <h3 className="text-lg font-black text-red-900 uppercase">
                Matrix Overflow
              </h3>
              <p className="text-xs text-red-900/60 mt-2">
                The attention grid is too massive to display.
              </p>
            </div>
          )}

          {/* RIGHT: Super Student (Stacked Sections) */}
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] rounded-3xl border-2 border-gray-800 p-6 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-900">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                  {mode === "story" ? (
                    <GraduationCap size={20} />
                  ) : (
                    <Cpu size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    The "Super {m.unit}"
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Status: Global Attention Pass
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* ROW 1: Global Question & Search Visualization */}
                <div className="bg-blue-600/5 rounded-2xl border border-blue-500/10 p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Search size={14} className="text-blue-400" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {mode === "tech" ? "Global Query (Q)" : "Global Question"}
                    </h4>
                  </div>
                  <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                    <div className="text-[10px] font-bold text-white italic text-center">
                      "{m.query}"
                    </div>
                  </div>
                  <div className="flex justify-center py-4">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 flex items-center justify-center relative bg-blue-500/5">
                      <Zap
                        size={32}
                        className={cn(
                          "text-blue-400",
                          isPlaying && !isOOM ? "animate-pulse" : "",
                        )}
                      />
                      {isPlaying &&
                        !isOOM &&
                        Array.from({ length: 4 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-full h-full border border-blue-500/30 rounded-full"
                            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.5,
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>

                {/* ROW 2: ATTENTION OUTPUT */}
                <div className="bg-green-600/5 rounded-2xl border border-green-500/10 p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookMarked size={14} className="text-green-500" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      2.{" "}
                      {mode === "tech" ? "Attention Output (Z)" : "The Summary"}
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-xl border-2 border-gray-800 min-h-45 flex flex-col">
                    <Notebook
                      size={20}
                      className="text-gray-300 mb-4 shrink-0"
                    />
                    <div className="space-y-1 flex-1 flex flex-col-reverse overflow-hidden">
                      {!isOOM ? (
                        Array.from({ length: 8 }).map((_, i) => {
                          const currentRow = Math.floor((step % 64) / 8);
                          const isLearned = i <= currentRow;
                          const blockData = dataSet[i % dataSet.length];
                          const blockWeight = blockData.score;

                          return (
                            <Popover.Root key={i}>
                              <Popover.Trigger asChild>
                                <motion.button
                                  initial={{ height: 0 }}
                                  animate={{
                                    height: isLearned
                                      ? `${blockWeight * 30}px`
                                      : 0,
                                  }}
                                  className={cn(
                                    "w-full rounded-sm mb-0.5 transition-colors duration-500 relative flex items-center justify-center overflow-hidden shrink-0",
                                    !isLearned
                                      ? "opacity-0 pointer-events-none"
                                      : "",
                                    i === currentRow
                                      ? "bg-blue-400 animate-pulse"
                                      : "bg-blue-600/80 hover:bg-blue-500",
                                  )}
                                >
                                  {isLearned && blockWeight > 0.4 && (
                                    <span className="text-[7px] font-black text-white/40">
                                      B{i + 1}
                                    </span>
                                  )}
                                </motion.button>
                              </Popover.Trigger>
                              <Popover.Portal>
                                <Popover.Content
                                  side="top"
                                  sideOffset={10}
                                  collisionPadding={10}
                                  className="z-50 w-[calc(100vw-40px)] max-w-64 bg-white border-2 border-gray-200 p-4 rounded-xl shadow-xl animate-in fade-in slide-in-from-right-2 duration-200"
                                >
                                  <div className="space-y-2 text-left text-gray-900">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black text-blue-600 uppercase">
                                        Weighted Value {i + 1}
                                      </span>
                                      <span className="text-[10px] font-bold text-gray-400">
                                        Relevance:{" "}
                                        {(blockWeight * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded italic text-xs leading-snug">
                                      "{blockData.text}"
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-2 leading-tight">
                                      {mode === "tech"
                                        ? "The original Value (V) scaled by the Softmax(QKᵀ) weight."
                                        : "The information we decided to copy based on our search match."}
                                    </p>
                                  </div>
                                  <Popover.Arrow className="fill-white" />
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>
                          );
                        })
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <AlertTriangle
                              size={24}
                              className="text-red-500 mx-auto mb-2"
                            />
                            <div className="text-[10px] font-black text-red-500 uppercase">
                              Memory Overload
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {!isOOM && (
                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center shrink-0">
                        <span className="text-[8px] font-black uppercase text-gray-400">
                          Synthesized Result
                        </span>
                        <span className="text-[8px] font-bold text-green-600">
                          {Math.round(
                            ((Math.floor((step % 64) / 8) + 1) / 8) * 100,
                          )}
                          % Complete
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

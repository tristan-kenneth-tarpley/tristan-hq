import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Cpu,
  AlertTriangle,
  Search,
  BookMarked,
  Notebook,
  Zap,
  LayoutGrid,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Navbar } from "../components/Navbar";
import { Scorecard } from "../components/Scorecard";
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
    <div className="min-h-screen bg-[#0a0a2e] text-white font-sans selection:bg-[#00f2ff]/30 overflow-x-hidden">
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
        step={step}
        setStep={setStep}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        reset={reset}
        maxSteps={64}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 pb-20">
        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h2 className="text-5xl font-black italic tracking-tighter text-white mb-2 leading-tight">
                {mode === "story" ? "The Lone Explorer" : "Standard Attention"}
              </h2>
              <p className="text-blue-100/60 text-lg max-w-2xl leading-relaxed font-medium italic">
                {mode === "story"
                  ? "A single entity attempting to navigate an exponential sea of information."
                  : "Traditional attention mechanism processing global context on a single localized unit."}
              </p>
            </motion.div>

            <ScenarioCard
              mode={mode}
              storyText="Imagine a student in a room with 10,000 pages spread across the floor. To find a connection, they must physically walk between every possible pair. Eventually, the room runs out of floor space."
              techText="Standard attention stores an N x N matrix in VRAM. As the context length (N) doubles, the memory required quadruples. This is the 'Quadratic Wall' of classical compute."
            />
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className={cn(
                "relative flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-[3rem] border-4 transition-all duration-700 backdrop-blur-xl shadow-2xl",
                isOOM
                  ? "bg-[#ff00e5]/5 border-[#ff00e5] shadow-[0_0_60px_rgba(255,0,229,0.2)]"
                  : "bg-white/5 border-white/10 shadow-[0_0_50px_rgba(0,242,255,0.05)]",
              )}
            >
              {isOOM ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center p-8"
                >
                  <AlertTriangle
                    size={64}
                    className="mx-auto mb-4 animate-bounce text-[#ff00e5]"
                  />
                  <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                    Critical Overflow
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#ff00e5]/60">
                    Memory Wall Breached
                  </p>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#00f2ff]/40 bg-[#00f2ff]/10 text-[#00f2ff] shadow-[0_0_30px_rgba(0,242,255,0.2)]"
                  >
                    {mode === "story" ? (
                      <GraduationCap size={48} />
                    ) : (
                      <Cpu size={48} />
                    )}
                  </motion.div>
                  <div className="w-full px-8 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-300/40 italic">
                      Unit Status
                    </span>
                    <div className="mt-4">
                      <MemoryMeter
                        percentage={standardMemory}
                        label="Storage Load"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* LEFT: Search Matrix */}
          {!isOOM ? (
            <div className="rounded-[3rem] border-2 border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <LayoutGrid size={24} className="text-[#00f2ff]" />
                  <h3 className="text-2xl font-black italic tracking-tight text-white uppercase">
                    The N² Grid
                  </h3>
                </div>
                <div className="font-mono text-[10px] font-black tracking-widest text-blue-300/40">
                  DIM: {sequenceLength}²
                </div>
              </div>

              <div className="mx-auto grid w-full max-w-[440px] grid-cols-8 gap-1.5 aspect-square">
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
                          transition={{ delay: i * 0.002 }}
                          className={cn(
                            "flex items-center justify-center rounded-sm border border-white/5 font-mono text-[8px] transition-all duration-300",
                            isActive
                              ? "z-10 scale-110 border-[#00f2ff] bg-[#00f2ff]/40 shadow-[0_0_15px_#00f2ff]"
                              : "bg-[#0a0a2e]/50 hover:border-white/20 hover:bg-white/5",
                          )}
                        >
                          {isActive ? "⚡" : ""}
                        </motion.button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          sideOffset={5}
                          collisionPadding={10}
                          className="z-50 w-[calc(100vw-40px)] max-w-72 rounded-[2rem] border-2 border-white/20 bg-white p-6 text-gray-900 shadow-2xl animate-in fade-in zoom-in duration-300"
                        >
                          <div className="space-y-4 text-left">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff]">
                                Cell_{row}_{col}
                              </span>
                              <span className="font-mono text-[10px] font-black text-gray-400">
                                Match_
                                {(
                                  queryToken.score *
                                  keyToken.score *
                                  100
                                ).toFixed(0)}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="mb-1 flex justify-between text-[8px] font-black uppercase tracking-tighter text-blue-500">
                                  <span>
                                    {mode === "tech"
                                      ? "Query (Q)"
                                      : "The Search"}
                                  </span>
                                  <span className="opacity-50">Row {row}</span>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-2 text-[10px] font-medium italic leading-snug text-blue-900 line-clamp-2">
                                  "{queryToken.text}"
                                </div>
                              </div>

                              <div className="flex justify-center opacity-20">
                                <Zap size={12} className="text-blue-400" />
                              </div>

                              <div>
                                <div className="mb-1 flex justify-between text-[8px] font-black uppercase tracking-tighter text-purple-500">
                                  <span>
                                    {mode === "tech" ? "Key (K)" : "The Data"}
                                  </span>
                                  <span className="opacity-50">Col {col}</span>
                                </div>
                                <div className="rounded-xl bg-purple-50 p-2 font-mono text-[9px] font-bold text-purple-900">
                                  REF_TAG_{col}_HEX
                                </div>
                              </div>
                            </div>
                            <p className="border-t border-gray-100 pt-3 text-[9px] font-bold uppercase italic leading-tight text-gray-400 tracking-tight">
                              Simultaneous pair-wise comparison required.
                            </p>
                          </div>
                          <Popover.Arrow className="fill-white" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-[#ff00e5]/10 bg-[#ff00e5]/5 p-4 text-center">
                <p className="text-[10px] font-medium italic leading-relaxed text-blue-100/40">
                  Standard units must compute every connection{" "}
                  <strong className="text-white not-italic">
                    simultaneously
                  </strong>
                  . As context doubles, the memory required quadruples.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center rounded-[3rem] border-2 border-[#ff00e5]/20 bg-[#ff00e5]/5 p-12 text-center shadow-[inset_0_0_50px_rgba(255,0,229,0.1)] backdrop-blur-xl">
              <AlertTriangle
                size={64}
                className="mb-6 text-[#ff00e5] opacity-30 animate-pulse"
              />
              <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                Matrix Void
              </h3>
              <p className="mt-2 text-sm font-medium italic text-blue-100/40 tracking-tight leading-relaxed">
                The grid has expanded beyond physical hardware constraints.
                Classical memory has failed.
              </p>
            </div>
          )}

          {/* RIGHT: Super Student */}
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[3rem] border-2 border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-10 flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#00f2ff]/20 bg-[#00f2ff]/10 text-[#00f2ff] shadow-lg">
                  {mode === "story" ? (
                    <GraduationCap size={24} />
                  ) : (
                    <Cpu size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tight text-white uppercase">
                    The "Super {m.unit}"
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#ff00e5] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300/40 italic">
                      Global Processing Pass
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* ROW 1: Global Query */}
                <div className="rounded-[2rem] border border-white/5 bg-[#0a0a2e] p-6 space-y-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <Search size={80} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Search size={18} className="text-[#00f2ff]" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic">
                      1.{" "}
                      {mode === "tech" ? "Global Query (Q)" : "Global Intent"}
                    </h4>
                  </div>
                  <div className="rounded-2xl border-2 border-white/5 bg-white/5 p-4">
                    <div className="text-center text-sm font-bold italic leading-relaxed text-white">
                      "{m.query}"
                    </div>
                  </div>
                  <div className="flex justify-center py-4">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#00f2ff]/20 bg-[#00f2ff]/5">
                      <Zap
                        size={40}
                        className={cn(
                          "text-[#00f2ff]",
                          isPlaying && !isOOM ? "animate-pulse" : "",
                        )}
                      />
                      {isPlaying &&
                        !isOOM &&
                        Array.from({ length: 4 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute h-full w-full rounded-full border border-[#00f2ff]/30"
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
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

                {/* ROW 2: Attention Output */}
                <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <BookMarked size={18} className="text-[#ff00e5]" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic">
                      2.{" "}
                      {mode === "tech" ? "Attention Output (Z)" : "The Summary"}
                    </h4>
                  </div>
                  <div className="relative flex min-h-[200px] flex-col rounded-[2rem] border-4 border-[#0a0a2e] bg-white p-6 shadow-2xl overflow-hidden">
                    <Notebook size={24} className="mb-6 text-blue-200/20" />
                    <div className="space-y-1.5 flex-1 flex flex-col-reverse overflow-hidden">
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
                                      ? `${blockWeight * 35}px`
                                      : 0,
                                  }}
                                  className={cn(
                                    "relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-md mb-1 transition-all duration-700",
                                    !isLearned
                                      ? "opacity-0 pointer-events-none"
                                      : "",
                                    i === currentRow
                                      ? "bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]"
                                      : "bg-[#0a0a2e]/10 hover:bg-[#0a0a2e]/20",
                                  )}
                                >
                                  {isLearned && blockWeight > 0.4 && (
                                    <span className="text-[8px] font-black italic tracking-widest text-[#0a0a2e]/40">
                                      CORE_MEM_{i + 1}
                                    </span>
                                  )}
                                </motion.button>
                              </Popover.Trigger>
                              <Popover.Portal>
                                <Popover.Content
                                  side="top"
                                  sideOffset={15}
                                  collisionPadding={10}
                                  className="z-50 w-72 rounded-[2rem] border-2 border-white/20 bg-white p-6 text-gray-900 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
                                >
                                  <div className="space-y-3 text-left">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-[#ff00e5] italic">
                                        Archive {i + 1}
                                      </span>
                                      <span className="font-mono text-[10px] font-black text-gray-400">
                                        RANK_{(blockWeight * 100).toFixed(0)}
                                      </span>
                                    </div>
                                    <div className="rounded-2xl bg-gray-50 p-3 text-xs font-medium italic leading-relaxed font-serif">
                                      "{blockData.text}"
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                                      {mode === "tech"
                                        ? "Softmax Weighted Result"
                                        : "Consolidated Context"}
                                    </p>
                                  </div>
                                  <Popover.Arrow className="fill-white" />
                                </Popover.Content>
                              </Popover.Portal>
                            </Popover.Root>
                          );
                        })
                      ) : (
                        <div className="flex flex-1 items-center justify-center">
                          <div className="text-center">
                            <AlertTriangle
                              size={32}
                              className="mx-auto mb-3 text-[#ff00e5] animate-pulse"
                            />
                            <div className="text-[10px] font-black uppercase tracking-tighter text-[#ff00e5]">
                              Memory Static
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {!isOOM && (
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                          Synthesis Pass
                        </span>
                        <span className="text-[10px] font-black italic text-[#ff00e5]">
                          {Math.round(
                            ((Math.floor((step % 64) / 8) + 1) / 8) * 100,
                          )}
                          % TOTAL
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

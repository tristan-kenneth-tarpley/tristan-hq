import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Cpu,
  AlertTriangle,
  Search,
  BookMarked,
  Notebook,
  Zap,
  LayoutGrid,
  Info,
  Clock,
  History,
  ArrowRight,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Navbar } from "../components/Navbar";
import { ScenarioCard } from "../components/ScenarioCard";
import { MemoryMeter, cn } from "../components/ui-elements";
import { STORY_DATA, TECH_DATA, METAPHORS, type Mode } from "../constants";
import { SELF_ATTENTION_SCENARIO } from "../educational-data";

export default function SelfAttention() {
  const [mode, setMode] = useState<Mode>("story");
  const [sequenceLength, setSequenceLength] = useState(2048);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIntentIndex, setSelectedIntentIndex] = useState(0);

  const m = METAPHORS[mode];
  const dataSet = mode === "story" ? STORY_DATA : TECH_DATA;

  const selfMemory = (sequenceLength / 4096) ** 2 * 80;
  const isOOM = selfMemory >= 100;

  const activeIntent = useMemo(
    () => SELF_ATTENTION_SCENARIO.intents[selectedIntentIndex],
    [selectedIntentIndex],
  );

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
        step={step}
        setStep={setStep}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        reset={reset}
        maxSteps={64}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white max-w-3xl mx-auto leading-tight mb-6">
            Have you ever wondered why LLMs have{" "}
            <span className="text-[#00f2ff]">context windows?</span>
          </h1>
          <p className="text-blue-100/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic">
            Large Language Models are essentially massive neural networks
            supercharged by an Attention Mechanism.
          </p>
        </motion.div>

        {/* EDUCATIONAL TOP SECTION: The Problem */}
        {!isOOM && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff00e5]/20 text-[#ff00e5] border border-[#ff00e5]/20 shadow-[0_0_15px_rgba(255,0,229,0.2)]">
                <History size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white italic">
                The Problem: Sequential Bottlenecks
              </h3>
            </div>

            <div className="bg-white/5 rounded-[3rem] border-2 border-white/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff00e5]/5 to-transparent pointer-events-none" />

              <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                <div className="flex-1 space-y-6">
                  <p className="text-blue-100/70 text-lg leading-relaxed font-medium italic">
                    Before Attention, neural networks (like RNNs) processed data
                    <span className="text-white font-black underline decoration-[#00f2ff] decoration-2 underline-offset-4 mx-1">
                      one step at a time
                    </span>
                    . To understand the last word, the model had to pass
                    information through every word before it—like a game of
                    telephone.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0a0a2e]/60 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-[#ff00e5]">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Vanishing Memory
                        </span>
                      </div>
                      <p className="text-xs text-blue-100/40 leading-relaxed font-medium">
                        By the time the model reached the end of a long
                        paragraph, it often "forgot" the context from the
                        beginning.
                      </p>
                    </div>
                    <div className="p-4 bg-[#0a0a2e]/60 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-[#ff00e5]">
                        <Zap size={14} className="rotate-180" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Slow Training
                        </span>
                      </div>
                      <p className="text-xs text-blue-100/40 leading-relaxed font-medium">
                        Because words had to be processed in order, models
                        couldn't use the full parallel power of modern GPUs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto bg-[#0a0a2e]/40 p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-4">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                    {["The", "butler", "...", "tray"].map((token, i) => (
                      <div key={i} className="flex items-center gap-2 md:gap-4">
                        <div className="px-2 py-1.5 md:px-3 md:py-2 bg-white/5 border border-white/10 rounded-lg text-xs md:text-sm font-black text-blue-300/40 italic">
                          {token}
                        </div>
                        {i < 3 && (
                          <ArrowRight size={14} className="text-[#ff00e5]/30 md:size-4" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[#ff00e5] animate-pulse text-center">
                    Sequential Dependency Link
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EDUCATIONAL TOP SECTION: The Breakthrough */}
        {!isOOM && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/20 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                <Info size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white italic">
                The Breakthrough: Self-Attention
              </h3>
            </div>

            <div className="bg-white/5 rounded-[3rem] border-2 border-white/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" />

              <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                <div className="flex-1 space-y-6">
                  <p className="text-blue-100/70 text-lg leading-relaxed font-medium italic">
                    Self-Attention allows every word to look at every other word
                    <span className="text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4 mx-1">
                      instantly
                    </span>
                    . Unlike older models that read linearly, Attention
                    identifies connections regardless of distance.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {SELF_ATTENTION_SCENARIO.intents.map((intent, idx) => (
                      <button
                        key={intent.label}
                        onClick={() => setSelectedIntentIndex(idx)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border",
                          selectedIntentIndex === idx
                            ? "bg-[#00f2ff] border-[#00f2ff] text-[#0a0a2e] shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                            : "bg-white/5 border-white/10 text-blue-300/60 hover:border-white/30 hover:text-white",
                        )}
                      >
                        {intent.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-[#0a0a2e]/60 rounded-2xl border border-white/5 italic text-sm text-blue-100/50">
                    <span className="text-[#ff00e5] font-black mr-2">
                      QUERY:
                    </span>
                    {activeIntent.description}
                  </div>
                </div>

                <div className="w-full lg:w-auto bg-[#0a0a2e]/40 p-6 rounded-[2rem] border border-white/10 flex flex-wrap gap-2 justify-center max-w-xl">
                  {SELF_ATTENTION_SCENARIO.sentence.map((token, i) => {
                    const currentWeight =
                      activeIntent.weights[activeIntent.focusTokenIndex][i];
                    return (
                      <motion.span
                        key={i}
                        animate={{
                          color: currentWeight > 0.2 ? "#00f2ff" : "#f0f9ff",
                          scale: currentWeight > 0.2 ? 1.1 : 1,
                          opacity: currentWeight > 0.1 ? 1 : 0.4,
                        }}
                        className={cn(
                          "text-2xl font-black italic tracking-tight px-1 rounded transition-colors",
                          i === activeIntent.focusTokenIndex &&
                            "text-[#ff00e5] underline decoration-[#ff00e5] underline-offset-8",
                        )}
                      >
                        {token}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h2 className="text-5xl font-black italic tracking-tighter text-white mb-2 leading-tight">
                {mode === "story"
                  ? "The Overwhelmed Student"
                  : "Self Attention"}
              </h2>
              <p className="text-blue-100/60 text-lg max-w-2xl leading-relaxed font-medium italic">
                {mode === "story"
                  ? "A single student trying to keep track of a mountain of clues all at once."
                  : "The mechanism that allows tokens to weight their relevance to each other dynamically."}
              </p>
            </motion.div>

            <ScenarioCard
              mode={mode}
              storyText="Imagine a student in a room with 10,000 pages spread across the floor. To find a connection, they must physically walk between every possible pair. Eventually, the room runs out of floor space—this is why our 'reading capacity' has been so limited, but solving this is the new frontier of our research."
              techText="Self-attention stores an N x N matrix in VRAM. As the sequence length (N) doubles, memory needs quadruple. This quadratic growth is why context limits have historically been low, and why scaling them remains one of the greatest frontiers in model development."
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
                    Memory Overflow
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#ff00e5]/60">
                    VRAM Capacity Exceeded
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
                      Hardware Status
                    </span>
                    <div className="mt-4">
                      <MemoryMeter
                        percentage={selfMemory}
                        label="Memory Load"
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
                    {mode === "story"
                      ? "The Comparison Grid"
                      : "Quadratic Matrix"}
                  </h3>
                </div>
                <div className="font-mono text-[10px] font-black tracking-widest text-blue-300/40">
                  {mode === "story" ? "TOTAL PAIRS" : "DIM"}: {sequenceLength}²
                </div>
              </div>

              {/* Process Monitor Status Box */}
              <div className="mb-8 px-4 py-4 md:px-5 md:py-4 bg-[#0a0a2e]/60 rounded-[2rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-[8px] font-black uppercase text-blue-300/40 tracking-[0.2em] mb-1.5">
                    {mode === "story"
                      ? "Comparing Clues"
                      : "Computing Dot Product"}
                  </span>
                  <div className="flex items-center gap-2 md:gap-3 text-sm font-black italic tracking-tight">
                    <span className="text-[#00f2ff]">
                      "
                      {
                        SELF_ATTENTION_SCENARIO.sentence[
                          Math.floor((step % 64) / 8)
                        ]
                      }
                      "
                    </span>
                    <ArrowRight size={12} className="text-white/10 md:size-4" />
                    <span className="text-[#ff00e5]">
                      "{SELF_ATTENTION_SCENARIO.sentence[(step % 64) % 8]}"
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[8px] font-black uppercase text-blue-300/40 tracking-[0.2em] mb-1.5 block">
                    {mode === "story" ? "Link Strength" : "Attention Weight"}
                  </span>
                  <span className="text-sm font-mono font-black text-white italic">
                    {(
                      activeIntent.weights[Math.floor((step % 64) / 8)][
                        (step % 64) % 8
                      ] * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
              </div>

              <div className="mx-auto grid w-full max-w-[440px] grid-cols-8 gap-1.5 aspect-square">
                {" "}
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isActive = i === step % 64;

                  const weight = activeIntent.weights[row][col];
                  const queryToken = SELF_ATTENTION_SCENARIO.sentence[row];
                  const keyToken = SELF_ATTENTION_SCENARIO.sentence[col];

                  return (
                    <Popover.Root key={i}>
                      <Popover.Trigger asChild>
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            backgroundColor:
                              weight > 0.5
                                ? "rgba(0, 242, 255, 0.4)"
                                : "rgba(10, 10, 46, 0.5)",
                            borderColor:
                              weight > 0.5
                                ? "rgba(0, 242, 255, 1)"
                                : "rgba(255, 255, 255, 0.05)",
                          }}
                          transition={{ delay: i * 0.002 }}
                          className={cn(
                            "flex items-center justify-center rounded-sm border font-mono text-[8px] transition-all duration-300",
                            isActive
                              ? "z-10 scale-110 border-[#ff00e5] bg-[#ff00e5]/40 shadow-[0_0_15px_#ff00e5]"
                              : "hover:border-white/20 hover:bg-white/5",
                          )}
                        >
                          {isActive ? "⚡" : weight > 0.4 ? "●" : ""}
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
                                {mode === "story" ? "Pair" : "Cell"}_{row}_{col}
                              </span>
                              <span className="font-mono text-[10px] font-black text-gray-400">
                                {mode === "story" ? "Link" : "Match"}_
                                {(weight * 100).toFixed(0)}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="mb-1 flex justify-between text-[8px] font-black uppercase tracking-tighter text-blue-500">
                                  <span>
                                    {mode === "tech"
                                      ? "Query (Q)"
                                      : "The Inquiry"}
                                  </span>
                                  <span className="opacity-50">Row {row}</span>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-2 text-[10px] font-black italic leading-snug text-blue-900 line-clamp-2">
                                  "{queryToken}"
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
                                <div className="rounded-xl bg-purple-50 p-2 font-black italic text-[10px] text-purple-900">
                                  "{keyToken}"
                                </div>
                              </div>
                            </div>
                            <p className="border-t border-gray-100 pt-3 text-[9px] font-bold uppercase italic leading-tight text-gray-400 tracking-tight">
                              Dynamic weighting recalculated for every pair.
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
                  Self-attention units must compute every connection{" "}
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
                Hardware Fault
              </h3>
              <p className="mt-2 text-sm font-medium italic text-blue-100/40 tracking-tight leading-relaxed">
                The grid has expanded beyond physical hardware constraints.
                Available memory has been exhausted.
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
                    Centralized {m.unit}
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
                      1. {mode === "tech" ? "Global Query (Q)" : "Core Inquiry"}
                    </h4>
                  </div>
                  <div className="rounded-2xl border-2 border-white/5 bg-white/5 p-4">
                    <div className="text-center text-sm font-bold italic leading-relaxed text-white">
                      "{SELF_ATTENTION_SCENARIO.sentence[step % 8]}"
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
                                    !isLearned || blockWeight < 0.1
                                      ? "opacity-0 pointer-events-none"
                                      : "",
                                    i === currentRow
                                      ? "bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]"
                                      : "bg-[#0a0a2e]/10 hover:bg-[#0a0a2e]/20",
                                  )}
                                >
                                  {isLearned && blockWeight > 0.4 && (
                                    <span className="text-[8px] font-black italic tracking-widest text-[#0a0a2e]/40">
                                      {SELF_ATTENTION_SCENARIO.sentence[i]}
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
                                        Data Entry {i + 1}
                                      </span>
                                      <span className="font-mono text-[10px] font-black text-gray-400">
                                        RANK_{(blockWeight * 100).toFixed(0)}
                                      </span>
                                    </div>
                                    <div className="rounded-2xl bg-gray-50 p-3 text-xs font-black italic leading-relaxed">
                                      "{SELF_ATTENTION_SCENARIO.sentence[i]}"
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
                          Weighted Sum
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

        {/* SYNTHESIS SECTION: The Result */}
        {!isOOM && (
          <section className="mt-32 space-y-12">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" />
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#00f2ff] italic">
                Final Synthesis
              </h2>
              <div className="w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black italic tracking-tighter text-white">
                  The Context-Aware Sentence
                </h3>
                <p className="text-blue-100/60 text-lg leading-relaxed font-medium italic max-w-2xl mx-auto">
                  The final output isn't just the original words. Every token
                  has now
                  <span className="text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4 mx-1">
                    absorbed information
                  </span>
                  from its neighbors based on those attention weights.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SELF_ATTENTION_SCENARIO.sentence.map((token, i) => {
                  // Find top 2 related words for this token based on weights
                  const weights = activeIntent.weights[i];
                  const relationships = weights
                    .map((w, idx) => ({
                      word: SELF_ATTENTION_SCENARIO.sentence[idx],
                      weight: w,
                      idx,
                    }))
                    .filter((r) => r.idx !== i && r.weight > 0.15)
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 2);

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/5 border border-white/10 p-5 rounded-[2rem] backdrop-blur-md relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-xl font-black italic text-white mb-3">
                        {token}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[8px] font-black uppercase text-blue-300/30 tracking-widest">
                          Absorbed Context
                        </div>
                        {relationships.length > 0 ? (
                          relationships.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-[#ff00e5]" />
                              <span className="text-[10px] font-bold text-[#00f2ff] italic">
                                {r.word}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-[10px] text-white/10 italic italic">
                            Self-referential
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-8 bg-[#ff00e5]/5 rounded-[2.5rem] border-2 border-[#ff00e5]/20 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 shrink-0 rounded-full bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] shadow-[0_0_20px_rgba(255,0,229,0.2)]">
                  <Zap size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white italic">
                    How it collates: The Weighted Average
                  </h4>
                  <p className="text-xs text-blue-100/50 leading-relaxed font-medium">
                    The model multiplies each "Value" (the meaning of the word)
                    by its "Attention Weight" (how important it is). It then
                    adds them all together. If "butler" is looking at "kitchen,"
                    the new mathematical representation of "butler" physically
                    contains parts of the "kitchen" context. This is how the
                    model builds a deeper understanding of the story.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NEXT SECTION: The Scaling Solution */}
        <section className="mt-32 w-full max-w-4xl mx-auto border-t border-white/10 pt-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff00e5]/10 rounded-full border border-[#ff00e5]/20 text-[10px] font-black text-[#ff00e5] uppercase tracking-widest italic">
                <Zap size={10} className="animate-pulse" />
                Beyond the Bottleneck
              </div>
              <h2 className="text-4xl font-black italic tracking-tighter text-white">
                How do we scale?
              </h2>
              <p className="text-blue-100/60 text-lg leading-relaxed font-medium italic">
                If a single student can't handle the mountain of clues, we don't
                buy a bigger room—we bring in a team.
                <span className="text-white font-black underline decoration-[#00f2ff] decoration-2 underline-offset-4 mx-1">
                  Ring Attention
                </span>
                distributes the sequence across a collaborative circle, allowing
                for near-infinite context.
              </p>

              <Link
                to="/ring-attention"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-[#00f2ff]/10 border-2 border-white/10 hover:border-[#00f2ff]/50 rounded-full transition-all mt-4"
              >
                <span className="text-xs font-black uppercase tracking-widest text-[#00f2ff]">
                  Explore Ring Attention
                </span>
                <ArrowRight
                  size={18}
                  className="text-[#00f2ff] group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="w-48 h-48 md:w-64 md:h-48 relative shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#00f2ff]/10 blur-3xl rounded-full animate-pulse" />
              {/* Abstract Ring Visual */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dashed border-[#00f2ff]/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] p-[2px] shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                  <div className="w-full h-full rounded-full bg-[#0a0a2e] flex items-center justify-center">
                    <History size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

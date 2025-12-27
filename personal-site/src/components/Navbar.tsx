import { RotateCcw, Pause, Play, ChevronRight, Radio } from "lucide-react";
import { METAPHORS, type Mode } from "../constants";
import { cn } from "./ui-elements";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  sequenceLength: number;
  setSequenceLength: (len: number) => void;
  numDevices?: number;
  setNumDevices?: (n: number) => void;
  step: number;
  setStep: (s: number | ((s: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  reset: () => void;
  maxSteps: number;
}

export const Navbar = ({
  mode,
  setMode,
  sequenceLength,
  setSequenceLength,
  numDevices,
  setNumDevices,
  step,
  setStep,
  isPlaying,
  setIsPlaying,
  reset,
  maxSteps,
}: NavbarProps) => {
  const m = METAPHORS[mode];
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a2e]/80 py-3 backdrop-blur-xl md:h-16 md:py-0">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:h-full md:flex-row md:gap-8">
        {/* Logo & Mode Switcher Row (Mobile) */}
        <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] p-[1px] shadow-[0_0_15px_rgba(0,242,255,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a2e] text-[10px] font-black text-white">
                  TT
                </div>
              </div>
              <h1 className="hidden text-[10px] font-black uppercase tracking-tighter text-white sm:block italic">
                Back to base
              </h1>
            </Link>

            <div className="flex items-center gap-1 border-l border-white/10 pl-3 ml-1">
              <Link
                to="/self-attention"
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all italic",
                  location.pathname === "/self-attention"
                    ? "text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                    : "text-blue-300/40 hover:text-blue-100",
                )}
              >
                Self
              </Link>
              <Link
                to="/ring-attention"
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all italic",
                  location.pathname === "/ring-attention"
                    ? "text-[#ff00e5] shadow-[0_0_10px_rgba(255,0,229,0.2)]"
                    : "text-blue-300/40 hover:text-blue-100",
                )}
              >
                Ring
              </Link>
            </div>
          </div>

          {/* Mode Switcher (Mobile Only) */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5 md:hidden">
            <button
              onClick={() => setMode("story")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all italic",
                mode === "story"
                  ? "bg-[#00f2ff] text-[#0a0a2e]"
                  : "text-blue-300/60",
              )}
            >
              Story Mode
            </button>
            <button
              onClick={() => setMode("tech")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all italic",
                mode === "tech"
                  ? "bg-[#ff00e5] text-white"
                  : "text-blue-300/60",
              )}
            >
              Tech Mode
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-3 md:flex-nowrap md:gap-8 lg:gap-12">
          {/* Sequence Length Slider */}
          <div className="flex min-w-[120px] flex-col gap-0.5 sm:min-w-[140px]">
            <div className="flex items-end justify-between px-1">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/40">
                {m.data}s
              </label>
              <span className="font-mono text-[10px] font-black text-[#00f2ff]">
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
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#00f2ff]"
            />
          </div>

          {/* Ring Size Toggle */}
          {numDevices !== undefined && setNumDevices && (
            <div className="flex flex-col gap-0.5 shrink-0">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/40 text-center">
                Nodes
              </label>
              <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5">
                {[2, 4, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setNumDevices(n);
                      reset();
                    }}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all italic",
                      numDevices === n
                        ? "bg-white/20 text-[#00f2ff]"
                        : "text-blue-300/40 hover:text-blue-100",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Playback Controls & Phase */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5">
              <button
                onClick={reset}
                className="rounded-full p-1.5 text-blue-300/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "mx-0.5 flex h-7 w-8 items-center justify-center rounded-full font-black shadow-lg transition-all active:scale-95",
                  isPlaying
                    ? "bg-[#ff00e5]/20 text-[#ff00e5]"
                    : "bg-[#00f2ff] text-[#0a0a2e]",
                )}
              >
                {isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
              </button>
              <button
                onClick={() => setStep((s) => (s + 1) % maxSteps)}
                className="rounded-full p-1.5 text-blue-300/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Radio size={10} className="text-[#ff00e5] animate-pulse" />
              <div className="flex items-baseline gap-1">
                <div className="text-[8px] font-black uppercase tracking-widest text-blue-300/40">
                  Step
                </div>
                <div className="font-mono text-lg font-black leading-none tracking-tighter text-white italic">
                  {step + 1}
                  <span className="text-blue-300/40">/</span>
                  {maxSteps}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher (Desktop Only) */}
        <div className="hidden shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5 md:flex">
          <button
            onClick={() => setMode("story")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase transition-all italic",
              mode === "story"
                ? "bg-[#00f2ff] text-[#0a0a2e]"
                : "text-blue-300/60",
            )}
          >
            Story Mode
          </button>
          <button
            onClick={() => setMode("tech")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase transition-all italic",
              mode === "tech"
                ? "bg-[#ff00e5] text-white shadow-[0_0_10px_rgba(255,0,229,0.3)]"
                : "text-blue-300/60",
            )}
          >
            Tech Mode
          </button>
        </div>
      </div>
    </nav>
  );
};

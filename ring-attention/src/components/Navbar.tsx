import {
  GraduationCap,
  Cpu,
  RotateCcw,
  Pause,
  Play,
  ChevronRight,
} from "lucide-react";
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
    <nav className="sticky top-0 z-50 border-b border-gray-900 bg-black/80 py-3 backdrop-blur-xl md:h-16 md:py-0">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:h-full md:flex-row md:gap-8">
        <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-xs font-black text-white">
                TKT
              </div>
              <h1 className="hidden text-[10px] font-bold uppercase tracking-tighter text-white sm:block">
                Tristan Tarpley
              </h1>
            </Link>

            <div className="flex items-center gap-1 border-l border-gray-800 pl-3 ml-1">
              <Link
                to="/self-attention"
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold transition-all",
                  location.pathname === "/self-attention"
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                Standard
              </Link>
              <Link
                to="/ring-attention"
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold transition-all",
                  location.pathname === "/ring-attention"
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300",
                )}
              >
                Ring
              </Link>
            </div>
          </div>

          {/* Mode Switcher (Mobile Only) */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900 p-0.5 md:hidden">
            <button
              onClick={() => setMode("story")}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1 text-[9px] font-bold transition-all",
                mode === "story" ? "bg-blue-600 text-white" : "text-gray-500",
              )}
            >
              <GraduationCap size={10} /> Story
            </button>
            <button
              onClick={() => setMode("tech")}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1 text-[9px] font-bold transition-all",
                mode === "tech" ? "bg-purple-600 text-white" : "text-gray-500",
              )}
            >
              <Cpu size={10} /> Tech
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-3 md:flex-nowrap md:gap-8 lg:gap-12">
          {/* Sequence Length Slider */}
          <div className="flex min-w-[120px] flex-col gap-0.5 sm:min-w-[140px]">
            <div className="flex items-end justify-between">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">
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
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-800 accent-blue-500"
            />
          </div>

          {/* Ring Size Toggle (only if applicable) */}
          {numDevices !== undefined && setNumDevices && (
            <div className="flex flex-col gap-0.5 shrink-0">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                Ring Size
              </label>
              <div className="flex rounded-lg border border-gray-800 bg-black/40 p-0.5">
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
          )}

          {/* Playback Controls & Phase */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex rounded-lg border border-gray-800 bg-black/40 p-0.5">
              <button
                onClick={reset}
                className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-800"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "mx-0.5 flex h-7 w-8 items-center justify-center rounded font-bold shadow-lg transition-all active:scale-95",
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
                onClick={() => setStep((s) => (s + 1) % maxSteps)}
                className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-800"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-baseline gap-1.5">
              <div className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                Phase
              </div>
              <div className="font-mono text-lg font-black leading-none tracking-tighter text-white">
                {step + 1}
                <span className="text-xs text-gray-500">/</span>
                {maxSteps}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher (Desktop Only) */}
        <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 p-0.5 md:flex">
          <button
            onClick={() => setMode("story")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1 text-[10px] font-bold transition-all",
              mode === "story" ? "bg-blue-600 text-white" : "text-gray-500",
            )}
          >
            <GraduationCap size={12} />{" "}
            <span className="hidden xl:inline">Story</span>
          </button>
          <button
            onClick={() => setMode("tech")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1 text-[10px] font-bold transition-all",
              mode === "tech" ? "bg-purple-600 text-white" : "text-gray-500",
            )}
          >
            <Cpu size={12} /> <span className="hidden xl:inline">Tech</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

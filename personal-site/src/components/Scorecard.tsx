import * as Popover from "@radix-ui/react-popover";
import { Calculator, Radio } from "lucide-react";
import { cn } from "./ui-elements";
import { DEFINITIONS, type Mode } from "../constants";
import { motion } from "framer-motion";

interface ScorecardProps {
  currentScore: number;
  max: number;
  sum: number;
  mode: Mode;
}

export const Scorecard = ({ currentScore, max, sum, mode }: ScorecardProps) => {
  return (
    <div className="bg-[#0a0a2e]/50 p-4 rounded-3xl border-2 border-white/5 backdrop-blur-md shadow-inner">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Calculator size={14} className="text-[#ff00e5]" />
          <h5 className="text-[9px] font-black text-blue-300/60 uppercase tracking-[0.3em] italic">
            Scorecard
          </h5>
        </div>
        <Radio size={10} className="text-[#00f2ff] animate-pulse" />
      </div>
      <div className="space-y-2 font-mono">
        {[
          {
            id: "score",
            label: "SIMILARITY",
            value: `${(currentScore * 100).toFixed(1)}%`,
            color: "text-[#ff00e5]",
          },
          {
            id: "max",
            label: "GLOBAL_MAX",
            value: max.toFixed(4),
            color: "text-white",
          },
          {
            id: "sum",
            label: "ACCUM_SUM",
            value: sum.toFixed(4),
            color: "text-white",
          },
        ].map((item) => (
          <Popover.Root key={item.id}>
            <Popover.Trigger asChild>
              <button className="w-full flex justify-between items-center text-[10px] p-2 hover:bg-white/5 rounded-xl transition-all text-left group border border-transparent hover:border-white/10">
                <span className="text-blue-300/40 border-b border-white/5 border-dotted group-hover:text-blue-100 transition-colors tracking-tighter">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "font-black italic tracking-tighter",
                    item.color,
                  )}
                >
                  {item.value}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={10}
                collisionPadding={10}
                className="z-50 w-[calc(100vw-40px)] max-w-72 bg-white border-2 border-white/20 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300 text-gray-900"
              >
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase text-[#00f2ff] tracking-[0.2em] italic">
                    {DEFINITIONS[item.id as keyof typeof DEFINITIONS].title}
                  </div>
                  <p className="text-xs font-medium leading-relaxed italic text-gray-600">
                    {mode === "story"
                      ? DEFINITIONS[item.id as keyof typeof DEFINITIONS].story
                      : DEFINITIONS[item.id as keyof typeof DEFINITIONS].tech}
                  </p>
                </div>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ))}
      </div>
    </div>
  );
};

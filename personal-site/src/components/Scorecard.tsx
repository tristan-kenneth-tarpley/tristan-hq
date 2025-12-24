import * as Popover from "@radix-ui/react-popover";
import { Calculator } from "lucide-react";
import { cn } from "./ui-elements";
import { DEFINITIONS, type Mode } from "../constants";

interface ScorecardProps {
  currentScore: number;
  max: number;
  sum: number;
  mode: Mode;
}

export const Scorecard = ({ currentScore, max, sum, mode }: ScorecardProps) => {
  return (
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
            value: max.toFixed(4),
            color: "text-white",
          },
          {
            id: "sum",
            label: "Sum (S)",
            value: sum.toFixed(4),
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
                collisionPadding={10}
                className="z-50 w-[calc(100vw-40px)] max-w-72 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200"
              >
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
                    {DEFINITIONS[item.id as keyof typeof DEFINITIONS].title}
                  </div>
                  <p className="text-xs font-sans leading-relaxed text-gray-300">
                    {mode === "story"
                      ? DEFINITIONS[item.id as keyof typeof DEFINITIONS].story
                      : DEFINITIONS[item.id as keyof typeof DEFINITIONS].tech}
                  </p>
                </div>
                <Popover.Arrow className="fill-gray-800" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ))}
      </div>
    </div>
  );
};

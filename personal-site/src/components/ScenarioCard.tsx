import { BookOpen, BookMarked, Zap } from "lucide-react";
import { type Mode } from "../constants";

interface ScenarioCardProps {
  mode: Mode;
  storyText: string;
  techText: string;
}

export const ScenarioCard = ({
  mode,
  storyText,
  techText,
}: ScenarioCardProps) => {
  return (
    <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen size={100} />
      </div>
      <div className="relative z-10 flex gap-6 items-center">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg">
          {mode === "story" ? <BookMarked size={24} /> : <Zap size={24} />}
        </div>
        <div>
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">
            The Scenario
          </h3>
          <p className="text-gray-300 leading-relaxed italic text-xs">
            {mode === "story" ? storyText : techText}
          </p>
        </div>
      </div>
    </div>
  );
};

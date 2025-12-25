/* eslint-disable react-refresh/only-export-components */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MemoryMeter = ({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) => {
  const isOOM = percentage >= 100;
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className={isOOM ? "text-[#ff00e5]" : "text-blue-300/60"}>
          {label}
        </span>
        <span className={cn(isOOM ? "text-[#ff00e5]" : "text-[#00f2ff]")}>
          {Math.min(100, Math.round(percentage))}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-[#0a0a2e]">
        <motion.div
          className={cn(
            "h-full transition-colors duration-500",
            isOOM
              ? "bg-[#ff00e5] shadow-[0_0_15px_#ff00e5]"
              : "bg-gradient-to-r from-[#00f2ff] to-[#ff00e5]",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};

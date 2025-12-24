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
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className={isOOM ? "text-red-500" : "text-gray-500"}>
          {label}
        </span>
        <span className={cn(isOOM ? "text-red-500" : "text-blue-400")}>
          {Math.min(100, Math.round(percentage))}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <motion.div
          className={cn(
            "h-full transition-colors duration-500",
            isOOM ? "bg-red-600" : "bg-blue-500",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};

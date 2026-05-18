import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface SiteNavProps {
  back?: { label: string; to: string };
  maxWidth?: string;
}

export default function SiteNav({ back, maxWidth = "max-w-5xl" }: SiteNavProps) {
  return (
    <nav
      className={`${maxWidth} mx-auto px-6 pt-10 relative z-10 flex items-center justify-between`}
    >
      <Link to="/" className="group flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] p-[1px] shadow-[0_0_12px_rgba(0,242,255,0.25)] group-hover:shadow-[0_0_18px_rgba(0,242,255,0.45)] transition-shadow">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a2e] text-[10px] font-black text-white">
            TT
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-white/70 transition-colors italic">
          Tristan HQ
        </span>
      </Link>

      {back && (
        <Link
          to={back.to}
          className="group inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-white/25 hover:text-[#00f2ff] transition-colors italic"
        >
          <ArrowLeft
            size={11}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          {back.label}
        </Link>
      )}
    </nav>
  );
}

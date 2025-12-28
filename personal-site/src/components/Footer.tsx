import { Linkedin, Github } from "lucide-react";
import { LINKS } from "../constants";

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
};

export default function Footer() {
  return (
    <div className="mt-24 text-blue-100/20 text-[10px] font-black uppercase tracking-[0.4em] flex flex-col md:flex-row items-center gap-4 md:gap-4 text-center">
      <span>Stardate {getYear()}</span>
      <div className="w-1 h-1 bg-white/20 rounded-full hidden md:block" />
      <span>Sector: Houston</span>
      <div className="w-1 h-1 bg-white/20 rounded-full hidden md:block" />
      <div className="flex items-center gap-4 md:contents">
        <a
          href={LINKS.LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00f2ff] transition-colors flex items-center gap-1.5"
        >
          <Linkedin size={10} />
          <span>LinkedIn</span>
        </a>
        <div className="w-1 h-1 bg-white/20 rounded-full md:block" />
        <a
          href={LINKS.GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00f2ff] transition-colors flex items-center gap-1.5"
        >
          <Github size={10} />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );
}

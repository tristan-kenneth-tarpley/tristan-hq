import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getEssays } from '../utils/essays';
import Footer from '../components/Footer';
import SiteNav from '../components/SiteNav';

export default function Essays() {
  const essays = getEssays();

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#ff00e5]/30 font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff00e5]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 blur-[150px] rounded-full" />
      </div>

      <SiteNav maxWidth="max-w-3xl" back={{ label: "Back to Base", to: "/" }} />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="w-3 h-3 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" />
            <h1 className="text-xs font-black uppercase tracking-[0.5em] text-[#ff00e5]">
              Stuff I Wrote
            </h1>
            <div className="w-3 h-3 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" />
          </div>

          <div className="space-y-4">
            {essays.map((essay, i) => (
              <motion.div
                key={essay.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/essays/${essay.slug}`} className="group relative block">
                  <div className="absolute inset-0 bg-[#ff00e5]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <div className="relative bg-[#16164d]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 group-hover:border-[#ff00e5]/40 transition-all flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] border border-[#ff00e5]/20 group-hover:bg-[#ff00e5]/20 transition-all mt-0.5">
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-black italic tracking-tight text-white leading-snug">
                          {essay.title}
                        </h2>
                        {essay.description && (
                          <p className="text-blue-300/50 text-xs font-medium mt-1 leading-relaxed line-clamp-2">
                            {essay.description}
                          </p>
                        )}
                        {essay.date && (
                          <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mt-2">
                            {new Date(essay.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      className="shrink-0 text-white/20 group-hover:text-[#ff00e5] group-hover:translate-x-1 transition-all"
                      size={22}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

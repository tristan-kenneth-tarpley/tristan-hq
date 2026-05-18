import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEssay } from '../utils/essays';
import Footer from '../components/Footer';
import SiteNav from '../components/SiteNav';

export default function EssayPost() {
  const { slug } = useParams<{ slug: string }>();
  const essay = slug ? getEssay(slug) : undefined;

  if (!essay) return <Navigate to="/essays" replace />;

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#ff00e5]/30 font-sans">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff00e5]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 blur-[150px] rounded-full" />
      </div>

      <SiteNav maxWidth="max-w-3xl" back={{ label: "All Essays", to: "/essays" }} />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-black italic tracking-tight text-white leading-tight mb-4">
              {essay.title}
            </h1>
            {essay.description && (
              <p className="text-blue-100/60 text-lg font-medium leading-relaxed mb-4">
                {essay.description}
              </p>
            )}
            {essay.date && (
              <p className="text-[#ff00e5]/60 text-[10px] uppercase tracking-[0.4em] font-black">
                {new Date(essay.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
            <div className="mt-8 h-px bg-gradient-to-r from-[#ff00e5]/30 via-white/10 to-transparent" />
          </div>

          {/* Prose */}
          <div className="essay-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-black italic tracking-tight text-white mt-12 mb-4 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-black italic tracking-tight text-white mt-10 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-black italic text-white mt-8 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-blue-100/75 text-[1.05rem] leading-[1.85] mb-5 font-medium">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-[#ff00e5] hover:text-[#ff00e5]/80 underline underline-offset-2 transition-colors"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-black">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-blue-100/90 italic">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="mb-5 space-y-2 pl-6">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-5 space-y-2 pl-6 list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-blue-100/75 text-[1.05rem] leading-[1.85] font-medium relative before:content-['—'] before:absolute before:-left-5 before:text-[#ff00e5]/50">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#ff00e5]/40 pl-5 my-6 text-blue-100/60 italic">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.startsWith('language-');
                  if (isBlock) {
                    return (
                      <code className="block bg-[#16164d] border border-white/10 rounded-xl p-4 text-[#00f2ff] text-sm font-mono leading-relaxed overflow-x-auto mb-5 whitespace-pre">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="bg-[#16164d] border border-white/10 rounded px-1.5 py-0.5 text-[#00f2ff] text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                hr: () => (
                  <div className="my-10 h-px bg-gradient-to-r from-[#ff00e5]/20 via-white/10 to-transparent" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b border-[#ff00e5]/30">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-white/5">{children}</tbody>
                ),
                tr: ({ children }) => <tr className="group">{children}</tr>,
                th: ({ children }) => (
                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#ff00e5]/70">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-blue-100/70 font-medium leading-relaxed group-hover:text-blue-100/90 transition-colors">
                    {children}
                  </td>
                ),
              }}
            >
              {essay.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

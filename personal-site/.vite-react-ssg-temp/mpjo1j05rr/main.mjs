import { ViteReactSSG } from "vite-react-ssg";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, BookMarked, BookOpen, Brain, Calculator, ChevronRight, CircleDot, Clock, Cpu, Flashlight, Github, GraduationCap, History, Info, LayoutGrid, Linkedin, Notebook, Pause, Play, Radio, Rocket, RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as Popover from "@radix-ui/react-popover";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ReactMarkdown from "react-markdown";
const LINKS = {
	LINKEDIN: "https://www.linkedin.com/in/tristantarpley/",
	GITHUB: "https://github.com/tristan-kenneth-tarpley"
};
const STORY_DATA = [
	{
		id: 0,
		text: "The Manor House stood silent under the moonlight. Clues are hidden in every wing.",
		score: .4
	},
	{
		id: 1,
		text: "At 12:00 AM, the butler was seen leaving the kitchen with a mysterious tray.",
		score: .95
	},
	{
		id: 2,
		text: "A silver key was found in the rose garden, covered in fresh, dark mud.",
		score: .6
	},
	{
		id: 3,
		text: "The heavy rain washed away any footprints near the library window.",
		score: .3
	},
	{
		id: 4,
		text: "The clock struck twelve, echoing through the silent corridors of the east wing.",
		score: .5
	},
	{
		id: 5,
		text: "The cook confirmed that everyone was in the dining hall until 11 PM sharp.",
		score: .2
	},
	{
		id: 6,
		text: "A witness saw a tall shadow moving towards the safe exactly at midnight.",
		score: .85
	},
	{
		id: 7,
		text: "The safe was found open; only a single blue feather was left inside.",
		score: .55
	}
];
const TECH_DATA = [
	{
		id: 0,
		text: "attention_weights = softmax(Q @ K.T / sqrt(d_k))",
		score: .4
	},
	{
		id: 1,
		text: "ring_communication_step(kv_buffer, next_rank)",
		score: .95
	},
	{
		id: 2,
		text: "v_accum = v_accum + attention_weights @ V",
		score: .6
	},
	{
		id: 3,
		text: "linear_complexity = O(N_seq / N_devices)",
		score: .3
	},
	{
		id: 4,
		text: "causal_masking = torch.tril(ones(seq_len, seq_len))",
		score: .5
	},
	{
		id: 5,
		text: "multi_head_projection = W_q(x), W_k(x), W_v(x)",
		score: .2
	},
	{
		id: 6,
		text: "online_softmax_update(max, sum, new_weights)",
		score: .85
	},
	{
		id: 7,
		text: "lossless_context_scaling = True",
		score: .55
	}
];
const METAPHORS = {
	story: {
		title: "The Study Circle",
		unit: "Student",
		data: "Page",
		transfer: "KV Cache (Notes)",
		searchTool: "Flashlight",
		storage: "Summary Notebook",
		mathTerm: "Perfect Recall",
		query: "What was the butler doing at midnight?"
	},
	tech: {
		title: "Ring Attention",
		unit: "GPU Node",
		data: "Token",
		transfer: "KV Cache (K, V)",
		searchTool: "Query Beam",
		storage: "Attention Output (Z)",
		mathTerm: "Online Softmax",
		query: "ring_communication_step(kv_buffer, next_rank)"
	}
};
const DEFINITIONS = {
	score: {
		title: "Current Similarity Score",
		story: "How well this specific page matches your flashlight's search. A 95% match means this page likely contains the answer you're looking for.",
		tech: "The dot product of the Query (Q) and the current Key (K). It measures the 'relevance' of these tokens to your search vector."
	},
	max: {
		title: "Global Max (M)",
		story: "The highest similarity score you've found across all steps so far. It's like keeping track of the single most important clue found yet.",
		tech: "The maximum logit encountered. We track this to perform 'Numerical Stabilization,' ensuring the exponential math doesn't overflow."
	},
	sum: {
		title: "Accumulated Sum (S)",
		story: "The total 'volume' of all clues found so far. We need this total at the end to properly weight how much attention to pay to each clue.",
		tech: "The running denominator of the Softmax function. It allows us to calculate an identical result to self-attention without seeing all data at once."
	}
};
var getYear = () => {
	return (/* @__PURE__ */ new Date()).getFullYear();
};
function Footer() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-24 text-blue-100/20 text-[10px] font-black uppercase tracking-[0.4em] flex flex-col md:flex-row items-center gap-4 md:gap-4 text-center",
		children: [
			/* @__PURE__ */ jsxs("span", { children: ["Stardate ", getYear()] }),
			/* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-white/20 rounded-full hidden md:block" }),
			/* @__PURE__ */ jsx("span", { children: "Sector: Houston" }),
			/* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-white/20 rounded-full hidden md:block" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4 md:contents",
				children: [
					/* @__PURE__ */ jsxs("a", {
						href: LINKS.LINKEDIN,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "hover:text-[#00f2ff] transition-colors flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Linkedin, { size: 10 }), /* @__PURE__ */ jsx("span", { children: "LinkedIn" })]
					}),
					/* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-white/20 rounded-full md:block" }),
					/* @__PURE__ */ jsxs("a", {
						href: LINKS.GITHUB,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "hover:text-[#00f2ff] transition-colors flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Github, { size: 10 }), /* @__PURE__ */ jsx("span", { children: "GitHub" })]
					})
				]
			})
		]
	});
}
function Profile() {
	return /* @__PURE__ */ jsxs("section", {
		className: "mb-20 space-y-8 relative z-20",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center gap-4",
			children: [
				/* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" }),
				/* @__PURE__ */ jsx("h2", {
					className: "text-[10px] font-black uppercase tracking-[0.5em] text-[#ff00e5] italic",
					children: "Profile"
				}),
				/* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" })
			]
		}), /* @__PURE__ */ jsxs(motion.div, {
			whileHover: { scale: 1.02 },
			className: "bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border-2 border-white/10 flex flex-col md:flex-row items-center gap-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden group",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" }),
				/* @__PURE__ */ jsxs("div", {
					className: "w-28 h-28 rounded-full border-4 border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.3)] overflow-hidden shrink-0 bg-[#0a0a2e] relative",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-[#ff00e5]/20 to-transparent opacity-50 z-10" }), /* @__PURE__ */ jsx("div", {
						className: "w-full h-full flex items-center justify-center text-[#00f2ff]/20",
						children: /* @__PURE__ */ jsx("img", {
							src: "/headshot.JPG",
							alt: "Profile Picture",
							className: "w-full h-full object-cover"
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-left flex-1 relative z-10",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-black text-white italic mb-2 tracking-tight uppercase",
							children: "Tristan Tarpley"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-sm text-blue-100/70 leading-relaxed font-medium italic",
							children: [
								"I'm a Staff Engineer at",
								" ",
								/* @__PURE__ */ jsx("a", {
									href: "https://www.webflow.com/",
									target: "_blank",
									rel: "noopener",
									className: "text-white font-black underline decoration-[#00f2ff] decoration-2 underline-offset-4",
									children: "Webflow"
								}),
								" ",
								"building generative design products. I live in Houston, Texas, with my wife, Andréa, and daughter, Amélie."
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center gap-4",
							children: [/* @__PURE__ */ jsxs("a", {
								href: LINKS.LINKEDIN,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:text-[#ff00e5] transition-colors group/link",
								children: [/* @__PURE__ */ jsx(Linkedin, { size: 14 }), /* @__PURE__ */ jsx("span", { children: "LinkedIn" })]
							}), /* @__PURE__ */ jsxs("a", {
								href: LINKS.GITHUB,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00f2ff] hover:text-[#ff00e5] transition-colors group/link",
								children: [/* @__PURE__ */ jsx(Github, { size: 14 }), /* @__PURE__ */ jsx("span", { children: "GitHub" })]
							})]
						})
					]
				})
			]
		})]
	});
}
function LabExperiments() {
	return /* @__PURE__ */ jsxs("section", {
		className: "space-y-8 relative",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center gap-4",
			children: [
				/* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" }),
				/* @__PURE__ */ jsx("h2", {
					className: "text-xs font-black uppercase tracking-[0.5em] text-[#00f2ff]",
					children: "Lab Experiments"
				}),
				/* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 gap-6 w-full max-w-md mx-auto",
			children: [/* @__PURE__ */ jsxs(Link, {
				to: "/attention",
				className: "group relative",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#00f2ff]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" }), /* @__PURE__ */ jsxs(motion.div, {
					whileHover: {
						y: -8,
						scale: 1.05
					},
					className: "bg-[#16164d]/80 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white/10 group-hover:border-[#00f2ff]/50 transition-all flex items-center justify-between shadow-2xl relative z-10",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-14 h-14 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20 group-hover:bg-[#00f2ff]/20 transition-all",
							children: /* @__PURE__ */ jsx(Rocket, {
								size: 28,
								className: "group-hover:rotate-45 transition-transform duration-500"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-black italic tracking-tight text-white",
								children: "Attention Lab"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-blue-300/50 text-[10px] uppercase font-black tracking-widest mt-1",
								children: "Visualizing LLM attention mechanisms"
							})]
						})]
					}), /* @__PURE__ */ jsx(ArrowRight, {
						className: "text-white/20 group-hover:text-[#00f2ff] group-hover:translate-x-2 transition-all",
						size: 28
					})]
				})]
			}), /* @__PURE__ */ jsxs(Link, {
				to: "/essays",
				className: "group relative",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#ff00e5]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" }), /* @__PURE__ */ jsxs(motion.div, {
					whileHover: {
						y: -8,
						scale: 1.05
					},
					className: "bg-[#16164d]/80 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-white/10 group-hover:border-[#ff00e5]/50 transition-all flex items-center justify-between shadow-2xl relative z-10",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-14 h-14 rounded-full bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] border border-[#ff00e5]/20 group-hover:bg-[#ff00e5]/20 transition-all",
							children: /* @__PURE__ */ jsx(BookOpen, { size: 28 })
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-black italic tracking-tight text-white",
								children: "Stuff I Wrote"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-blue-300/50 text-[10px] uppercase font-black tracking-widest mt-1",
								children: "Essays and musings"
							})]
						})]
					}), /* @__PURE__ */ jsx(ArrowRight, {
						className: "text-white/20 group-hover:text-[#ff00e5] group-hover:translate-x-2 transition-all",
						size: 28
					})]
				})]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#00f2ff]/30 font-sans relative",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "fixed inset-0 pointer-events-none overflow-hidden",
			children: [
				/* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						scale: .8,
						rotate: 0
					},
					animate: {
						opacity: 1,
						scale: 1,
						rotate: 30
					},
					transition: {
						duration: 2.5,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border-[40px] border-[#00f2ff]/5 rounded-full"
				}),
				/* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						scale: .8,
						rotate: 0
					},
					animate: {
						opacity: 1,
						scale: 1,
						rotate: -15
					},
					transition: {
						duration: 2.5,
						ease: [
							.22,
							1,
							.36,
							1
						],
						delay: .3
					},
					className: "absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] border-[20px] border-[#ff00e5]/5 rounded-full"
				}),
				/* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						scale: 0,
						rotate: -180
					},
					animate: {
						opacity: .2,
						scale: 1,
						rotate: 0
					},
					transition: {
						duration: 1.5,
						ease: "backOut",
						delay: .8
					},
					className: "absolute top-[20%] left-[10%] text-[#00f2ff]",
					children: /* @__PURE__ */ jsx("div", {
						className: "animate-pulse",
						children: /* @__PURE__ */ jsx(Sparkles, { size: 40 })
					})
				}),
				/* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						scale: 0,
						rotate: 180
					},
					animate: {
						opacity: .2,
						scale: 1,
						rotate: 0
					},
					transition: {
						duration: 1.5,
						ease: "backOut",
						delay: 1
					},
					className: "absolute bottom-[30%] right-[15%] text-[#ff00e5]",
					children: /* @__PURE__ */ jsx("div", {
						className: "animate-pulse delay-700",
						children: /* @__PURE__ */ jsx(Sparkles, { size: 32 })
					})
				})
			]
		}), /* @__PURE__ */ jsxs("main", {
			className: "max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen relative z-10",
			children: [/* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 50
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: 1,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "w-full max-w-2xl text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "relative mb-16",
						children: /* @__PURE__ */ jsxs(motion.div, {
							animate: { y: [
								0,
								-15,
								0
							] },
							transition: {
								repeat: Infinity,
								duration: 4,
								ease: "easeInOut"
							},
							className: "bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] p-12 shadow-[0_0_50px_rgba(0,242,255,0.15)] relative z-10 transform-gpu",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center",
									children: [/* @__PURE__ */ jsx("div", { className: "w-1 h-12 bg-white/20" }), /* @__PURE__ */ jsx(motion.div, {
										animate: {
											scale: [
												1,
												1.2,
												1
											],
											opacity: [
												.5,
												1,
												.5
											]
										},
										transition: {
											repeat: Infinity,
											duration: 2
										},
										className: "w-4 h-4 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff]"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 mb-6 px-4 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-full",
									children: [/* @__PURE__ */ jsx(Radio, {
										size: 12,
										className: "text-[#00f2ff] animate-pulse"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff]",
										children: "Houston, Texas"
									})]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-7xl font-black tracking-tighter text-white mb-6 bg-gradient-to-b from-white to-[#00f2ff] bg-clip-text text-transparent italic",
									children: "Welcome to Tristan HQ"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xl text-blue-100/70 leading-relaxed max-w-lg mx-auto font-medium italic",
									children: "Home of tinkerings, musings, and happenings"
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute top-[100%] left-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent -z-10" }),
								/* @__PURE__ */ jsx("div", { className: "absolute top-[100%] right-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent -z-10" })
							]
						})
					}),
					/* @__PURE__ */ jsx(Profile, {}),
					/* @__PURE__ */ jsx(LabExperiments, {})
				]
			}), /* @__PURE__ */ jsx(Footer, {})]
		})]
	});
}
function AttentionLab() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0a0a2e] text-white selection:bg-[#00f2ff]/30 font-sans",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 blur-[150px] rounded-full" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff00e5]/5 blur-[150px] rounded-full" })]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "max-w-5xl mx-auto px-6 pt-12 relative z-10",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-300/40 hover:text-[#00f2ff] transition-all italic",
					children: [/* @__PURE__ */ jsx(ArrowLeft, {
						size: 12,
						className: "group-hover:-translate-x-1 transition-transform"
					}), "Back to Base"]
				})
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "max-w-5xl mx-auto px-6 py-12 flex flex-col items-center",
				children: [
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "text-center mb-20",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-4 py-1 bg-[#00f2ff]/10 rounded-full border border-[#00f2ff]/20 text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] mb-6 italic shadow-[0_0_15px_rgba(0,242,255,0.1)]",
								children: [/* @__PURE__ */ jsx(Sparkles, {
									size: 10,
									className: "animate-pulse"
								}), "Interactive Lab"]
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "text-6xl font-black tracking-tighter mb-6 italic",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[#00f2ff]",
									children: "Attention"
								}), " in LLMs"]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mb-4 text-blue-100/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic",
								children: [
									"Large Language Models are essentially massive neural networks supercharged by an",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4",
										children: "Attention Mechanism"
									}),
									"."
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-blue-100/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic",
								children: "In an effort to better understand what's going on under the hood, I built a couple of visualizers. I hope it's somewhat illustrative for you!"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-8 w-full",
						children: [/* @__PURE__ */ jsx(PageCard, {
							title: "Self Attention",
							desc: "The foundation of modern LLMs. Understand the quadratic memory wall and why context length is limited.",
							href: "/self-attention",
							icon: /* @__PURE__ */ jsx(LayoutGrid, {
								className: "text-[#00f2ff]",
								size: 32
							}),
							mode: "The Breakthrough"
						}), /* @__PURE__ */ jsx(PageCard, {
							title: "Ring Attention",
							desc: "The distributed solution for infinite context. See how KV blocks rotate through a cluster without information loss.",
							href: "/ring-attention",
							icon: /* @__PURE__ */ jsx(CircleDot, {
								className: "text-[#ff00e5]",
								size: 32
							}),
							mode: "The Scaling Mechanism"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-32 pt-12 border-t border-white/5 w-full grid grid-cols-1 md:grid-cols-3 gap-12",
						children: [
							/* @__PURE__ */ jsx(Feature, {
								icon: /* @__PURE__ */ jsx(Brain, {
									className: "text-[#00f2ff]",
									size: 24
								}),
								title: "Dual Metaphor",
								desc: "Switch between 'Story Mode' for intuition and 'Tech Mode' for precision."
							}),
							/* @__PURE__ */ jsx(Feature, {
								icon: /* @__PURE__ */ jsx(Cpu, {
									className: "text-[#ff00e5]",
									size: 24
								}),
								title: "Real-Time Math",
								desc: "Watch Online Softmax update as context rotates through the cluster."
							}),
							/* @__PURE__ */ jsx(Feature, {
								icon: /* @__PURE__ */ jsx(GraduationCap, {
									className: "text-[#00f2ff]",
									size: 24
								}),
								title: "No Information Loss",
								desc: "Learn why Ring Attention is bit-perfect, unlike RAG or sliding windows."
							})
						]
					})
				]
			})
		]
	});
}
function PageCard({ title, desc, href, icon, mode }) {
	return /* @__PURE__ */ jsx(Link, {
		to: href,
		className: "group",
		children: /* @__PURE__ */ jsxs(motion.div, {
			whileHover: {
				y: -8,
				scale: 1.02
			},
			className: "bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/5 group-hover:border-[#00f2ff]/30 transition-all h-full flex flex-col shadow-2xl relative overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity",
					children: icon
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-8",
					children: icon
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]/60 italic",
					children: mode
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-black mb-4 group-hover:text-[#00f2ff] transition-colors italic tracking-tight",
					children: title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-blue-100/50 text-sm leading-relaxed mb-12 flex-1 font-medium",
					children: desc
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all italic text-[#ff00e5]",
					children: ["Check it out ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
				})
			]
		})
	});
}
function Feature({ icon, title, desc }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10 shadow-lg",
				children: icon
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-black text-white uppercase text-[10px] tracking-[0.3em] italic",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-blue-100/40 text-xs leading-relaxed font-medium",
				children: desc
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
const MemoryMeter = ({ percentage, label }) => {
	const isOOM = percentage >= 100;
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full space-y-1",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex justify-between text-[10px] font-black uppercase tracking-widest",
			children: [/* @__PURE__ */ jsx("span", {
				className: isOOM ? "text-[#ff00e5]" : "text-blue-300/60",
				children: label
			}), /* @__PURE__ */ jsxs("span", {
				className: cn(isOOM ? "text-[#ff00e5]" : "text-[#00f2ff]"),
				children: [Math.min(100, Math.round(percentage)), "%"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "h-2 w-full overflow-hidden rounded-full border border-white/10 bg-[#0a0a2e]",
			children: /* @__PURE__ */ jsx(motion.div, {
				className: cn("h-full transition-colors duration-500", isOOM ? "bg-[#ff00e5] shadow-[0_0_15px_#ff00e5]" : "bg-gradient-to-r from-[#00f2ff] to-[#ff00e5]"),
				initial: { width: 0 },
				animate: { width: `${Math.min(100, percentage)}%` }
			})
		})]
	});
};
const Navbar = ({ mode, setMode, sequenceLength, setSequenceLength, numDevices, setNumDevices, step, setStep, isPlaying, setIsPlaying, reset, maxSteps }) => {
	const m = METAPHORS[mode];
	const location = useLocation();
	return /* @__PURE__ */ jsx("nav", {
		className: "sticky top-0 z-50 border-b border-white/10 bg-[#0a0a2e]/80 py-3 backdrop-blur-xl md:h-16 md:py-0",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:h-full md:flex-row md:gap-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex w-full items-center justify-between md:w-auto md:justify-start md:gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/",
							className: "group flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] p-[1px] shadow-[0_0_15px_rgba(0,242,255,0.3)]",
								children: /* @__PURE__ */ jsx("div", {
									className: "flex h-full w-full items-center justify-center rounded-full bg-[#0a0a2e] text-[10px] font-black text-white",
									children: "TT"
								})
							}), /* @__PURE__ */ jsx("h1", {
								className: "hidden text-[10px] font-black uppercase tracking-tighter text-white sm:block italic",
								children: "Back to base"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 border-l border-white/10 pl-3 ml-1",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/self-attention",
								className: cn("px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all italic", location.pathname === "/self-attention" ? "text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]" : "text-blue-300/40 hover:text-blue-100"),
								children: "Self"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/ring-attention",
								className: cn("px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all italic", location.pathname === "/ring-attention" ? "text-[#ff00e5] shadow-[0_0_10px_rgba(255,0,229,0.2)]" : "text-blue-300/40 hover:text-blue-100"),
								children: "Ring"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5 md:hidden",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setMode("story"),
							className: cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all italic", mode === "story" ? "bg-[#00f2ff] text-[#0a0a2e]" : "text-blue-300/60"),
							children: "Story Mode"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setMode("tech"),
							className: cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all italic", mode === "tech" ? "bg-[#ff00e5] text-white" : "text-blue-300/60"),
							children: "Tech Mode"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-3 md:flex-nowrap md:gap-8 lg:gap-12",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex min-w-[120px] flex-col gap-0.5 sm:min-w-[140px]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-end justify-between px-1",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/40",
									children: [m.data, "s"]
								}), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[10px] font-black text-[#00f2ff]",
									children: sequenceLength.toLocaleString()
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: "512",
								max: "16384",
								step: "512",
								value: sequenceLength,
								onChange: (e) => {
									setSequenceLength(parseInt(e.target.value));
									reset();
								},
								className: "h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#00f2ff]"
							})]
						}),
						numDevices !== void 0 && setNumDevices && /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-0.5 shrink-0",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/40 text-center",
								children: "Nodes"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex rounded-full border border-white/10 bg-white/5 p-0.5",
								children: [
									2,
									4,
									8
								].map((n) => /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setNumDevices(n);
										reset();
									},
									className: cn("px-2.5 py-0.5 rounded-full text-[9px] font-black transition-all italic", numDevices === n ? "bg-white/20 text-[#00f2ff]" : "text-blue-300/40 hover:text-blue-100"),
									children: n
								}, n))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 shrink-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex rounded-full border border-white/10 bg-white/5 p-0.5",
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: reset,
										className: "rounded-full p-1.5 text-blue-300/40 transition-colors hover:bg-white/10 hover:text-white",
										children: /* @__PURE__ */ jsx(RotateCcw, { size: 14 })
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => setIsPlaying(!isPlaying),
										className: cn("mx-0.5 flex h-7 w-8 items-center justify-center rounded-full font-black shadow-lg transition-all active:scale-95", isPlaying ? "bg-[#ff00e5]/20 text-[#ff00e5]" : "bg-[#00f2ff] text-[#0a0a2e]"),
										children: isPlaying ? /* @__PURE__ */ jsx(Pause, {
											size: 14,
											fill: "currentColor"
										}) : /* @__PURE__ */ jsx(Play, {
											size: 14,
											fill: "currentColor"
										})
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => setStep((s) => (s + 1) % maxSteps),
										className: "rounded-full p-1.5 text-blue-300/40 transition-colors hover:bg-white/10 hover:text-white",
										children: /* @__PURE__ */ jsx(ChevronRight, { size: 14 })
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Radio, {
									size: 10,
									className: "text-[#ff00e5] animate-pulse"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-baseline gap-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-[8px] font-black uppercase tracking-widest text-blue-300/40",
										children: "Step"
									}), /* @__PURE__ */ jsxs("div", {
										className: "font-mono text-lg font-black leading-none tracking-tighter text-white italic",
										children: [
											step + 1,
											/* @__PURE__ */ jsx("span", {
												className: "text-blue-300/40",
												children: "/"
											}),
											maxSteps
										]
									})]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5 md:flex",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setMode("story"),
						className: cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase transition-all italic", mode === "story" ? "bg-[#00f2ff] text-[#0a0a2e]" : "text-blue-300/60"),
						children: "Story Mode"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setMode("tech"),
						className: cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase transition-all italic", mode === "tech" ? "bg-[#ff00e5] text-white shadow-[0_0_10px_rgba(255,0,229,0.3)]" : "text-blue-300/60"),
						children: "Tech Mode"
					})]
				})
			]
		})
	});
};
const Scorecard = ({ currentScore, max, sum, mode }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-[#0a0a2e]/50 p-4 rounded-3xl border-2 border-white/5 backdrop-blur-md shadow-inner",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between mb-4 border-b border-white/5 pb-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Calculator, {
					size: 14,
					className: "text-[#ff00e5]"
				}), /* @__PURE__ */ jsx("h5", {
					className: "text-[9px] font-black text-blue-300/60 uppercase tracking-[0.3em] italic",
					children: "Scorecard"
				})]
			}), /* @__PURE__ */ jsx(Radio, {
				size: 10,
				className: "text-[#00f2ff] animate-pulse"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-2 font-mono",
			children: [
				{
					id: "score",
					label: "SIMILARITY",
					value: `${(currentScore * 100).toFixed(1)}%`,
					color: "text-[#ff00e5]"
				},
				{
					id: "max",
					label: "GLOBAL_MAX",
					value: max.toFixed(4),
					color: "text-white"
				},
				{
					id: "sum",
					label: "ACCUM_SUM",
					value: sum.toFixed(4),
					color: "text-white"
				}
			].map((item) => /* @__PURE__ */ jsxs(Popover.Root, { children: [/* @__PURE__ */ jsx(Popover.Trigger, {
				asChild: true,
				children: /* @__PURE__ */ jsxs("button", {
					className: "w-full flex justify-between items-center text-[10px] p-2 hover:bg-white/5 rounded-xl transition-all text-left group border border-transparent hover:border-white/10",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-blue-300/40 border-b border-white/5 border-dotted group-hover:text-blue-100 transition-colors tracking-tighter",
						children: item.label
					}), /* @__PURE__ */ jsx("span", {
						className: cn("font-black italic tracking-tighter", item.color),
						children: item.value
					})]
				})
			}), /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, {
				sideOffset: 10,
				collisionPadding: 10,
				className: "z-50 w-[calc(100vw-40px)] max-w-72 bg-white border-2 border-white/20 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300 text-gray-900",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[10px] font-black uppercase text-[#00f2ff] tracking-[0.2em] italic",
						children: DEFINITIONS[item.id].title
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs font-medium leading-relaxed italic text-gray-600",
						children: mode === "story" ? DEFINITIONS[item.id].story : DEFINITIONS[item.id].tech
					})]
				}), /* @__PURE__ */ jsx(Popover.Arrow, { className: "fill-white" })]
			}) })] }, item.id))
		})]
	});
};
const ScenarioCard = ({ mode, storyText, techText }) => {
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			scale: .95
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		className: "relative overflow-hidden rounded-[2.5rem] border-2 border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,242,255,0.05)]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity",
				children: /* @__PURE__ */ jsx(BookOpen, { size: 120 })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute top-4 right-4 text-[#00f2ff]/20",
				children: /* @__PURE__ */ jsx(Sparkles, { size: 16 })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 flex flex-col sm:flex-row gap-6 items-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-[#00f2ff]/20 to-[#ff00e5]/20 flex items-center justify-center text-[#00f2ff] border border-white/10 shadow-lg",
					children: mode === "story" ? /* @__PURE__ */ jsx(BookMarked, { size: 28 }) : /* @__PURE__ */ jsx(Zap, { size: 28 })
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-center sm:text-left",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.3em] mb-1 italic",
						children: "The Scenario"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-blue-100/70 leading-relaxed italic text-sm font-medium",
						children: mode === "story" ? storyText : techText
					})]
				})]
			})
		]
	});
};
function RingAttention() {
	const [mode, setMode] = useState("story");
	const [sequenceLength, setSequenceLength] = useState(2048);
	const [numDevices, setNumDevices] = useState(4);
	const [step, setStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedNode, setSelectedNode] = useState(0);
	const [isOverlapped, setIsOverlapped] = useState(true);
	const [networkLatency, setNetworkLatency] = useState(30);
	const [, setIsComputing] = useState(true);
	const [isTransferring, setIsTransferring] = useState(false);
	const m = METAPHORS[mode];
	const dataSet = mode === "story" ? STORY_DATA : TECH_DATA;
	const currentScores = useMemo(() => {
		return Array.from({ length: numDevices }, (_, i) => dataSet[i % dataSet.length].score);
	}, [numDevices, dataSet]);
	const currentBlockId = (selectedNode - step + numDevices) % numDevices;
	const currentBlockData = dataSet[currentBlockId % dataSet.length];
	const currentScore = currentBlockData.score;
	const mathState = useMemo(() => {
		let max = currentScores[selectedNode % currentScores.length];
		let sum = currentScores[selectedNode % currentScores.length];
		for (let s = 1; s <= step; s++) {
			const score = dataSet[(selectedNode - s + numDevices) % numDevices % dataSet.length].score;
			const newMax = Math.max(max, score);
			sum = newMax > max ? sum * Math.exp(max - newMax) + score : sum + score;
			max = newMax;
		}
		return {
			max,
			sum
		};
	}, [
		step,
		selectedNode,
		currentScores,
		numDevices,
		dataSet
	]);
	useEffect(() => {
		let interval;
		if (isPlaying) interval = setInterval(() => {
			if (!isOverlapped) {
				setIsComputing(true);
				setIsTransferring(false);
				setTimeout(() => {
					setIsComputing(false);
					setIsTransferring(true);
					setTimeout(() => {
						setStep((s) => (s + 1) % numDevices);
					}, networkLatency * 20);
				}, 1500);
			} else {
				setIsComputing(true);
				setIsTransferring(true);
				setTimeout(() => {
					setStep((s) => (s + 1) % numDevices);
				}, 2500);
			}
		}, isOverlapped ? 2500 : 1500 + networkLatency * 20 + 500);
		return () => clearInterval(interval);
	}, [
		isPlaying,
		numDevices,
		isOverlapped,
		networkLatency
	]);
	const reset = () => {
		setStep(0);
		setIsPlaying(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0a0a2e] text-white font-sans selection:bg-[#00f2ff]/30",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none -z-10",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f2ff]/5 blur-[120px] rounded-full" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff00e5]/5 blur-[120px] rounded-full" })]
			}),
			/* @__PURE__ */ jsx(Navbar, {
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
				maxSteps: numDevices
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-6 py-12 pb-20",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-12 grid grid-cols-1 gap-8 rounded-[2.5rem] border-2 border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#ff00e5]/20 text-[#ff00e5] border border-[#ff00e5]/20 shadow-[0_0_15px_rgba(255,0,229,0.2)]",
										children: /* @__PURE__ */ jsx(Radio, {
											size: 16,
											className: "animate-pulse"
										})
									}), /* @__PURE__ */ jsx("h3", {
										className: "text-[10px] font-black uppercase tracking-[0.3em] text-white italic",
										children: "Network Configuration"
									})]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setIsOverlapped(!isOverlapped),
									className: cn("border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic", isOverlapped ? "border-[#00f2ff]/50 bg-[#00f2ff]/10 text-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "border-white/10 bg-white/5 text-blue-300/40"),
									children: isOverlapped ? "✓ Overlap Enabled" : "Sequential Pass"
								})]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] font-medium leading-relaxed text-blue-100/50 italic",
								children: isOverlapped ? "Pipelined Execution: Nodes receive next data blocks while processing current ones." : "Serial Link: Hardware waits for full data synchronization before starting computation."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-baseline justify-between px-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-[9px] font-black uppercase tracking-[0.2em] text-blue-300/40",
										children: "Network Latency"
									}), /* @__PURE__ */ jsxs("span", {
										className: cn("font-mono text-sm font-black italic", networkLatency > 60 ? "text-[#ff00e5]" : "text-[#00f2ff]"),
										children: [networkLatency, "ms"]
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "range",
									min: "0",
									max: "100",
									step: "5",
									value: networkLatency,
									onChange: (e) => setNetworkLatency(parseInt(e.target.value)),
									className: "h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#00f2ff]"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-blue-300/20",
									children: [/* @__PURE__ */ jsx("span", { children: "Low Latency" }), /* @__PURE__ */ jsx("span", { children: "High Latency" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-7 space-y-8",
							children: [/* @__PURE__ */ jsxs(motion.div, {
								initial: {
									x: -20,
									opacity: 0
								},
								animate: {
									x: 0,
									opacity: 1
								},
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-5xl font-black italic tracking-tighter text-white mb-4",
									children: mode === "story" ? "The Collaborative Circle" : "Ring Attention"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-blue-100/60 text-lg max-w-2xl leading-relaxed font-medium italic",
									children: mode === "story" ? "A distributed system where students share notes efficiently without losing any context." : "A linear complexity attention mechanism distributed across a compute cluster."
								})]
							}), /* @__PURE__ */ jsx(ScenarioCard, {
								mode,
								storyText: "Imagine a book titled 'Midnight at Manor House,' a complex 10,000-page murder mystery. A group of students is tasked with understanding exactly what happened, without skipping a single detail.",
								techText: "To compute full attention without crashing a single GPU's memory, we distribute the sequence across a cluster. Each node passes its data in a ring, ensuring bit-perfect global context."
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-5 flex flex-col items-center",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative aspect-square w-full max-w-[320px] flex items-center justify-center bg-white/5 rounded-full border-4 border-white/5 shadow-[0_0_50px_rgba(0,242,255,0.05)]",
								children: [
									/* @__PURE__ */ jsx(motion.div, {
										animate: { rotate: 360 },
										transition: {
											duration: 20,
											repeat: Infinity,
											ease: "linear"
										},
										className: "absolute inset-4 border-2 border-dashed border-[#00f2ff]/20 rounded-full"
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-12 border border-[#ff00e5]/10 rounded-full" }),
									Array.from({ length: numDevices }).map((_, i) => {
										const angle = i * 360 / numDevices - 90;
										const radius = 110;
										const x = Math.cos(angle * Math.PI / 180) * radius;
										const y = Math.sin(angle * Math.PI / 180) * radius;
										const isNodeTransferring = isPlaying && isTransferring;
										return /* @__PURE__ */ jsx(motion.div, {
											className: "absolute left-1/2 top-1/2",
											initial: false,
											animate: {
												x,
												y
											},
											onClick: () => setSelectedNode(i),
											children: /* @__PURE__ */ jsxs("div", {
												className: cn("group relative flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 transition-all -translate-x-1/2 -translate-y-1/2 overflow-hidden backdrop-blur-xl", selectedNode === i ? "bg-white/20 border-[#00f2ff] shadow-[0_0_30px_rgba(0,242,255,0.4)] scale-125" : "bg-[#0a0a2e] border-white/10 hover:border-white/30", isNodeTransferring && !isOverlapped && "border-[#ff00e5] shadow-[0_0_20px_#ff00e5]"),
												children: [mode === "story" ? /* @__PURE__ */ jsx(GraduationCap, { size: 20 }) : /* @__PURE__ */ jsx(Cpu, { size: 20 }), isPlaying && /* @__PURE__ */ jsx("div", {
													className: "absolute inset-0 flex items-end justify-center pb-1",
													children: /* @__PURE__ */ jsx("div", { className: cn("w-full h-1", isNodeTransferring && !isOverlapped ? "bg-[#ff00e5]" : "bg-[#00f2ff]") })
												})]
											})
										}, i);
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
										children: /* @__PURE__ */ jsxs("div", {
											className: "font-mono text-xs font-black text-white italic tracking-widest",
											children: ["Student ", selectedNode + 1]
										})
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "w-full space-y-8",
						children: /* @__PURE__ */ jsxs("div", {
							className: cn("bg-white/5 rounded-[3rem] border-2 p-8 relative overflow-hidden transition-all duration-700 backdrop-blur-xl shadow-2xl", isPlaying && isTransferring && !isOverlapped ? "border-[#ff00e5]/30 shadow-[0_0_50px_rgba(255,0,229,0.1)]" : "border-white/10"),
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-white/5",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/20 shadow-lg",
											children: mode === "story" ? /* @__PURE__ */ jsx(GraduationCap, { size: 28 }) : /* @__PURE__ */ jsx(Cpu, { size: 28 })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
											className: "text-2xl font-black text-white italic tracking-tight",
											children: [
												m.unit,
												" ",
												selectedNode + 1,
												" Status"
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 mt-1",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10",
												children: [/* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#00f2ff]" }), /* @__PURE__ */ jsxs("span", {
													className: "text-[10px] font-black text-blue-300/60 uppercase tracking-widest",
													children: ["Phase ", step + 1]
												})]
											}), isPlaying && /* @__PURE__ */ jsx("span", {
												className: cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full italic tracking-widest", isTransferring && !isOverlapped ? "bg-[#ff00e5]/20 text-[#ff00e5] shadow-[0_0_10px_rgba(255,0,229,0.2)]" : "bg-[#00f2ff]/20 text-[#00f2ff]"),
												children: isTransferring && !isOverlapped ? "I/O Wait" : "Processing"
											})]
										})] })]
									}), /* @__PURE__ */ jsxs("div", {
										className: "px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[9px] font-black text-blue-300/40 uppercase tracking-[0.3em] mb-1",
											children: "Computation"
										}), /* @__PURE__ */ jsxs("div", {
											className: "text-sm font-black text-white italic tracking-tight",
											children: [
												m.mathTerm,
												": ",
												/* @__PURE__ */ jsx("span", {
													className: "text-[#00f2ff]",
													children: "OPTIMAL"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[350px] items-stretch",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex-1 flex flex-col p-6 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3 mb-1",
													children: [/* @__PURE__ */ jsx(Search, {
														size: 18,
														className: "text-[#00f2ff]"
													}), /* @__PURE__ */ jsxs("h4", {
														className: "text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic",
														children: ["1. ", mode === "tech" ? "Query (Q)" : "The Inquiry"]
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "p-4 bg-[#0a0a2e] border-2 border-white/5 rounded-2xl shadow-inner relative overflow-hidden",
													children: [
														/* @__PURE__ */ jsx("div", {
															className: "absolute top-0 right-0 p-2 opacity-10",
															children: /* @__PURE__ */ jsx(Zap, {
																size: 40,
																className: "text-[#00f2ff]"
															})
														}),
														/* @__PURE__ */ jsx("div", {
															className: "text-[10px] font-black uppercase text-[#00f2ff]/40 mb-2 italic tracking-widest",
															children: "Search Intent"
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "text-sm font-bold italic text-white leading-relaxed",
															children: [
																"\"",
																m.query,
																"\""
															]
														})
													]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "flex-1 flex flex-col items-center justify-center",
													children: /* @__PURE__ */ jsxs("div", {
														className: "relative scale-90",
														children: [/* @__PURE__ */ jsx("div", {
															className: "relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 shadow-[0_0_30px_rgba(0,242,255,0.1)] backdrop-blur-md",
															children: /* @__PURE__ */ jsx(Flashlight, {
																size: 48,
																className: "text-[#00f2ff]"
															})
														}), /* @__PURE__ */ jsx(motion.div, {
															className: "pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-32 origin-top bg-gradient-to-b from-[#00f2ff]/20 to-transparent blur-2xl",
															animate: isPlaying ? {
																rotate: [
																	0,
																	15,
																	-15,
																	0
																],
																opacity: [
																	.3,
																	.6,
																	.3
																]
															} : { opacity: 0 },
															transition: {
																repeat: Infinity,
																duration: 3
															},
															style: { translateX: "-50%" }
														})]
													})
												}),
												/* @__PURE__ */ jsx(Scorecard, {
													currentScore,
													max: mathState.max,
													sum: mathState.sum,
													mode
												})
											]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "flex items-center justify-center opacity-10",
											children: /* @__PURE__ */ jsx(ChevronRight, {
												size: 48,
												className: "rotate-90 text-[#00f2ff] md:rotate-0 animate-pulse"
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex w-full flex-col items-center justify-center shrink-0 space-y-6 rounded-[2.5rem] border border-white/5 bg-white/5 p-6 md:w-64",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "mb-auto w-full text-center",
													children: [/* @__PURE__ */ jsxs("h4", {
														className: "mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic",
														children: ["2. ", mode === "tech" ? "KV Cache" : "The Data"]
													}), /* @__PURE__ */ jsx(AnimatePresence, {
														mode: "wait",
														children: /* @__PURE__ */ jsxs(motion.div, {
															initial: {
																y: -30,
																opacity: 0,
																scale: .9
															},
															animate: {
																y: 0,
																opacity: 1,
																scale: 1
															},
															exit: {
																y: 30,
																opacity: 0,
																scale: .9
															},
															className: "relative mx-auto flex min-h-[140px] w-full flex-col overflow-hidden rounded-[2rem] border-2 border-white/10 bg-[#0a0a2e] shadow-2xl",
															children: [
																/* @__PURE__ */ jsxs("div", {
																	className: "flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2",
																	children: [/* @__PURE__ */ jsx("span", {
																		className: "text-[10px] font-black uppercase tracking-widest text-[#ff00e5]",
																		children: mode === "tech" ? "Key (K)" : "Note Tag"
																	}), /* @__PURE__ */ jsxs("div", {
																		className: "rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00f2ff]",
																		children: ["ID_", currentBlockId + 1]
																	})]
																}),
																/* @__PURE__ */ jsxs("div", {
																	className: "flex flex-1 flex-col p-4",
																	children: [/* @__PURE__ */ jsx("span", {
																		className: "mb-2 text-[9px] font-black uppercase tracking-widest text-blue-300/30 italic",
																		children: mode === "tech" ? "Value (V)" : "Original Text"
																	}), /* @__PURE__ */ jsxs("div", {
																		className: "line-clamp-4 text-xs font-medium leading-relaxed text-blue-50 italic",
																		children: [
																			"\"",
																			currentBlockData.text,
																			"\""
																		]
																	})]
																}),
																/* @__PURE__ */ jsx("div", {
																	className: "border-t border-white/5 bg-white/5 px-4 py-2",
																	children: /* @__PURE__ */ jsx("p", {
																		className: "text-[9px] leading-tight text-blue-300/40 italic",
																		children: mode === "tech" ? "Output += Softmax(Q @ K) @ V" : "Extracting % of Text via Q Match."
																	})
																}),
																isPlaying && currentScore > .7 && /* @__PURE__ */ jsx(motion.div, {
																	className: "absolute inset-0 border-4 border-[#00f2ff]/30 rounded-[2rem]",
																	initial: {
																		scale: 1,
																		opacity: 0
																	},
																	animate: {
																		scale: 1.1,
																		opacity: [
																			0,
																			.5,
																			0
																		]
																	},
																	transition: {
																		duration: 1.5,
																		repeat: Infinity
																	}
																})
															]
														}, step)
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "relative flex h-16 w-1 flex-col items-center",
													children: isPlaying && Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(motion.div, {
														className: "absolute h-2 w-2 rounded-full bg-[#00f2ff] blur-[2px]",
														animate: {
															y: [0, 64],
															opacity: [
																0,
																1,
																0
															]
														},
														transition: {
															repeat: Infinity,
															duration: 1.5,
															delay: i * .4
														}
													}, i))
												}),
												/* @__PURE__ */ jsx("div", {
													className: "px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#ff00e5] italic",
													children: "Data Stream"
												})
											]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "flex items-center justify-center opacity-10",
											children: /* @__PURE__ */ jsx(ChevronRight, {
												size: 48,
												className: "rotate-90 text-[#00f2ff] md:rotate-0 animate-pulse"
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex-1 flex flex-col p-6 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3 mb-1",
													children: [/* @__PURE__ */ jsx(BookMarked, {
														size: 18,
														className: "text-[#ff00e5]"
													}), /* @__PURE__ */ jsxs("h4", {
														className: "text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic",
														children: [
															"3.",
															" ",
															mode === "tech" ? "Attention Output (Z)" : "The Summary"
														]
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "relative w-full flex-1 bg-white rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] border-4 border-[#0a0a2e] overflow-hidden min-h-[220px]",
													children: /* @__PURE__ */ jsxs("div", {
														className: "p-6 h-full flex flex-col",
														children: [/* @__PURE__ */ jsx(Notebook, {
															size: 24,
															className: "text-blue-200/20 mb-6"
														}), /* @__PURE__ */ jsx("div", {
															className: "space-y-1.5 flex-1 flex flex-col-reverse overflow-hidden",
															children: Array.from({ length: numDevices }).map((_, i) => {
																const isFilled = (numDevices + selectedNode - i) % numDevices <= step;
																const blockData = dataSet[i % dataSet.length];
																const blockWeight = blockData.score;
																return /* @__PURE__ */ jsxs(Popover.Root, { children: [/* @__PURE__ */ jsx(Popover.Trigger, {
																	asChild: true,
																	children: /* @__PURE__ */ jsx(motion.button, {
																		initial: { height: 0 },
																		animate: { height: isFilled ? `${blockWeight * 40}px` : 0 },
																		className: cn("w-full rounded-md mb-1 transition-all duration-700 relative flex items-center justify-center overflow-hidden shrink-0", !isFilled ? "opacity-0 pointer-events-none" : "", i === currentBlockId ? "bg-[#ff00e5] shadow-[0_0_15px_#ff00e5]" : "bg-[#00f2ff]/60 hover:bg-[#00f2ff]"),
																		children: isFilled && blockWeight > .4 && /* @__PURE__ */ jsxs("span", {
																			className: "text-[8px] font-black text-white/60 italic tracking-widest",
																			children: ["DATA_", i + 1]
																		})
																	})
																}), /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, {
																	side: "top",
																	sideOffset: 15,
																	collisionPadding: 10,
																	className: "z-50 w-72 bg-white border-2 border-white/20 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300 text-gray-900",
																	children: [/* @__PURE__ */ jsxs("div", {
																		className: "space-y-3 text-left",
																		children: [
																			/* @__PURE__ */ jsxs("div", {
																				className: "flex justify-between items-center border-b border-gray-100 pb-2",
																				children: [/* @__PURE__ */ jsxs("span", {
																					className: "text-[10px] font-black text-[#ff00e5] uppercase tracking-widest italic",
																					children: ["Data Block ", i + 1]
																				}), /* @__PURE__ */ jsxs("span", {
																					className: "text-[10px] font-black text-gray-400 font-mono",
																					children: ["VAL_", (blockWeight * 100).toFixed(0)]
																				})]
																			}),
																			/* @__PURE__ */ jsxs("div", {
																				className: "p-3 bg-gray-50 rounded-2xl italic text-xs leading-relaxed font-medium",
																				children: [
																					"\"",
																					blockData.text,
																					"\""
																				]
																			}),
																			/* @__PURE__ */ jsx("p", {
																				className: "text-[9px] text-gray-400 font-bold leading-tight uppercase tracking-widest",
																				children: "Bit-Perfect Storage Verified"
																			})
																		]
																	}), /* @__PURE__ */ jsx(Popover.Arrow, { className: "fill-white" })]
																}) })] }, i);
															})
														})]
													})
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex justify-between items-center px-2",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-[9px] font-black uppercase text-blue-300/40 tracking-widest italic",
														children: "Integrity Check"
													}), /* @__PURE__ */ jsx("div", {
														className: "flex gap-1.5",
														children: [
															1,
															2,
															3,
															4,
															5
														].map((j) => /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_8px_#00f2ff]" }, j))
													})]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-5 backdrop-blur-md",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-3 bg-[#00f2ff]/10 rounded-full text-[#00f2ff] shadow-lg border border-[#00f2ff]/20",
										children: /* @__PURE__ */ jsx(Zap, {
											size: 24,
											className: "animate-pulse"
										})
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-blue-100/50 leading-relaxed font-medium italic",
										children: [
											/* @__PURE__ */ jsx("strong", {
												className: "text-white not-italic",
												children: "Context Synchronization:"
											}),
											" ",
											"The system compares local search intents to remote memory packets. With bit-perfect synchronization, physical distribution is irrelevant. Zero loss, total clarity."
										]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xl font-black text-white italic tracking-tight",
								children: "Analog Methods (Lossy)"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-blue-100/40 leading-relaxed font-medium italic",
								children: "Summarization is a shadow of the truth. Throwing data away leads to a foggy past. By step 100, the context is forgotten."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-3 text-right",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xl font-black text-[#00f2ff] italic tracking-tight text-white",
								children: "Ring Topology (Lossless)"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-blue-100/40 leading-relaxed font-medium italic",
								children: "By rotating raw source material, we maintain 100% mathematical truth. Every connection is preserved, forever."
							})]
						})]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "mt-32 w-full max-w-4xl mx-auto border-t border-white/10 pt-20",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row-reverse items-center gap-12 text-center md:text-right",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1 space-y-6",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-3 py-1 bg-[#00f2ff]/10 rounded-full border border-[#00f2ff]/20 text-[10px] font-black text-[#00f2ff] uppercase tracking-widest italic",
										children: [/* @__PURE__ */ jsx(History, {
											size: 10,
											className: "animate-pulse"
										}), "The Core Foundation"]
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-4xl font-black italic tracking-tighter text-white",
										children: "How did we get here?"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-blue-100/60 text-lg leading-relaxed font-medium italic",
										children: [
											"Ring Attention is a massive orchestration of a much simpler breakthrough. Check out the original mechanism behind",
											/* @__PURE__ */ jsx("span", {
												className: "text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4 mx-1",
												children: "Self Attention"
											}),
											"and the quadratic scaling limits that made the \"Ring\" approach necessary."
										]
									}),
									/* @__PURE__ */ jsxs(Link, {
										to: "/self-attention",
										className: "group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-[#ff00e5]/10 border-2 border-white/10 hover:border-[#ff00e5]/50 rounded-full transition-all mt-4",
										children: [/* @__PURE__ */ jsx(ArrowLeft, {
											size: 18,
											className: "text-[#ff00e5] group-hover:-translate-x-1 transition-transform"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-black uppercase tracking-widest text-[#ff00e5]",
											children: "Back to Self Attention"
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "w-48 h-48 md:w-64 md:h-48 relative shrink-0 flex items-center justify-center",
								children: [
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#ff00e5]/10 blur-3xl rounded-full animate-pulse" }),
									/* @__PURE__ */ jsx("div", {
										className: "relative w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white/10 overflow-hidden grid grid-cols-4 grid-rows-4 opacity-40",
										children: Array.from({ length: 16 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "border-[0.5px] border-white/5 bg-white/5" }, i))
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 flex items-center justify-center",
										children: /* @__PURE__ */ jsx("div", {
											className: "w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#ff00e5] to-[#00f2ff] p-[2px] shadow-[0_0_30px_rgba(255,0,229,0.3)]",
											children: /* @__PURE__ */ jsx("div", {
												className: "w-full h-full rounded-full bg-[#0a0a2e] flex items-center justify-center",
												children: /* @__PURE__ */ jsx(LayoutGrid, {
													size: 24,
													className: "text-white"
												})
											})
										})
									})
								]
							})]
						})
					})
				]
			})
		]
	});
}
const SELF_ATTENTION_SCENARIO = {
	sentence: [
		"The",
		"butler",
		"left",
		"the",
		"kitchen",
		"with",
		"a",
		"tray"
	],
	intents: [
		{
			label: "Subject Focus",
			description: "Focusing on the actor. See how 'The' and 'butler' are strongly paired.",
			focusTokenIndex: 1,
			weights: [
				[
					.8,
					.2,
					0,
					0,
					0,
					0,
					0,
					0
				],
				[
					.2,
					.8,
					0,
					0,
					0,
					0,
					0,
					0
				],
				[
					.1,
					.4,
					.5,
					0,
					0,
					0,
					0,
					0
				],
				[
					0,
					.1,
					0,
					.9,
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					0,
					1,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					1,
					0,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					0,
					1,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1
				]
			]
		},
		{
			label: "Action Focus",
			description: "Connecting the verb to its context. 'left' is linked to 'butler' and 'kitchen'.",
			focusTokenIndex: 2,
			weights: [
				[
					1,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				],
				[
					0,
					.7,
					.3,
					0,
					0,
					0,
					0,
					0
				],
				[
					0,
					.3,
					.4,
					0,
					.3,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					.3,
					0,
					.7,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					1,
					0,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					0,
					1,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1
				]
			]
		},
		{
			label: "Object Focus",
			description: "Identifying what is being carried. 'tray' and 'butler' are the key connection.",
			focusTokenIndex: 7,
			weights: [
				[
					1,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				],
				[
					0,
					.6,
					0,
					0,
					0,
					0,
					0,
					.4
				],
				[
					0,
					0,
					1,
					0,
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					1,
					0,
					0,
					0,
					0
				],
				[
					0,
					0,
					0,
					0,
					0,
					.8,
					0,
					.2
				],
				[
					0,
					0,
					0,
					0,
					0,
					0,
					.9,
					.1
				],
				[
					0,
					.4,
					0,
					0,
					0,
					.1,
					.1,
					.4
				]
			]
		}
	]
};
function SelfAttention() {
	const [mode, setMode] = useState("story");
	const [sequenceLength, setSequenceLength] = useState(2048);
	const [step, setStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedIntentIndex, setSelectedIntentIndex] = useState(0);
	const m = METAPHORS[mode];
	const dataSet = mode === "story" ? STORY_DATA : TECH_DATA;
	const selfMemory = (sequenceLength / 4096) ** 2 * 80;
	const isOOM = selfMemory >= 100;
	const activeIntent = useMemo(() => SELF_ATTENTION_SCENARIO.intents[selectedIntentIndex], [selectedIntentIndex]);
	useEffect(() => {
		let interval;
		if (isPlaying && !isOOM) interval = setInterval(() => {
			setStep((s) => (s + 1) % 64);
		}, 500);
		return () => clearInterval(interval);
	}, [isPlaying, isOOM]);
	const reset = () => {
		setStep(0);
		setIsPlaying(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0a0a2e] text-white font-sans selection:bg-[#00f2ff]/30",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none -z-10",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f2ff]/5 blur-[120px] rounded-full" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff00e5]/5 blur-[120px] rounded-full" })]
			}),
			/* @__PURE__ */ jsx(Navbar, {
				mode,
				setMode,
				sequenceLength,
				setSequenceLength,
				step,
				setStep,
				isPlaying,
				setIsPlaying,
				reset,
				maxSteps: 64
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-6 py-12 pb-20",
				children: [
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .8 },
						className: "mb-16 text-center",
						children: [/* @__PURE__ */ jsxs("h1", {
							className: "text-4xl md:text-6xl font-black italic tracking-tighter text-white max-w-3xl mx-auto leading-tight mb-6",
							children: [
								"Have you ever wondered why LLMs have",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-[#00f2ff]",
									children: "context windows?"
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-blue-100/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic",
							children: "Large Language Models are essentially massive neural networks supercharged by an Attention Mechanism."
						})]
					}),
					!isOOM && /* @__PURE__ */ jsxs("section", {
						className: "mb-12",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-8",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#ff00e5]/20 text-[#ff00e5] border border-[#ff00e5]/20 shadow-[0_0_15px_rgba(255,0,229,0.2)]",
								children: /* @__PURE__ */ jsx(History, { size: 20 })
							}), /* @__PURE__ */ jsx("h3", {
								className: "text-xs font-black uppercase tracking-[0.4em] text-white italic",
								children: "The Problem: Sequential Bottlenecks"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "bg-white/5 rounded-[3rem] border-2 border-white/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#ff00e5]/5 to-transparent pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col lg:flex-row gap-12 items-center relative z-10",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex-1 space-y-6",
									children: [/* @__PURE__ */ jsxs("p", {
										className: "text-blue-100/70 text-lg leading-relaxed font-medium italic",
										children: [
											"Before Attention, neural networks (like RNNs) processed data",
											/* @__PURE__ */ jsx("span", {
												className: "text-white font-black underline decoration-[#00f2ff] decoration-2 underline-offset-4 mx-1",
												children: "one step at a time"
											}),
											". To understand the last word, the model had to pass information through every word before it—like a game of telephone."
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "p-4 bg-[#0a0a2e]/60 rounded-2xl border border-white/5 space-y-2",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 text-[#ff00e5]",
												children: [/* @__PURE__ */ jsx(Clock, { size: 14 }), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-black uppercase tracking-widest",
													children: "Vanishing Memory"
												})]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-blue-100/40 leading-relaxed font-medium",
												children: "By the time the model reached the end of a long paragraph, it often \"forgot\" the context from the beginning."
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-4 bg-[#0a0a2e]/60 rounded-2xl border border-white/5 space-y-2",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 text-[#ff00e5]",
												children: [/* @__PURE__ */ jsx(Zap, {
													size: 14,
													className: "rotate-180"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-black uppercase tracking-widest",
													children: "Slow Training"
												})]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-blue-100/40 leading-relaxed font-medium",
												children: "Because words had to be processed in order, models couldn't use the full parallel power of modern GPUs."
											})]
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "w-full lg:w-auto bg-[#0a0a2e]/40 p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col items-center gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap items-center justify-center gap-2 md:gap-4",
										children: [
											"The",
											"butler",
											"...",
											"tray"
										].map((token, i) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 md:gap-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "px-2 py-1.5 md:px-3 md:py-2 bg-white/5 border border-white/10 rounded-lg text-xs md:text-sm font-black text-blue-300/40 italic",
												children: token
											}), i < 3 && /* @__PURE__ */ jsx(ArrowRight, {
												size: 14,
												className: "text-[#ff00e5]/30 md:size-4"
											})]
										}, i))
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[#ff00e5] animate-pulse text-center",
										children: "Sequential Dependency Link"
									})]
								})]
							})]
						})]
					}),
					!isOOM && /* @__PURE__ */ jsxs("section", {
						className: "mb-16",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-8",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/20 shadow-[0_0_15px_rgba(0,242,255,0.2)]",
								children: /* @__PURE__ */ jsx(Info, { size: 20 })
							}), /* @__PURE__ */ jsx("h3", {
								className: "text-xs font-black uppercase tracking-[0.4em] text-white italic",
								children: "The Breakthrough: Self-Attention"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "bg-white/5 rounded-[3rem] border-2 border-white/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col lg:flex-row gap-12 items-start relative z-10",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex-1 space-y-6",
									children: [
										/* @__PURE__ */ jsxs("p", {
											className: "text-blue-100/70 text-lg leading-relaxed font-medium italic",
											children: [
												"Self-Attention allows every word to look at every other word",
												/* @__PURE__ */ jsx("span", {
													className: "text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4 mx-1",
													children: "instantly"
												}),
												". Unlike older models that read linearly, Attention identifies connections regardless of distance."
											]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-3",
											children: SELF_ATTENTION_SCENARIO.intents.map((intent, idx) => /* @__PURE__ */ jsx("button", {
												onClick: () => setSelectedIntentIndex(idx),
												className: cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border", selectedIntentIndex === idx ? "bg-[#00f2ff] border-[#00f2ff] text-[#0a0a2e] shadow-[0_0_15px_rgba(0,242,255,0.2)]" : "bg-white/5 border-white/10 text-blue-300/60 hover:border-white/30 hover:text-white"),
												children: intent.label
											}, intent.label))
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "p-4 bg-[#0a0a2e]/60 rounded-2xl border border-white/5 italic text-sm text-blue-100/50",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-[#ff00e5] font-black mr-2",
												children: "QUERY:"
											}), activeIntent.description]
										})
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "w-full lg:w-auto bg-[#0a0a2e]/40 p-6 rounded-[2rem] border border-white/10 flex flex-wrap gap-2 justify-center max-w-xl",
									children: SELF_ATTENTION_SCENARIO.sentence.map((token, i) => {
										const currentWeight = activeIntent.weights[activeIntent.focusTokenIndex][i];
										return /* @__PURE__ */ jsx(motion.span, {
											animate: {
												color: currentWeight > .2 ? "#00f2ff" : "#f0f9ff",
												scale: currentWeight > .2 ? 1.1 : 1,
												opacity: currentWeight > .1 ? 1 : .4
											},
											className: cn("text-2xl font-black italic tracking-tight px-1 rounded transition-colors", i === activeIntent.focusTokenIndex && "text-[#ff00e5] underline decoration-[#ff00e5] underline-offset-8"),
											children: token
										}, i);
									})
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-12",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-7 space-y-8",
							children: [/* @__PURE__ */ jsxs(motion.div, {
								initial: {
									x: -20,
									opacity: 0
								},
								animate: {
									x: 0,
									opacity: 1
								},
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-5xl font-black italic tracking-tighter text-white mb-2 leading-tight",
									children: mode === "story" ? "The Overwhelmed Student" : "Self Attention"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-blue-100/60 text-lg max-w-2xl leading-relaxed font-medium italic",
									children: mode === "story" ? "A single student trying to keep track of a mountain of clues all at once." : "The mechanism that allows tokens to weight their relevance to each other dynamically."
								})]
							}), /* @__PURE__ */ jsx(ScenarioCard, {
								mode,
								storyText: "Imagine a student in a room with 10,000 pages spread across the floor. To find a connection, they must physically walk between every possible pair. Eventually, the room runs out of floor space—this is why our 'reading capacity' has been so limited, but solving this is the new frontier of our research.",
								techText: "Self-attention stores an N x N matrix in VRAM. As the sequence length (N) doubles, memory needs quadruple. This quadratic growth is why context limits have historically been low, and why scaling them remains one of the greatest frontiers in model development."
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-5 flex flex-col items-center",
							children: /* @__PURE__ */ jsx("div", {
								className: cn("relative flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-[3rem] border-4 transition-all duration-700 backdrop-blur-xl shadow-2xl", isOOM ? "bg-[#ff00e5]/5 border-[#ff00e5] shadow-[0_0_60px_rgba(255,0,229,0.2)]" : "bg-white/5 border-white/10 shadow-[0_0_50px_rgba(0,242,255,0.05)]"),
								children: isOOM ? /* @__PURE__ */ jsxs(motion.div, {
									initial: { scale: .8 },
									animate: { scale: 1 },
									className: "text-center p-8",
									children: [
										/* @__PURE__ */ jsx(AlertTriangle, {
											size: 64,
											className: "mx-auto mb-4 animate-bounce text-[#ff00e5]"
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-2xl font-black italic tracking-tighter text-white uppercase",
											children: "Memory Overflow"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-2 text-[10px] font-bold uppercase tracking-widest text-[#ff00e5]/60",
											children: "VRAM Capacity Exceeded"
										})
									]
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
									animate: { y: [
										0,
										-10,
										0
									] },
									transition: {
										repeat: Infinity,
										duration: 4,
										ease: "easeInOut"
									},
									className: "mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#00f2ff]/40 bg-[#00f2ff]/10 text-[#00f2ff] shadow-[0_0_30px_rgba(0,242,255,0.2)]",
									children: mode === "story" ? /* @__PURE__ */ jsx(GraduationCap, { size: 48 }) : /* @__PURE__ */ jsx(Cpu, { size: 48 })
								}), /* @__PURE__ */ jsxs("div", {
									className: "w-full px-8 text-center",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-black uppercase tracking-[0.4em] text-blue-300/40 italic",
										children: "Hardware Status"
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-4",
										children: /* @__PURE__ */ jsx(MemoryMeter, {
											percentage: selfMemory,
											label: "Memory Load"
										})
									})]
								})] })
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 items-start gap-12 lg:grid-cols-2",
						children: [!isOOM ? /* @__PURE__ */ jsxs("div", {
							className: "rounded-[3rem] border-2 border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-8 flex items-center justify-between border-b border-white/5 pb-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(LayoutGrid, {
											size: 24,
											className: "text-[#00f2ff]"
										}), /* @__PURE__ */ jsx("h3", {
											className: "text-2xl font-black italic tracking-tight text-white uppercase",
											children: mode === "story" ? "The Comparison Grid" : "Quadratic Matrix"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "font-mono text-[10px] font-black tracking-widest text-blue-300/40",
										children: [
											mode === "story" ? "TOTAL PAIRS" : "DIM",
											": ",
											sequenceLength,
											"²"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-8 px-4 py-4 md:px-5 md:py-4 bg-[#0a0a2e]/60 rounded-[2rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex flex-col items-center sm:items-start text-center sm:text-left",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[8px] font-black uppercase text-blue-300/40 tracking-[0.2em] mb-1.5",
											children: mode === "story" ? "Comparing Clues" : "Computing Dot Product"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 md:gap-3 text-sm font-black italic tracking-tight",
											children: [
												/* @__PURE__ */ jsxs("span", {
													className: "text-[#00f2ff]",
													children: [
														"\"",
														SELF_ATTENTION_SCENARIO.sentence[Math.floor(step % 64 / 8)],
														"\""
													]
												}),
												/* @__PURE__ */ jsx(ArrowRight, {
													size: 12,
													className: "text-white/10 md:size-4"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-[#ff00e5]",
													children: [
														"\"",
														SELF_ATTENTION_SCENARIO.sentence[step % 64 % 8],
														"\""
													]
												})
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-center sm:text-right",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[8px] font-black uppercase text-blue-300/40 tracking-[0.2em] mb-1.5 block",
											children: mode === "story" ? "Link Strength" : "Attention Weight"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-sm font-mono font-black text-white italic",
											children: [(activeIntent.weights[Math.floor(step % 64 / 8)][step % 64 % 8] * 100).toFixed(0), "%"]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mx-auto grid w-full max-w-[440px] grid-cols-8 gap-1.5 aspect-square",
									children: [" ", Array.from({ length: 64 }).map((_, i) => {
										const row = Math.floor(i / 8);
										const col = i % 8;
										const isActive = i === step % 64;
										const weight = activeIntent.weights[row][col];
										const queryToken = SELF_ATTENTION_SCENARIO.sentence[row];
										const keyToken = SELF_ATTENTION_SCENARIO.sentence[col];
										return /* @__PURE__ */ jsxs(Popover.Root, { children: [/* @__PURE__ */ jsx(Popover.Trigger, {
											asChild: true,
											children: /* @__PURE__ */ jsx(motion.button, {
												initial: { opacity: 0 },
												animate: {
													opacity: 1,
													backgroundColor: weight > .5 ? "rgba(0, 242, 255, 0.4)" : "rgba(10, 10, 46, 0.5)",
													borderColor: weight > .5 ? "rgba(0, 242, 255, 1)" : "rgba(255, 255, 255, 0.05)"
												},
												transition: { delay: i * .002 },
												className: cn("flex items-center justify-center rounded-sm border font-mono text-[8px] transition-all duration-300", isActive ? "z-10 scale-110 border-[#ff00e5] bg-[#ff00e5]/40 shadow-[0_0_15px_#ff00e5]" : "hover:border-white/20 hover:bg-white/5"),
												children: isActive ? "⚡" : weight > .4 ? "●" : ""
											})
										}), /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, {
											sideOffset: 5,
											collisionPadding: 10,
											className: "z-50 w-[calc(100vw-40px)] max-w-72 rounded-[2rem] border-2 border-white/20 bg-white p-6 text-gray-900 shadow-2xl animate-in fade-in zoom-in duration-300",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "space-y-4 text-left",
												children: [
													/* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between border-b border-gray-100 pb-3",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "text-[10px] font-black uppercase tracking-widest text-[#00f2ff]",
															children: [
																mode === "story" ? "Pair" : "Cell",
																"_",
																row,
																"_",
																col
															]
														}), /* @__PURE__ */ jsxs("span", {
															className: "font-mono text-[10px] font-black text-gray-400",
															children: [
																mode === "story" ? "Link" : "Match",
																"_",
																(weight * 100).toFixed(0)
															]
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "space-y-4",
														children: [
															/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
																className: "mb-1 flex justify-between text-[8px] font-black uppercase tracking-tighter text-blue-500",
																children: [/* @__PURE__ */ jsx("span", { children: mode === "tech" ? "Query (Q)" : "The Inquiry" }), /* @__PURE__ */ jsxs("span", {
																	className: "opacity-50",
																	children: ["Row ", row]
																})]
															}), /* @__PURE__ */ jsxs("div", {
																className: "rounded-xl bg-blue-50 p-2 text-[10px] font-black italic leading-snug text-blue-900 line-clamp-2",
																children: [
																	"\"",
																	queryToken,
																	"\""
																]
															})] }),
															/* @__PURE__ */ jsx("div", {
																className: "flex justify-center opacity-20",
																children: /* @__PURE__ */ jsx(Zap, {
																	size: 12,
																	className: "text-blue-400"
																})
															}),
															/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
																className: "mb-1 flex justify-between text-[8px] font-black uppercase tracking-tighter text-purple-500",
																children: [/* @__PURE__ */ jsx("span", { children: mode === "tech" ? "Key (K)" : "The Data" }), /* @__PURE__ */ jsxs("span", {
																	className: "opacity-50",
																	children: ["Col ", col]
																})]
															}), /* @__PURE__ */ jsxs("div", {
																className: "rounded-xl bg-purple-50 p-2 font-black italic text-[10px] text-purple-900",
																children: [
																	"\"",
																	keyToken,
																	"\""
																]
															})] })
														]
													}),
													/* @__PURE__ */ jsx("p", {
														className: "border-t border-gray-100 pt-3 text-[9px] font-bold uppercase italic leading-tight text-gray-400 tracking-tight",
														children: "Dynamic weighting recalculated for every pair."
													})
												]
											}), /* @__PURE__ */ jsx(Popover.Arrow, { className: "fill-white" })]
										}) })] }, i);
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-8 rounded-2xl border border-[#ff00e5]/10 bg-[#ff00e5]/5 p-4 text-center",
									children: /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] font-medium italic leading-relaxed text-blue-100/40",
										children: [
											"Self-attention units must compute every connection",
											" ",
											/* @__PURE__ */ jsx("strong", {
												className: "text-white not-italic",
												children: "simultaneously"
											}),
											". As context doubles, the memory required quadruples."
										]
									})
								})
							]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "flex aspect-square flex-col items-center justify-center rounded-[3rem] border-2 border-[#ff00e5]/20 bg-[#ff00e5]/5 p-12 text-center shadow-[inset_0_0_50px_rgba(255,0,229,0.1)] backdrop-blur-xl",
							children: [
								/* @__PURE__ */ jsx(AlertTriangle, {
									size: 64,
									className: "mb-6 text-[#ff00e5] opacity-30 animate-pulse"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-3xl font-black italic tracking-tighter text-white uppercase",
									children: "Hardware Fault"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm font-medium italic text-blue-100/40 tracking-tight leading-relaxed",
									children: "The grid has expanded beyond physical hardware constraints. Available memory has been exhausted."
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative overflow-hidden rounded-[3rem] border-2 border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "mb-10 flex items-center gap-4 border-b border-white/5 pb-6",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex h-12 w-12 items-center justify-center rounded-full border border-[#00f2ff]/20 bg-[#00f2ff]/10 text-[#00f2ff] shadow-lg",
										children: mode === "story" ? /* @__PURE__ */ jsx(GraduationCap, { size: 24 }) : /* @__PURE__ */ jsx(Cpu, { size: 24 })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
										className: "text-2xl font-black italic tracking-tight text-white uppercase",
										children: ["Centralized ", m.unit]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-[#ff00e5] animate-pulse" }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-black uppercase tracking-[0.3em] text-blue-300/40 italic",
											children: "Global Processing Pass"
										})]
									})] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-8",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "rounded-[2rem] border border-white/5 bg-[#0a0a2e] p-6 space-y-6 shadow-inner relative overflow-hidden",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "absolute top-0 right-0 p-4 opacity-[0.03]",
												children: /* @__PURE__ */ jsx(Search, { size: 80 })
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsx(Search, {
													size: 18,
													className: "text-[#00f2ff]"
												}), /* @__PURE__ */ jsxs("h4", {
													className: "text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic",
													children: ["1. ", mode === "tech" ? "Global Query (Q)" : "Core Inquiry"]
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "rounded-2xl border-2 border-white/5 bg-white/5 p-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "text-center text-sm font-bold italic leading-relaxed text-white",
													children: [
														"\"",
														SELF_ATTENTION_SCENARIO.sentence[step % 8],
														"\""
													]
												})
											}),
											/* @__PURE__ */ jsx("div", {
												className: "flex justify-center py-4",
												children: /* @__PURE__ */ jsxs("div", {
													className: "relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#00f2ff]/20 bg-[#00f2ff]/5",
													children: [/* @__PURE__ */ jsx(Zap, {
														size: 40,
														className: cn("text-[#00f2ff]", isPlaying && !isOOM ? "animate-pulse" : "")
													}), isPlaying && !isOOM && Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(motion.div, {
														className: "absolute h-full w-full rounded-full border border-[#00f2ff]/30",
														animate: {
															scale: [1, 2],
															opacity: [.5, 0]
														},
														transition: {
															duration: 2,
															repeat: Infinity,
															delay: i * .5
														}
													}, i))]
												})
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "rounded-[2.5rem] border border-white/5 bg-white/5 p-6 space-y-6",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(BookMarked, {
												size: 18,
												className: "text-[#ff00e5]"
											}), /* @__PURE__ */ jsxs("h4", {
												className: "text-[11px] font-black uppercase tracking-[0.4em] text-blue-300/60 italic",
												children: [
													"2.",
													" ",
													mode === "tech" ? "Attention Output (Z)" : "The Summary"
												]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative flex min-h-[200px] flex-col rounded-[2rem] border-4 border-[#0a0a2e] bg-white p-6 shadow-2xl overflow-hidden",
											children: [
												/* @__PURE__ */ jsx(Notebook, {
													size: 24,
													className: "mb-6 text-blue-200/20"
												}),
												/* @__PURE__ */ jsx("div", {
													className: "space-y-1.5 flex-1 flex flex-col-reverse overflow-hidden",
													children: !isOOM ? Array.from({ length: 8 }).map((_, i) => {
														const currentRow = Math.floor(step % 64 / 8);
														const isLearned = i <= currentRow;
														const blockWeight = dataSet[i % dataSet.length].score;
														return /* @__PURE__ */ jsxs(Popover.Root, { children: [/* @__PURE__ */ jsx(Popover.Trigger, {
															asChild: true,
															children: /* @__PURE__ */ jsx(motion.button, {
																initial: { height: 0 },
																animate: { height: isLearned ? `${blockWeight * 35}px` : 0 },
																className: cn("relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-md mb-1 transition-all duration-700", !isLearned || blockWeight < .1 ? "opacity-0 pointer-events-none" : "", i === currentRow ? "bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]" : "bg-[#0a0a2e]/10 hover:bg-[#0a0a2e]/20"),
																children: isLearned && blockWeight > .4 && /* @__PURE__ */ jsx("span", {
																	className: "text-[8px] font-black italic tracking-widest text-[#0a0a2e]/40",
																	children: SELF_ATTENTION_SCENARIO.sentence[i]
																})
															})
														}), /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, {
															side: "top",
															sideOffset: 15,
															collisionPadding: 10,
															className: "z-50 w-72 rounded-[2rem] border-2 border-white/20 bg-white p-6 text-gray-900 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300",
															children: [/* @__PURE__ */ jsxs("div", {
																className: "space-y-3 text-left",
																children: [
																	/* @__PURE__ */ jsxs("div", {
																		className: "flex items-center justify-between border-b border-gray-100 pb-2",
																		children: [/* @__PURE__ */ jsxs("span", {
																			className: "text-[10px] font-black uppercase tracking-widest text-[#ff00e5] italic",
																			children: ["Data Entry ", i + 1]
																		}), /* @__PURE__ */ jsxs("span", {
																			className: "font-mono text-[10px] font-black text-gray-400",
																			children: ["RANK_", (blockWeight * 100).toFixed(0)]
																		})]
																	}),
																	/* @__PURE__ */ jsxs("div", {
																		className: "rounded-2xl bg-gray-50 p-3 text-xs font-black italic leading-relaxed",
																		children: [
																			"\"",
																			SELF_ATTENTION_SCENARIO.sentence[i],
																			"\""
																		]
																	}),
																	/* @__PURE__ */ jsx("p", {
																		className: "text-[9px] font-bold uppercase tracking-tighter text-gray-400",
																		children: mode === "tech" ? "Softmax Weighted Result" : "Consolidated Context"
																	})
																]
															}), /* @__PURE__ */ jsx(Popover.Arrow, { className: "fill-white" })]
														}) })] }, i);
													}) : /* @__PURE__ */ jsx("div", {
														className: "flex flex-1 items-center justify-center",
														children: /* @__PURE__ */ jsxs("div", {
															className: "text-center",
															children: [/* @__PURE__ */ jsx(AlertTriangle, {
																size: 32,
																className: "mx-auto mb-3 text-[#ff00e5] animate-pulse"
															}), /* @__PURE__ */ jsx("div", {
																className: "text-[10px] font-black uppercase tracking-tighter text-[#ff00e5]",
																children: "Memory Static"
															})]
														})
													})
												}),
												!isOOM && /* @__PURE__ */ jsxs("div", {
													className: "mt-6 flex items-center justify-between border-t border-gray-100 pt-3",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic",
														children: "Weighted Sum"
													}), /* @__PURE__ */ jsxs("span", {
														className: "text-[10px] font-black italic text-[#ff00e5]",
														children: [Math.round((Math.floor(step % 64 / 8) + 1) / 8 * 100), "% TOTAL"]
													})]
												})
											]
										})]
									})]
								})]
							})
						})]
					}),
					!isOOM && /* @__PURE__ */ jsxs("section", {
						className: "mt-32 space-y-12",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-3",
							children: [
								/* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" }),
								/* @__PURE__ */ jsx("h2", {
									className: "text-xs font-black uppercase tracking-[0.5em] text-[#00f2ff] italic",
									children: "Final Synthesis"
								}),
								/* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" })
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "max-w-4xl mx-auto space-y-8",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "text-center space-y-4",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "text-3xl font-black italic tracking-tighter text-white",
										children: "The Context-Aware Sentence"
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-blue-100/60 text-lg leading-relaxed font-medium italic max-w-2xl mx-auto",
										children: [
											"The final output isn't just the original words. Every token has now",
											/* @__PURE__ */ jsx("span", {
												className: "text-white font-black underline decoration-[#ff00e5] decoration-2 underline-offset-4 mx-1",
												children: "absorbed information"
											}),
											"from its neighbors based on those attention weights."
										]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 md:grid-cols-4 gap-4",
									children: SELF_ATTENTION_SCENARIO.sentence.map((token, i) => {
										const relationships = activeIntent.weights[i].map((w, idx) => ({
											word: SELF_ATTENTION_SCENARIO.sentence[idx],
											weight: w,
											idx
										})).filter((r) => r.idx !== i && r.weight > .15).sort((a, b) => b.weight - a.weight).slice(0, 2);
										return /* @__PURE__ */ jsxs(motion.div, {
											whileHover: {
												scale: 1.05,
												y: -5
											},
											className: "bg-white/5 border border-white/10 p-5 rounded-[2rem] backdrop-blur-md relative overflow-hidden group",
											children: [
												/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
												/* @__PURE__ */ jsx("div", {
													className: "text-xl font-black italic text-white mb-3",
													children: token
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ jsx("div", {
														className: "text-[8px] font-black uppercase text-blue-300/30 tracking-widest",
														children: "Absorbed Context"
													}), relationships.length > 0 ? relationships.map((r, ri) => /* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-[#ff00e5]" }), /* @__PURE__ */ jsx("span", {
															className: "text-[10px] font-bold text-[#00f2ff] italic",
															children: r.word
														})]
													}, ri)) : /* @__PURE__ */ jsx("div", {
														className: "text-[10px] text-white/10 italic italic",
														children: "Self-referential"
													})]
												})
											]
										}, i);
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-8 bg-[#ff00e5]/5 rounded-[2.5rem] border-2 border-[#ff00e5]/20 flex flex-col md:flex-row items-center gap-8",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 shrink-0 rounded-full bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] shadow-[0_0_20px_rgba(255,0,229,0.2)]",
										children: /* @__PURE__ */ jsx(Zap, { size: 32 })
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-sm font-black uppercase tracking-widest text-white italic",
											children: "How it collates: The Weighted Average"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-blue-100/50 leading-relaxed font-medium",
											children: "The model multiplies each \"Value\" (the meaning of the word) by its \"Attention Weight\" (how important it is). It then adds them all together. If \"butler\" is looking at \"kitchen,\" the new mathematical representation of \"butler\" physically contains parts of the \"kitchen\" context. This is how the model builds a deeper understanding of the story."
										})]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "mt-32 w-full max-w-4xl mx-auto border-t border-white/10 pt-20",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row items-center gap-12",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1 space-y-6 text-center md:text-left",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-3 py-1 bg-[#ff00e5]/10 rounded-full border border-[#ff00e5]/20 text-[10px] font-black text-[#ff00e5] uppercase tracking-widest italic",
										children: [/* @__PURE__ */ jsx(Zap, {
											size: 10,
											className: "animate-pulse"
										}), "Beyond the Bottleneck"]
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-4xl font-black italic tracking-tighter text-white",
										children: "How do we scale?"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-blue-100/60 text-lg leading-relaxed font-medium italic",
										children: [
											"If a single student can't handle the mountain of clues, we don't buy a bigger room—we bring in a team.",
											/* @__PURE__ */ jsx("span", {
												className: "text-white font-black underline decoration-[#00f2ff] decoration-2 underline-offset-4 mx-1",
												children: "Ring Attention"
											}),
											"distributes the sequence across a collaborative circle, allowing for near-infinite context."
										]
									}),
									/* @__PURE__ */ jsxs(Link, {
										to: "/ring-attention",
										className: "group inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-[#00f2ff]/10 border-2 border-white/10 hover:border-[#00f2ff]/50 rounded-full transition-all mt-4",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-black uppercase tracking-widest text-[#00f2ff]",
											children: "Explore Ring Attention"
										}), /* @__PURE__ */ jsx(ArrowRight, {
											size: 18,
											className: "text-[#00f2ff] group-hover:translate-x-1 transition-transform"
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "w-48 h-48 md:w-64 md:h-48 relative shrink-0 flex items-center justify-center",
								children: [
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#00f2ff]/10 blur-3xl rounded-full animate-pulse" }),
									/* @__PURE__ */ jsx("div", { className: "relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dashed border-[#00f2ff]/30 animate-[spin_20s_linear_infinite]" }),
									/* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 flex items-center justify-center",
										children: /* @__PURE__ */ jsx("div", {
											className: "w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] p-[2px] shadow-[0_0_30px_rgba(0,242,255,0.3)]",
											children: /* @__PURE__ */ jsx("div", {
												className: "w-full h-full rounded-full bg-[#0a0a2e] flex items-center justify-center",
												children: /* @__PURE__ */ jsx(History, {
													size: 24,
													className: "text-white"
												})
											})
										})
									})
								]
							})]
						})
					})
				]
			})
		]
	});
}
var what_i_learned_building_this_site_default = "---\ntitle: What I Learned Building This Site\ndate: 2026-05-18\ndescription: A few things I picked up going from a blank Vite project to a retro space-themed personal site with SSG.\n---\n\nBuilding a personal site is one of those things you do partly to have a personal site and partly as an excuse to try things you've been curious about.\n\nHere are a few honest takeaways from building this one.\n\n## Tailwind v4 is a different beast\n\nI'd used Tailwind v3 on several projects. v4 rethinks the config entirely — no more `tailwind.config.js`, theme tokens live in CSS via `@theme`, and the Vite plugin wires everything up automatically.\n\nThe tradeoff is that the ecosystem hasn't caught up. Typography plugin, third-party component libraries, Stack Overflow answers — almost all written for v3. I ended up writing prose styles by hand rather than fighting the `@tailwindcss/typography` migration.\n\nWorth it, but expect some head-scratching.\n\n## Framer Motion earns its weight\n\nI almost skipped it and did CSS animations instead. I'm glad I didn't. The floating pod header animation and the card hover effects would have taken 3x as long with `@keyframes` and still felt less polished.\n\nThe API is intuitive once you accept that `initial`, `animate`, and `transition` are all you need 90% of the time.\n\n## Static site generation matters for content pages\n\nA pure SPA is fine for interactive tools where the content changes client-side. For essays and blog posts, you want the HTML to arrive pre-rendered: faster first paint, better SEO, and the content is readable even before JavaScript runs.\n\n`vite-react-ssg` handles this cleanly for a React + Vite setup. Each markdown file becomes a route, each route gets its own `index.html` at build time.\n\n## Don't overthink the design\n\nI spent about two hours picking the color palette (deep navy, cyan, magenta) and the rest just fell into place. The retro space vibe came from leaning into that palette rather than planning it out.\n\nPick one strong visual motif and be consistent. The rest tends to follow.\n";
function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return {
		data: {},
		content: raw
	};
	const data = {};
	for (const line of match[1].split("\n")) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const key = line.slice(0, colon).trim();
		const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
		if (key) data[key] = val;
	}
	return {
		data,
		content: match[2]
	};
}
var rawModules = { "../essays/what-i-learned-building-this-site.md": what_i_learned_building_this_site_default };
function getEssays() {
	return Object.entries(rawModules).map(([path, raw]) => {
		const slug = path.replace("../essays/", "").replace(".md", "");
		const { data, content } = parseFrontmatter(raw);
		return {
			slug,
			title: data.title ?? slug,
			date: data.date ?? "",
			description: data.description ?? "",
			content
		};
	}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
function getEssay(slug) {
	return getEssays().find((e) => e.slug === slug);
}
function getEssaySlugs() {
	return getEssays().map((e) => e.slug);
}
function Essays() {
	const essays = getEssays();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#ff00e5]/30 font-sans",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff00e5]/5 blur-[150px] rounded-full" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 blur-[150px] rounded-full" })]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "max-w-3xl mx-auto px-6 pt-12",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-300/40 hover:text-[#ff00e5] transition-all italic",
					children: [/* @__PURE__ */ jsx(ArrowLeft, {
						size: 12,
						className: "group-hover:-translate-x-1 transition-transform"
					}), "Back to Base"]
				})
			}),
			/* @__PURE__ */ jsx("main", {
				className: "max-w-3xl mx-auto px-6 py-16",
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .8,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-4 mb-16",
						children: [
							/* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" }),
							/* @__PURE__ */ jsx("h1", {
								className: "text-xs font-black uppercase tracking-[0.5em] text-[#ff00e5]",
								children: "Stuff I Wrote"
							}),
							/* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#ff00e5] rounded-full shadow-[0_0_10px_#ff00e5]" })
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: essays.map((essay, i) => /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 16
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .5,
								delay: i * .08,
								ease: [
									.22,
									1,
									.36,
									1
								]
							},
							children: /* @__PURE__ */ jsxs(Link, {
								to: `/essays/${essay.slug}`,
								className: "group relative block",
								children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#ff00e5]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" }), /* @__PURE__ */ jsxs("div", {
									className: "relative bg-[#16164d]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 group-hover:border-[#ff00e5]/40 transition-all flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-4 min-w-0",
										children: [/* @__PURE__ */ jsx("div", {
											className: "shrink-0 w-10 h-10 rounded-full bg-[#ff00e5]/10 flex items-center justify-center text-[#ff00e5] border border-[#ff00e5]/20 group-hover:bg-[#ff00e5]/20 transition-all mt-0.5",
											children: /* @__PURE__ */ jsx(BookOpen, { size: 18 })
										}), /* @__PURE__ */ jsxs("div", {
											className: "min-w-0",
											children: [
												/* @__PURE__ */ jsx("h2", {
													className: "text-lg font-black italic tracking-tight text-white leading-snug",
													children: essay.title
												}),
												essay.description && /* @__PURE__ */ jsx("p", {
													className: "text-blue-300/50 text-xs font-medium mt-1 leading-relaxed line-clamp-2",
													children: essay.description
												}),
												essay.date && /* @__PURE__ */ jsx("p", {
													className: "text-white/20 text-[10px] uppercase tracking-widest font-black mt-2",
													children: new Date(essay.date).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric"
													})
												})
											]
										})]
									}), /* @__PURE__ */ jsx(ArrowRight, {
										className: "shrink-0 text-white/20 group-hover:text-[#ff00e5] group-hover:translate-x-1 transition-all",
										size: 22
									})]
								})]
							})
						}, essay.slug))
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function EssayPost() {
	const { slug } = useParams();
	const essay = slug ? getEssay(slug) : void 0;
	if (!essay) return /* @__PURE__ */ jsx(Navigate, {
		to: "/essays",
		replace: true
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0a0a2e] text-[#f0f9ff] selection:bg-[#ff00e5]/30 font-sans",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#ff00e5]/5 blur-[150px] rounded-full" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 blur-[150px] rounded-full" })]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "max-w-3xl mx-auto px-6 pt-12",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/essays",
					className: "group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-300/40 hover:text-[#ff00e5] transition-all italic",
					children: [/* @__PURE__ */ jsx(ArrowLeft, {
						size: 12,
						className: "group-hover:-translate-x-1 transition-transform"
					}), "All Essays"]
				})
			}),
			/* @__PURE__ */ jsx("main", {
				className: "max-w-3xl mx-auto px-6 py-16",
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .8,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-12",
						children: [
							/* @__PURE__ */ jsx("h1", {
								className: "text-4xl sm:text-5xl font-black italic tracking-tight text-white leading-tight mb-4",
								children: essay.title
							}),
							essay.description && /* @__PURE__ */ jsx("p", {
								className: "text-blue-100/60 text-lg font-medium leading-relaxed mb-4",
								children: essay.description
							}),
							essay.date && /* @__PURE__ */ jsx("p", {
								className: "text-[#ff00e5]/60 text-[10px] uppercase tracking-[0.4em] font-black",
								children: new Date(essay.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric"
								})
							}),
							/* @__PURE__ */ jsx("div", { className: "mt-8 h-px bg-gradient-to-r from-[#ff00e5]/30 via-white/10 to-transparent" })
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "essay-prose",
						children: /* @__PURE__ */ jsx(ReactMarkdown, {
							components: {
								h1: ({ children }) => /* @__PURE__ */ jsx("h1", {
									className: "text-3xl font-black italic tracking-tight text-white mt-12 mb-4 first:mt-0",
									children
								}),
								h2: ({ children }) => /* @__PURE__ */ jsx("h2", {
									className: "text-2xl font-black italic tracking-tight text-white mt-10 mb-3",
									children
								}),
								h3: ({ children }) => /* @__PURE__ */ jsx("h3", {
									className: "text-xl font-black italic text-white mt-8 mb-2",
									children
								}),
								p: ({ children }) => /* @__PURE__ */ jsx("p", {
									className: "text-blue-100/75 text-[1.05rem] leading-[1.85] mb-5 font-medium",
									children
								}),
								a: ({ href, children }) => /* @__PURE__ */ jsx("a", {
									href,
									className: "text-[#ff00e5] hover:text-[#ff00e5]/80 underline underline-offset-2 transition-colors",
									target: href?.startsWith("http") ? "_blank" : void 0,
									rel: href?.startsWith("http") ? "noopener noreferrer" : void 0,
									children
								}),
								strong: ({ children }) => /* @__PURE__ */ jsx("strong", {
									className: "text-white font-black",
									children
								}),
								em: ({ children }) => /* @__PURE__ */ jsx("em", {
									className: "text-blue-100/90 italic",
									children
								}),
								ul: ({ children }) => /* @__PURE__ */ jsx("ul", {
									className: "mb-5 space-y-2 pl-6",
									children
								}),
								ol: ({ children }) => /* @__PURE__ */ jsx("ol", {
									className: "mb-5 space-y-2 pl-6 list-decimal",
									children
								}),
								li: ({ children }) => /* @__PURE__ */ jsx("li", {
									className: "text-blue-100/75 text-[1.05rem] leading-[1.85] font-medium relative before:content-['—'] before:absolute before:-left-5 before:text-[#ff00e5]/50",
									children
								}),
								blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", {
									className: "border-l-2 border-[#ff00e5]/40 pl-5 my-6 text-blue-100/60 italic",
									children
								}),
								code: ({ children, className }) => {
									if (className?.startsWith("language-")) return /* @__PURE__ */ jsx("code", {
										className: "block bg-[#16164d] border border-white/10 rounded-xl p-4 text-[#00f2ff] text-sm font-mono leading-relaxed overflow-x-auto mb-5 whitespace-pre",
										children
									});
									return /* @__PURE__ */ jsx("code", {
										className: "bg-[#16164d] border border-white/10 rounded px-1.5 py-0.5 text-[#00f2ff] text-sm font-mono",
										children
									});
								},
								pre: ({ children }) => /* @__PURE__ */ jsx(Fragment, { children }),
								hr: () => /* @__PURE__ */ jsx("div", { className: "my-10 h-px bg-gradient-to-r from-[#ff00e5]/20 via-white/10 to-transparent" })
							},
							children: essay.content
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return /* @__PURE__ */ jsx(Outlet, {});
}
const createRoot = ViteReactSSG({ routes: [{
	path: "/",
	element: /* @__PURE__ */ jsx(ScrollToTop, {}),
	children: [
		{
			index: true,
			element: /* @__PURE__ */ jsx(Home, {})
		},
		{
			path: "attention",
			element: /* @__PURE__ */ jsx(AttentionLab, {})
		},
		{
			path: "ring-attention",
			element: /* @__PURE__ */ jsx(RingAttention, {})
		},
		{
			path: "self-attention",
			element: /* @__PURE__ */ jsx(SelfAttention, {})
		},
		{
			path: "essays",
			element: /* @__PURE__ */ jsx(Essays, {})
		},
		{
			path: "essays/:slug",
			element: /* @__PURE__ */ jsx(EssayPost, {}),
			getStaticPaths: () => getEssaySlugs().map((s) => `essays/${s}`)
		}
	]
}] });
export { createRoot };

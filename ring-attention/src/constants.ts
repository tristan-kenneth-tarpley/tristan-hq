export type Mode = "story" | "tech";

export const STORY_DATA = [
  {
    id: 0,
    text: "The Manor House stood silent under the moonlight. Clues are hidden in every wing.",
    score: 0.4,
  },
  {
    id: 1,
    text: "At 12:00 AM, the butler was seen leaving the kitchen with a mysterious tray.",
    score: 0.95,
  },
  {
    id: 2,
    text: "A silver key was found in the rose garden, covered in fresh, dark mud.",
    score: 0.6,
  },
  {
    id: 3,
    text: "The heavy rain washed away any footprints near the library window.",
    score: 0.3,
  },
  {
    id: 4,
    text: "The clock struck twelve, echoing through the silent corridors of the east wing.",
    score: 0.5,
  },
  {
    id: 5,
    text: "The cook confirmed that everyone was in the dining hall until 11 PM sharp.",
    score: 0.2,
  },
  {
    id: 6,
    text: "A witness saw a tall shadow moving towards the safe exactly at midnight.",
    score: 0.85,
  },
  {
    id: 7,
    text: "The safe was found open; only a single blue feather was left inside.",
    score: 0.55,
  },
];

export const TECH_DATA = [
  {
    id: 0,
    text: "attention_weights = softmax(Q @ K.T / sqrt(d_k))",
    score: 0.4,
  },
  { id: 1, text: "ring_communication_step(kv_buffer, next_rank)", score: 0.95 },
  { id: 2, text: "v_accum = v_accum + attention_weights @ V", score: 0.6 },
  { id: 3, text: "linear_complexity = O(N_seq / N_devices)", score: 0.3 },
  {
    id: 4,
    text: "causal_masking = torch.tril(ones(seq_len, seq_len))",
    score: 0.5,
  },
  { id: 5, text: "multi_head_projection = W_q(x), W_k(x), W_v(x)", score: 0.2 },
  { id: 6, text: "online_softmax_update(max, sum, new_weights)", score: 0.85 },
  { id: 7, text: "lossless_context_scaling = True", score: 0.55 },
];

export const METAPHORS = {
  story: {
    title: "The Study Circle",
    unit: "Student",
    data: "Page",
    transfer: "KV Cache (Notes)",
    searchTool: "Flashlight",
    storage: "Summary Notebook",
    mathTerm: "Perfect Recall",
    query: "What was the butler doing at midnight?",
  },
  tech: {
    title: "Ring Attention",
    unit: "GPU Node",
    data: "Token",
    transfer: "KV Cache (K, V)",
    searchTool: "Query Beam",
    storage: "Attention Output (Z)",
    mathTerm: "Online Softmax",
    query: "ring_communication_step(kv_buffer, next_rank)",
  },
};

export const DEFINITIONS = {
  score: {
    title: "Current Similarity Score",
    story:
      "How well this specific page matches your flashlight's search. A 95% match means this page likely contains the answer you're looking for.",
    tech: "The dot product of the Query (Q) and the current Key (K). It measures the 'relevance' of these tokens to your search vector.",
  },
  max: {
    title: "Global Max (M)",
    story:
      "The highest similarity score you've found across all steps so far. It's like keeping track of the single most important clue found yet.",
    tech: "The maximum logit encountered. We track this to perform 'Numerical Stabilization,' ensuring the exponential math doesn't overflow.",
  },
  sum: {
    title: "Accumulated Sum (S)",
    story:
      "The total 'volume' of all clues found so far. We need this total at the end to properly weight how much attention to pay to each clue.",
    tech: "The running denominator of the Softmax function. It allows us to calculate an identical result to standard attention without seeing all data at once.",
  },
};

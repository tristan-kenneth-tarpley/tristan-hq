export interface EducationalScenario {
  sentence: string[];
  intents: {
    label: string;
    description: string;
    focusTokenIndex: number; // Which token's perspective we are showing
    weights: number[][]; // N x N weight matrix
  }[];
}

export const SELF_ATTENTION_SCENARIO: EducationalScenario = {
  sentence: ["The", "butler", "left", "the", "kitchen", "with", "a", "tray"],
  intents: [
    {
      label: "Subject Focus",
      description: "Focusing on the actor. See how 'The' and 'butler' are strongly paired.",
      focusTokenIndex: 1, // Focus on "butler"
      weights: [
        [0.8, 0.2, 0, 0, 0, 0, 0, 0],
        [0.2, 0.8, 0, 0, 0, 0, 0, 0],
        [0.1, 0.4, 0.5, 0, 0, 0, 0, 0],
        [0, 0.1, 0, 0.9, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1],
      ]
    },
    {
      label: "Action Focus",
      description: "Connecting the verb to its context. 'left' is linked to 'butler' and 'kitchen'.",
      focusTokenIndex: 2, // Focus on "left"
      weights: [
        [1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0.7, 0.3, 0, 0, 0, 0, 0],
        [0, 0.3, 0.4, 0, 0.3, 0, 0, 0], // left -> butler, kitchen
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0.3, 0, 0.7, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1],
      ]
    },
    {
      label: "Object Focus",
      description: "Identifying what is being carried. 'tray' and 'butler' are the key connection.",
      focusTokenIndex: 7, // Focus on "tray"
      weights: [
        [1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0.6, 0, 0, 0, 0, 0, 0.4], // butler -> tray
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0.8, 0, 0.2],
        [0, 0, 0, 0, 0, 0, 0.9, 0.1],
        [0, 0.4, 0, 0, 0, 0.1, 0.1, 0.4], // tray -> butler
      ]
    }
  ]
};

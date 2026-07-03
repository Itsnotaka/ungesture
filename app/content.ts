// app/content.ts
// ── Centralized copy for the entire site ──────────────────
// Edit strings here; they flow through to every component.

export const site = {
  title: "Un · Gesture",
  description:
    "A summer research mission on how software interacts with AI — and why the best interface is the one you forget you are using.",
  url: "https://ungesture.com",
  ogImage: "/og-image.svg",
  wordmark: ["Un", "Gesture"] as [string, string],
  social: { handle: "@d2ac__", href: "https://x.com/d2ac__" },
} as const;

export const magazine = {
  openLabel: "Lift the cover",
  closeLabel: "Close the cover",
  oppositeNote: "this spread →",

  editorsLetter: {
    kicker: "Editor's Note · Page One",
    heading: "Why interfaces matter",
    body: [
      "This summer I set out to learn how desktop apps interact with AI. I went down a rabbit hole trying to make the best out-of-the-box experience for normal users.",
      "It turned out to be what I want to explore: how software can participate in human interaction rather than just facilitating it.",
      "UnGesture is a laboratory for that instinct — interfaces that behave like social situations. They lean when you are reaching. They wait when you are thinking. They hand work across without making you set it down and pick it up again.",
      "In this inaugural issue I state the founding premise: that good design disappears into use, that manners matter more than models, and that the best software is noticed only in its absence. The rest of the room is still being built.",
    ],
    signature: "— For the laboratory",
  },

  contents: [
    { page: "01", title: "Letter from the Editor", note: "why interfaces matter", href: null },
  ],

  inside: {
    kicker: "Vol. I · Summer 2026",
    headline: ["Why", "interfaces matter"],
    intro:
      "This summer I set out to learn how desktop apps interact with AI. I went down a rabbit hole trying to make the best out-of-the-box experience for normal users. It turned out to be what I want to explore: how software can participate in human interaction rather than just facilitating it.",
    projects: [
      {
        name: "Honk",
        line: "A desktop workspace where frontier coding agents do real work while you steer.",
      },
      {
        name: "Dia",
        line: "A multiplayer iOS app for sharing food, outfits, and places in real time.",
      },
    ],
  },

  insideCover: {
    kicker: "Contents",
    heading: "In this issue",
    footer:
      "UnGesture is edited and published from an unmarked room. No subscription. No schedule. Appears when there is something worth saying.",
  },

  cover: {
    date: "Summer 2026",
    masthead: ["Un", "Gesture"] as [string, string],
    subtitle: "the invisible issue",
    features: [
      { title: "The best out-of-the-box experience", ref: "The summer mission" },
      { title: "Honk", ref: "An agent workspace" },
      { title: "Dia", ref: "Shared spaces, live" },
    ],
  },
} as const;

export const mark = {
  title: "The Mark",
  description:
    "The laboratory's mark: a living cell held in a glass case, grown fresh for every visit. No two are alike.",
  specimenLabel: "Specimen",
  caption: "Grown for this visit. Press it and another takes its place.",
  growLabel: "Grow a new specimen",
  markAlt: "A living cell drifting inside a wireframe glass case",
  mastheadLabel: "The mark, up close",
  backLabel: "Back to the magazine",
  pauseLabel: "Hold it still",
  playLabel: "Let it drift",
  tileLabel: "Preview as an app icon",
  downloadLabel: "Download this frame as a PNG",
  poseLabel: "Pose",
  sizeLabel: "Cell",
  hueLabel: "Hue",
} as const;

export const volumeCard = {
  label: "UnGesture",
  volPrefix: "Vol.",
  artText: {
    nudge: "ahem.",
    echo: "( yes )",
  },
} as const;

export type Volume = {
  number: string;
  gesture: "lean" | "handoff" | "pause" | "nudge" | "echo" | "breath";
  name: string;
  analogy: string;
  line: string;
  cover: string;
  text: string;
  border: string;
};

export const volumes: Volume[] = [
  {
    number: "01",
    gesture: "lean",
    name: "The Lean",
    analogy: "A friend slides the salt toward you before you ask.",
    line: "The interface drifts toward likely intent. No prompt — only gravity.",
    cover: "bg-mustard",
    text: "text-ink",
    border: "border-ink/25",
  },
  {
    number: "02",
    gesture: "handoff",
    name: "The Handoff",
    analogy: "A book passed hand to hand without being set down.",
    line: "Work travels across surfaces. Nothing copied. Nothing lost.",
    cover: "bg-cobalt",
    text: "text-paper",
    border: "border-paper/30",
  },
  {
    number: "03",
    gesture: "pause",
    name: "The Pause",
    analogy: "A listener who waits rather than interrupts.",
    line: "The cursor rests. The room breathes. You decide when to speak.",
    cover: "bg-sage",
    text: "text-ink",
    border: "border-ink/25",
  },
  {
    number: "04",
    gesture: "nudge",
    name: "The Nudge",
    analogy: "Someone clearing their throat across the room.",
    line: "Not a badge. Not a banner. A change in the air.",
    cover: "bg-pink",
    text: "text-paper",
    border: "border-paper/30",
  },
  {
    number: "05",
    gesture: "echo",
    name: "The Echo",
    analogy: 'A nod that says "I heard you" before you continue.',
    line: "Intent mirrored back. The action confirms itself.",
    cover: "bg-violet",
    text: "text-paper",
    border: "border-paper/30",
  },
  {
    number: "06",
    gesture: "breath",
    name: "The Breath",
    analogy: "The rhythm of conversation — pace, not speed.",
    line: "Nothing snaps. Nothing jumps. State changes inhale and exhale.",
    cover: "bg-teal",
    text: "text-ink",
    border: "border-ink/25",
  },
];

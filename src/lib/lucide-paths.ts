// Raw SVG node data for the Lucide icons used by static .astro components.
// Astro can't render `lucide-react` (React) components, so we mirror the exact
// icon geometry here (extracted verbatim from lucide-react v1.14.0) and draw it
// with <LucideIcon>. Keep additions in sync with the upstream icon of the same
// name so the static and React renderings stay pixel-identical.
export type IconChild =
  | ["path", { d: string }]
  | ["circle", { cx: string; cy: string; r: string }];

export const LUCIDE_PATHS: Record<string, IconChild[]> = {
  scale: [
    ["path", { d: "M12 3v18" }],
    ["path", { d: "m19 8 3 8a5 5 0 0 1-6 0zV7" }],
    ["path", { d: "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" }],
    ["path", { d: "m5 8 3 8a5 5 0 0 1-6 0zV7" }],
    ["path", { d: "M7 21h10" }],
  ],
  "building-2": [
    ["path", { d: "M10 12h4" }],
    ["path", { d: "M10 8h4" }],
    ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }],
    ["path", { d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" }],
    ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" }],
  ],
  "file-check": [
    ["path", { d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
    ["path", { d: "m9 15 2 2 4-4" }],
  ],
  languages: [
    ["path", { d: "m5 8 6 6" }],
    ["path", { d: "m4 14 6-6 2-3" }],
    ["path", { d: "M2 5h12" }],
    ["path", { d: "M7 2h1" }],
    ["path", { d: "m22 22-5-10-5 10" }],
    ["path", { d: "M14 18h6" }],
  ],
  shield: [
    ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }],
  ],
  "shield-check": [
    ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }],
    ["path", { d: "m9 12 2 2 4-4" }],
  ],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  x: [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }],
  ],
  "circle-check": [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m9 12 2 2 4-4" }],
  ],
};

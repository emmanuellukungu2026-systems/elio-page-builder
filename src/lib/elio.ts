import type { Doc, Id } from "@/convex/_generated/dataModel";

export type ElioPage = Doc<"elioPages">;
export type ElioItemId = Id<"elioPages">;

export const PACKS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: "$49",
    period: "one-time",
    tagline: "A clean personal page, live in 48h.",
    features: [
      "Personal page with your username",
      "Profile, story & bio sections",
      "Up to 4 projects or portfolio items",
      "Contact links (email, WhatsApp, socials)",
      "Personal QR code included",
    ],
    popular: false,
  },
  {
    id: "signature",
    name: "Signature",
    price: "$120",
    period: "one-time",
    tagline: "The full Elio experience, tailored.",
    popular: true,
    features: [
      "Everything in Essentiel",
      "Custom accent colors & layout choices",
      "Unlimited projects, ideas & services",
      "Copywriting polish for your story",
      "Pricing section for freelancers",
      "2 revision rounds",
    ],
  },
  {
    id: "prestige",
    name: "Prestige",
    price: "$290",
    period: "one-time",
    tagline: "Concierge build for professionals.",
    popular: false,
    features: [
      "Everything in Signature",
      "Art direction session with our team",
      "NFC card + QR setup, ready to hand out",
      "Priority delivery in 72h",
      "30 days of adjustments after launch",
    ],
  },
] as const;

export type PackId = (typeof PACKS)[number]["id"];
export const SECTION_KINDS = [
  { kind: "project", label: "Project", hint: "Things you've built" },
  { kind: "portfolio", label: "Portfolio", hint: "Visual work & media" },
  { kind: "idea", label: "Idea", hint: "Concepts & works in progress" },
  { kind: "service", label: "Service", hint: "What you offer" },
  { kind: "price", label: "Pricing", hint: "Packages & rates" },
] as const;

export type SectionKind = (typeof SECTION_KINDS)[number]["kind"];

export const KIND_META: Record<string, { label: string; icon: string }> = {
  project: { label: "Project", icon: "FolderGit2" },
  portfolio: { label: "Portfolio", icon: "Images" },
  idea: { label: "Idea", icon: "Lightbulb" },
  service: { label: "Service", icon: "Briefcase" },
  price: { label: "Pricing", icon: "Tag" },
};

export const ACCENTS = [
  "#f0b03f",
  "#67d4f2",
  "#8b93f8",
  "#f2789f",
  "#5eead4",
  "#f2f4fb",
];

export function isSafeLink(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function profileUrl(username: string): string {
  return `${window.location.origin}/u/${username}`;
}

export function splitTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
}

/** Sample page used for landing / demo previews. */
export const SAMPLE_PAGE: ElioPage = {
  _id: "sample" as unknown as ElioItemId,
  _creationTime: Date.parse("2026-09-22"),
  userId: "sample" as unknown as ElioPage["userId"],
  username: "emmanuel",
  displayName: "Emmanuel Lukungu",
  headline: "Developer • Designer • Creator",
  bio: "Building digital experiences that feel human.",
  story:
    "From Kinshasa to the web — I design and build things that help people show who they are.",
  location: "Kinshasa, DRC",
  accent: "#f0b03f",
  isPublished: true,
  items: [
    {
      id: "s1",
      kind: "project",
      title: "Aethel Flow",
      description: "A simple client-management platform for small businesses.",
      tags: ["Product", "SaaS"],
    },
    {
      id: "s2",
      kind: "portfolio",
      title: "Night Market — photo series",
      description: "Street photography shot on 35mm across three cities.",
      tags: ["Photography"],
    },
    {
      id: "s3",
      kind: "idea",
      title: "Lingala language app",
      description: "A gentle, story-first way to learn Lingala.",
      tags: ["Learning"],
    },
  ],
};

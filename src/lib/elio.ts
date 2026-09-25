import type { Doc, Id } from "@/convex/_generated/dataModel";

export type ElioPage = Doc<"elioPages">;
export type ElioItemId = Id<"elioPages">;

/** WhatsApp number of the Elio concierge team. */
export const CONCIERGE_WHATSAPP = "905338366127";

/** Visual styles a business can pick for its public page. */
export const PAGE_STYLES = [
  {
    id: "noir",
    label: "Noir",
    desc: "Dark, high-contrast, editorial.",
    swatch: "linear-gradient(135deg, #0b0e1a, #1f2430)",
  },
  {
    id: "atelier",
    label: "Atelier",
    desc: "Warm paper tones, serif accents.",
    swatch: "linear-gradient(135deg, #f6f5f1, #e7d8bd)",
  },
  {
    id: "atoll",
    label: "Atoll",
    desc: "Deep teal with crisp whites.",
    swatch: "linear-gradient(135deg, #062a30, #0e6f7a)",
  },
  {
    id: "meridian",
    label: "Meridian",
    desc: "Indigo glass with soft glow.",
    swatch: "linear-gradient(135deg, #10132b, #4f46e5)",
  },
] as const;

export type PageStyleId = (typeof PAGE_STYLES)[number]["id"];

export const ACCENTS = ["#1e4fd8", "#4f7dff", "#0e7490", "#0e6f7a", "#4338ca", "#0b2a6b"];

/** Emails allowed into the admin studio — the Aethel Technologies team. */
export const OWNER_EMAILS = [
  "emmanuellukungu6@gmail.com",
  "emmanuellukungu80@gmail.com",
  "emmanuellukungu77@gmail.com",
];

export function styleById(id?: string | null) {
  return PAGE_STYLES.find((s) => s.id === id) ?? PAGE_STYLES[0];
}

/** Sections a business can add to its catalog. */
export const SECTION_KINDS = [
  { kind: "project", label: "Project", icon: "FolderGit2" },
  { kind: "portfolio", label: "Photo", icon: "Images" },
  { kind: "idea", label: "Upcoming", icon: "Lightbulb" },
  { kind: "service", label: "Service", icon: "Briefcase" },
  { kind: "price", label: "Offer", icon: "Tag" },
] as const;

export type SectionKind = (typeof SECTION_KINDS)[number]["kind"];

export const KIND_META: Record<string, { label: string; icon: string }> = {
  project: { label: "Project", icon: "FolderGit2" },
  portfolio: { label: "Photo", icon: "Images" },
  idea: { label: "Upcoming", icon: "Lightbulb" },
  service: { label: "Service", icon: "Briefcase" },
  price: { label: "Offer", icon: "Tag" },
};

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

export function itemUrl(username: string, itemId: string): string {
  return `${profileUrl(username)}/i/${itemId}`;
}

export function splitTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
}

/** Normalize a WhatsApp number to digits only. */
export function waDigits(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

/** Build a wa.me link with a pre-filled message. */
export function waLink(phone: string, message: string): string {
  return `https://wa.me/${waDigits(phone)}?text=${encodeURIComponent(message)}`;
}

/** Compose the concierge brief from the dashboard form values. */
export function buildBrief(input: {
  displayName: string;
  trade?: string;
  location?: string;
  since?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  headline?: string;
  bio?: string;
  story?: string;
  accent?: string;
  style?: string;
  logoUrl?: string;
  coverUrl?: string;
  items: { kind: string; title: string; description?: string; date?: string; status?: string; tags?: string[] }[];
  profileLink: string;
}): string {
  const lines: string[] = [];
  lines.push("*Elio Pages — New business brief*");
  lines.push("");
  lines.push(`*Business:* ${input.displayName}`);
  if (input.trade) lines.push(`*Trade:* ${input.trade}`);
  if (input.location) lines.push(`*Location:* ${input.location}`);
  if (input.since) lines.push(`*Since:* ${input.since}`);
  if (input.email) lines.push(`*Email:* ${input.email}`);
  if (input.whatsapp) lines.push(`*WhatsApp:* ${input.whatsapp}`);
  if (input.instagram) lines.push(`*Instagram:* ${input.instagram}`);
  if (input.linkedin) lines.push(`*LinkedIn:* ${input.linkedin}`);
  lines.push("");
  if (input.headline) lines.push(`*Tagline:* ${input.headline}`);
  if (input.bio) lines.push(`*Pitch:* ${input.bio}`);
  if (input.story) lines.push(`*Story:* ${input.story}`);
  lines.push("");
  lines.push(`*Look:* accent ${input.accent ?? "#1e4fd8"} · style ${input.style ?? "noir"}`);
  if (input.logoUrl) lines.push(`*Logo:* ${input.logoUrl}`);
  if (input.coverUrl) lines.push(`*Cover:* ${input.coverUrl}`);
  lines.push("");
  if (input.items.length > 0) {
    lines.push(`*Catalog (${input.items.length}):*`);
    for (const it of input.items) {
      let row = `• [${it.kind}] ${it.title}`;
      const bits: string[] = [];
      if (it.description) bits.push(it.description);
      if (it.date) bits.push(`date: ${it.date}`);
      if (it.status) bits.push(`status: ${it.status}`);
      if (it.tags?.length) bits.push(`tags: ${it.tags.join(", ")}`);
      if (bits.length) row += ` — ${bits.join(" · ")}`;
      lines.push(row);
    }
    lines.push("");
  }
  lines.push(`*Preview:* ${input.profileLink}`);
  return lines.join("\n");
}

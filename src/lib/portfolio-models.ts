/**
 * The four page models a client can pick at order time.
 *
 * Every model renders the SAME sections (hero, stats, about, skills, services,
 * projects, articles, experience, gallery, ideas, contact, footer). A model is
 * only a visual skin: palette, type treatment and hero composition. The studio
 * reuses one section build and themes it, so nothing is duplicated per model.
 */

export type ModelId = "editorial" | "authory" | "corporate" | "elegant";

/** Colour + type tokens a model themes the shared sections with. */
export type ModelTheme = {
  /** Page canvas. */
  bg: string;
  /** Primary text (headings, strong copy). */
  ink: string;
  /** Secondary text (body, meta). */
  muted: string;
  /** Confident accent for primary actions + highlights. */
  accent: string;
  /** Counter-shape decor colour (geometric accent). */
  decor: string;
  /** Hairline border colour. */
  line: string;
  /** Card / panel surface. */
  surface: string;
  /** Display face: a serif for editorial gravitas, sans otherwise. */
  display: "sans" | "serif";
};

export const MODEL_ORDER: ModelId[] = ["editorial", "authory", "corporate", "elegant"];

export const MODELS: Record<
  ModelId,
  { id: ModelId; label: string; desc: string; theme: ModelTheme }
> = {
  /* 1 — William Harry: warm off-white editorial, coral + purple decor. */
  editorial: {
    id: "editorial",
    label: "Editorial",
    desc: "Warm off-white canvas, oversized navy headline, coral calls-to-action and playful geometric decor.",
    theme: {
      bg: "#f4f2ee",
      ink: "#151a2b",
      muted: "#5b6479",
      accent: "#ef4b34",
      decor: "#6b39d6",
      line: "rgba(21, 26, 43, 0.09)",
      surface: "#ffffff",
      display: "sans",
    },
  },

  /* 2 — Jessica Eden / Authory: clean cover-photo header, blue accent, feed. */
  authory: {
    id: "authory",
    label: "Cover",
    desc: "A clean cover-photo header with a centred portrait, then your work as a tidy, filterable feed.",
    theme: {
      bg: "#ffffff",
      ink: "#1c2024",
      muted: "#6b7280",
      accent: "#2563eb",
      decor: "#93c5fd",
      line: "rgba(28, 32, 36, 0.10)",
      surface: "#f7f8fa",
      display: "sans",
    },
  },

  /* 3 — SOA: corporate navy panel, serif headline, portrait on the right. */
  corporate: {
    id: "corporate",
    label: "Corporate",
    desc: "A deep navy hero with a serif headline and your portrait, then calm, structured sections beneath.",
    theme: {
      bg: "#f4f3f0",
      ink: "#1f2430",
      muted: "#5f6672",
      accent: "#3b4266",
      decor: "#c9a66b",
      line: "rgba(31, 36, 48, 0.12)",
      surface: "#ffffff",
      display: "serif",
    },
  },

  /* 4 — UX BY ASH: near-black, serif display, uppercase nav, portrait right. */
  elegant: {
    id: "elegant",
    label: "Dark",
    desc: "A refined near-black canvas with a serif display headline and a quiet, gallery-like portrait.",
    theme: {
      bg: "#0e0e0f",
      ink: "#f4f2ee",
      muted: "#a1a1a1",
      accent: "#d8b78a",
      decor: "#2a2a2c",
      line: "rgba(244, 242, 238, 0.12)",
      surface: "#161617",
      display: "serif",
    },
  },
};

export function modelById(id?: string | null) {
  return MODELS[(id as ModelId) ?? "editorial"] ?? MODELS.editorial;
}

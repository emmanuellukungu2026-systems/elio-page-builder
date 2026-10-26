import type { CSSProperties } from "react";
import type { ModelTheme } from "@/lib/portfolio-models";

/**
 * Page tokens.
 *
 * A page models its whole palette through CSS custom properties set on the
 * page root (`pageThemeStyle`), so every component — the portfolio itself, the
 * chat panel, the comments card, the studio preview — picks up whichever model
 * the client picked, with no prop drilling and no per-model branches.
 *
 * Token values are `var(--p-…)` strings; components style themselves with them
 * exactly like they used to with the old editorial hex constants.
 */
export const P = {
  /** Page canvas. */ bg: "var(--p-bg)",
  /** Headings and strong copy. */ ink: "var(--p-ink)",
  /** Body, meta, secondary copy. */ muted: "var(--p-muted)",
  /** Accent for primary actions, kickers and highlights. */ acc: "var(--p-acc)",
  /** Counter-shape decor colour. */ dec: "var(--p-dec)",
  /** Hairline borders. */ line: "var(--p-line)",
  /** Card / panel surface. */ surf: "var(--p-surf)",
  /** Text drawn on top of accent fills. */ on: "var(--p-on)",
  /** Hover wash behind interactive rows and ghost buttons. */ hover: "var(--p-hover)",
} as const;

/**
 * Translucent tint of a token. A hex suffix (`${c}1a`) breaks the moment the
 * colour becomes `var(--p-acc)`, so tints go through color-mix instead.
 */
export const alpha = (color: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, transparent)`;

/** Display face used by the serif models (Corporate, Dark). */
export const SERIF = 'Georgia, "Times New Roman", Times, serif';

/** Relative luminance of a #rrggbb colour (0 = black, 1 = white). */
function luminance(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  const chan = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * chan((n >> 16) & 255) +
    0.7152 * chan((n >> 8) & 255) +
    0.0722 * chan(n & 255)
  );
}

/** Text colour that stays legible on top of an arbitrary accent fill. */
export function readableOn(hex: string) {
  return luminance(hex) > 0.55 ? "#14110c" : "#ffffff";
}

/**
 * The model palette as custom properties, ready for the page root's `style`.
 * Also carries the canvas + ink so the root paints without extra rules.
 */
export function pageThemeStyle(theme: ModelTheme): CSSProperties {
  const dark = luminance(theme.bg) < 0.35;
  return {
    background: theme.bg,
    color: theme.ink,
    ...pageVars(theme, dark),
  };
}

/**
 * The palette only — used by sub-trees that repaint a region with a different
 * surface (the Corporate hero panel re-tunes the tokens over its navy block).
 */
export function pageVars(theme: ModelTheme, dark = luminance(theme.bg) < 0.35): CSSProperties {
  return {
    ["--p-bg" as string]: theme.bg,
    ["--p-ink" as string]: theme.ink,
    ["--p-muted" as string]: theme.muted,
    ["--p-acc" as string]: theme.accent,
    ["--p-dec" as string]: theme.decor,
    ["--p-line" as string]: theme.line,
    ["--p-surf" as string]: theme.surface,
    ["--p-on" as string]: theme.onAccent,
    ["--p-hover" as string]: dark
      ? "rgba(244, 242, 238, 0.08)"
      : "rgba(16, 24, 43, 0.05)",
  } as CSSProperties;
}

import { cn } from "@/lib/utils";

/** Small inline SVG sun mark for Elio (avoids image import issues in some contexts). */
export function ElioMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("size-6", className)}>
      <defs>
        <radialGradient id="elioCore" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#FDF6E9" />
          <stop offset="45%" stopColor="#FFD98A" />
          <stop offset="100%" stopColor="#F5B54A" />
        </radialGradient>
        <linearGradient id="elioRing" x1="14" y1="50" x2="52" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5B54A" />
          <stop offset="55%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="13.5" fill="url(#elioCore)" />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="10.5"
        stroke="url(#elioRing)"
        strokeWidth="2.6"
        strokeLinecap="round"
        transform="rotate(-18 32 32)"
      />
      <circle cx="52.4" cy="23.4" r="3.4" fill="#7DD3FC" />
    </svg>
  );
}

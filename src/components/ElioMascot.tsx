import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Elio's mascot — a small round cat wearing an NFC tag, because the whole
 * product is "one tap and everything opens".
 *
 * It blinks and bobs on its own (see the keyframes in index.css); pass
 * `wave` for the raised paw used in greetings, and `label` to expose it to
 * screen readers (it is decorative by default).
 */
export function ElioMascot({
  className,
  wave = false,
  label,
}: {
  className?: string;
  /** Raises the paw — used on the welcome bubble. */
  wave?: boolean;
  /** Accessible label; omit when the mascot sits next to real text. */
  label?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const fur = `elio-fur-${uid}`;
  const tag = `elio-tag-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("elio-mascot", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      <defs>
        <linearGradient id={fur} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#ffe2c4" />
        </linearGradient>
        <linearGradient id={tag} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f7dff" />
          <stop offset="1" stopColor="#1b3fb0" />
        </linearGradient>
      </defs>

      <g className="elio-mascot__body">
        {/* tail, behind the body */}
        <path
          d="M97 95 C114 92 116 70 105 63"
          fill="none"
          stroke={`url(#${fur})`}
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* ears — bases buried in the head, tips clear of it */}
        <path d="M22 44 L26 6 L56 30 Z" fill={`url(#${fur})`} />
        <path d="M98 44 L94 6 L64 30 Z" fill={`url(#${fur})`} />
        <path d="M24 36 L30 14 L46 26 Z" fill="#ffaec1" />
        <path d="M96 36 L90 14 L74 26 Z" fill="#ffaec1" />

        {/* head + body as one soft blob */}
        <circle cx="60" cy="64" r="44" fill={`url(#${fur})`} />
        <ellipse
          cx="45"
          cy="38"
          rx="14"
          ry="7"
          fill="#ffffff"
          opacity="0.55"
          transform="rotate(-20 45 38)"
        />

        {/* eyes (blinking) */}
        <g className="elio-mascot__eyes">
          <ellipse cx="45" cy="62" rx="7.2" ry="9" fill="#16233f" />
          <ellipse cx="75" cy="62" rx="7.2" ry="9" fill="#16233f" />
          <circle cx="47.4" cy="58.2" r="2.6" fill="#ffffff" />
          <circle cx="77.4" cy="58.2" r="2.6" fill="#ffffff" />
          <circle cx="42.8" cy="66.6" r="1.5" fill="#ffffff" opacity="0.7" />
          <circle cx="72.8" cy="66.6" r="1.5" fill="#ffffff" opacity="0.7" />
        </g>

        {/* blush */}
        <ellipse cx="31" cy="75" rx="8" ry="5" fill="#ff8fae" opacity="0.45" />
        <ellipse cx="89" cy="75" rx="8" ry="5" fill="#ff8fae" opacity="0.45" />

        {/* nose + smile */}
        <path d="M56.5 72.4 h7 l-3.5 3.4 z" fill="#ff7d9c" />
        <path
          d="M53 78 q7 7.5 14 0"
          fill="none"
          stroke="#16233f"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* collar + NFC tag */}
        <path
          d="M27 87 Q60 101 93 87"
          fill="none"
          stroke={`url(#${tag})`}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <circle cx="60" cy="99" r="8.5" fill={`url(#${tag})`} />
        <circle cx="56.4" cy="99" r="1.9" fill="#ffffff" />
        <path
          d="M59.6 95.4 A4.6 4.6 0 0 1 59.6 102.6"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M59.6 92.8 A7.4 7.4 0 0 1 59.6 105.2"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* paws */}
        <ellipse cx="36" cy="104" rx="11.5" ry="7" fill={`url(#${fur})`} />
        <ellipse cx="84" cy="104" rx="11.5" ry="7" fill={`url(#${fur})`} />

        {/* raised, waving paw */}
        {wave && (
          <g className="elio-mascot__wave">
            <ellipse cx="12" cy="56" rx="9" ry="11" fill={`url(#${fur})`} />
          </g>
        )}
      </g>
    </svg>
  );
}

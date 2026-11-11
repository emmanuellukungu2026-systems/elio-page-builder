import { useI18n } from "@/lib/i18n";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.21, 0.6, 0.35, 1] as const;

/**
 * Four-step film of the product: a business owner builds his page, the page is
 * written onto his NFC card, a friend taps the card with a phone, and the page
 * opens on that phone. Flat monochrome figures so it sits in either theme.
 */
export function PageStory() {
  const { t } = useI18n();
  const s = t.story;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  // One timer per step: clicking a step simply restarts the clock.
  useEffect(() => {
    if (reduce) {
      setStep(3);
      return;
    }
    const id = setTimeout(() => setStep((v) => (v + 1) % 4), 3400);
    return () => clearTimeout(id);
  }, [step, reduce]);

  const d = reduce ? 0 : 0.7;
  const cardShift = step >= 2 ? 88 : 0;
  const onCard = step === 1;

  return (
    <section id="story" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
            {s.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {s.title}
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">{s.sub}</p>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---------------- Film ---------------- */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/[0.12] via-background to-ember/10 p-3 sm:p-5">
            <svg
              viewBox="0 0 800 440"
              role="img"
              aria-label={s.title}
              className="w-full"
            >
              <defs>
                <linearGradient id="story-card" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5b87ff" />
                  <stop offset="100%" stopColor="#12307a" />
                </linearGradient>
                <linearGradient id="story-screen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#eaf0ff" />
                </linearGradient>
              </defs>

              {/* Floor */}
              <line
                x1="56"
                y1="404"
                x2="744"
                y2="404"
                className="stroke-border"
                strokeWidth="2"
                strokeDasharray="6 9"
                opacity="0.75"
              />

              {/* Journey of the page: laptop → card → phone */}
              <path
                d="M352 300 L586 300"
                className="stroke-ember/35"
                strokeWidth="2"
                strokeDasharray="4 7"
                fill="none"
              />

              {/* ---------------- Owner ---------------- */}
              <ellipse cx="170" cy="408" rx="78" ry="8" className="fill-foreground/10" />
              <g className="fill-foreground/80">
                <circle cx="160" cy="196" r="24" />
                <path d="M160 222c-22 0-36 14-36 36v80h72v-80c0-22-14-36-36-36z" />
                <rect x="136" y="336" width="20" height="62" rx="9" />
                <rect x="162" y="336" width="20" height="62" rx="9" />
                <rect x="122" y="392" width="38" height="12" rx="6" />
                <rect x="158" y="392" width="38" height="12" rx="6" />
              </g>
              {/* Arm reaching the keyboard */}
              <path
                d="M192 262 L230 296"
                className="stroke-foreground/70"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <motion.circle
                cx="234"
                cy="298"
                r="8"
                className="fill-foreground/70"
                animate={reduce || step !== 0 ? { y: 0 } : { y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: reduce ? 0 : Infinity }}
              />

              {/* Desk */}
              <rect x="196" y="316" width="152" height="10" rx="5" className="fill-foreground/20" />
              <rect x="210" y="326" width="10" height="78" rx="5" className="fill-foreground/10" />
              <rect x="324" y="326" width="10" height="78" rx="5" className="fill-foreground/10" />

              {/* Laptop: the page being built */}
              <rect x="234" y="226" width="116" height="92" rx="10" className="fill-foreground/85" />
              <rect x="240" y="232" width="104" height="80" rx="6" fill="url(#story-screen)" />
              <motion.g
                className="fill-[#0b1020]"
                initial={false}
                animate={{ opacity: step === 3 ? 0.35 : 1 }}
                transition={{ duration: d }}
              >
                <motion.circle
                  cx="256"
                  cy="250"
                  r="7"
                  opacity="0.85"
                  initial={false}
                  animate={{ scale: 1 }}
                  transition={{ duration: d }}
                />
                <rect x="268" y="243" width="46" height="7" rx="3.5" opacity="0.7" />
                <rect x="268" y="254" width="28" height="5" rx="2.5" opacity="0.35" />
                <motion.rect
                  x="246"
                  y="266"
                  width="92"
                  height="24"
                  rx="4"
                  initial={false}
                  animate={{ opacity: onCard ? 0.3 : 0.18 }}
                  transition={{ duration: d }}
                />
                <rect x="246" y="296" width="66" height="5" rx="2.5" opacity="0.35" />
                <motion.rect
                  x="316"
                  y="294"
                  width="2.5"
                  height="10"
                  className="fill-[#4f7dff]"
                  initial={false}
                  animate={{ opacity: step === 0 ? [1, 0, 1] : 0 }}
                  transition={{ duration: 1, repeat: step === 0 && !reduce ? Infinity : 0 }}
                />
                <rect x="246" y="305" width="44" height="5" rx="2.5" opacity="0.25" />
              </motion.g>

              {/* The finished page, flying onto the card */}
              <motion.g
                initial={false}
                animate={{
                  x: onCard ? 116 : 0,
                  y: onCard ? 20 : 0,
                  scale: onCard ? 0.9 : 1,
                  opacity: onCard ? 1 : 0,
                }}
                transition={{ duration: d, ease: EASE }}
                style={{ originX: 0, originY: 0 }}
              >
                <g transform="translate(300 236) scale(0.62)">
                  <rect width="96" height="128" rx="8" fill="#ffffff" />
                  <circle cx="18" cy="20" r="9" fill="#0b1020" opacity="0.85" />
                  <rect x="32" y="14" width="46" height="8" rx="4" fill="#0b1020" opacity="0.65" />
                  <rect x="32" y="26" width="30" height="5" rx="2.5" fill="#0b1020" opacity="0.3" />
                  <rect x="12" y="42" width="72" height="34" rx="4" fill="#4f7dff" opacity="0.3" />
                  <rect x="12" y="84" width="60" height="6" rx="3" fill="#0b1020" opacity="0.35" />
                  <rect x="12" y="96" width="42" height="6" rx="3" fill="#0b1020" opacity="0.22" />
                  <rect x="12" y="110" width="30" height="8" rx="4" fill="#4f7dff" opacity="0.65" />
                </g>
              </motion.g>

              {/* ---------------- NFC card ---------------- */}
              <motion.g
                initial={false}
                animate={{ x: cardShift, opacity: step >= 1 ? 1 : 0 }}
                transition={{ duration: d, ease: EASE }}
              >
                <ellipse cx="448" cy="394" rx="62" ry="7" className="fill-foreground/10" />
                <rect x="400" y="228" width="96" height="156" rx="14" fill="url(#story-card)" />
                <circle cx="424" cy="256" r="7" fill="#ffffff" opacity="0.95" />
                <rect x="436" y="252" width="32" height="7" rx="3.5" fill="#ffffff" opacity="0.55" />
                {/* QR */}
                <rect x="412" y="288" width="30" height="30" rx="4" fill="#ffffff" opacity="0.92" />
                <rect x="419" y="295" width="16" height="16" rx="2" fill="#12307a" opacity="0.8" />
                <rect x="454" y="288" width="30" height="30" rx="4" fill="#ffffff" opacity="0.22" />
                <rect x="412" y="332" width="70" height="7" rx="3.5" fill="#ffffff" opacity="0.45" />
                <rect x="412" y="346" width="46" height="7" rx="3.5" fill="#ffffff" opacity="0.25" />

                {/* Tap waves while the card gets written */}
                <motion.g
                  className="stroke-white"
                  fill="none"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ opacity: onCard ? [0.15, 0.8, 0.15] : 0 }}
                  transition={{ duration: 1.8, repeat: onCard && !reduce ? Infinity : 0 }}
                >
                  <path d="M508 292a16 16 0 0 1 0 28" strokeWidth="2.5" />
                  <path d="M516 284a28 28 0 0 1 0 44" strokeWidth="2.5" opacity="0.7" />
                  <path d="M524 276a40 40 0 0 1 0 60" strokeWidth="2.5" opacity="0.45" />
                </motion.g>

                {/* Page landed on the card */}
                <motion.g
                  initial={false}
                  animate={{ opacity: step >= 2 ? 0.95 : 0 }}
                  transition={{ duration: d }}
                >
                  <rect x="428" y="308" width="40" height="5" rx="2.5" fill="#ffffff" opacity="0.75" />
                  <rect x="428" y="318" width="26" height="4" rx="2" fill="#ffffff" opacity="0.4" />
                </motion.g>
              </motion.g>

              {/* ---------------- Friend ---------------- */}
              <ellipse cx="660" cy="408" rx="76" ry="8" className="fill-foreground/10" />
              <motion.g
                initial={false}
                animate={{ rotate: step === 3 ? -3 : 0 }}
                transition={{ duration: d, ease: EASE }}
                style={{ originX: "664px", originY: "220px" }}
              >
                <g className="fill-foreground/80">
                  <circle cx="664" cy="192" r="24" />
                  <path d="M664 218c-22 0-36 14-36 36v84h72v-84c0-22-14-36-36-36z" />
                  <rect x="640" y="334" width="20" height="64" rx="9" />
                  <rect x="666" y="334" width="20" height="64" rx="9" />
                  <rect x="626" y="392" width="38" height="12" rx="6" />
                  <rect x="662" y="392" width="38" height="12" rx="6" />
                </g>
              </motion.g>
              {/* Arm holding the phone */}
              <path
                d="M638 266 L630 304"
                className="stroke-foreground/70"
                strokeWidth="15"
                strokeLinecap="round"
              />

              {/* Phone */}
              <rect x="586" y="244" width="50" height="96" rx="10" className="fill-foreground/85" />
              <rect x="590" y="250" width="42" height="84" rx="6" fill="url(#story-screen)" />

              {/* Mini page opening on the phone */}
              <motion.g
                initial={false}
                animate={{ opacity: step === 3 ? 1 : 0, y: step === 3 ? 0 : 6 }}
                transition={{ duration: d, ease: EASE }}
              >
                <circle cx="600" cy="262" r="5" fill="#4f7dff" />
                <rect x="609" y="258" width="18" height="5" rx="2.5" fill="#0b1020" opacity="0.65" />
                <rect x="596" y="274" width="30" height="22" rx="3" fill="#4f7dff" opacity="0.3" />
                <rect x="596" y="302" width="26" height="4" rx="2" fill="#0b1020" opacity="0.4" />
                <rect x="596" y="310" width="18" height="4" rx="2" fill="#0b1020" opacity="0.25" />
                <rect x="596" y="320" width="22" height="7" rx="3.5" fill="#4f7dff" opacity="0.7" />
              </motion.g>

              {/* Tap ripple between card and phone */}
              {!reduce &&
                [0, 1].map((k) => (
                  <motion.circle
                    key={k}
                    cx="584"
                    cy="300"
                    r="10"
                    fill="none"
                    className="stroke-ember"
                    strokeWidth="2"
                    initial={false}
                    animate={{
                      scale: step === 2 ? [0.6, 2.2] : 0.6,
                      opacity: step === 2 ? [0.7, 0] : 0,
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: step === 2 ? Infinity : 0,
                      delay: k * 0.45,
                      ease: "easeOut",
                    }}
                  />
                ))}

              {/* Done badge */}
              <motion.g
                initial={false}
                animate={{ opacity: step === 3 ? 1 : 0, scale: step === 3 ? 1 : 0.6 }}
                transition={{ duration: d, ease: EASE }}
                style={{ originX: "652px", originY: "236px" }}
              >
                <circle cx="652" cy="236" r="14" className="fill-ember" />
                <path
                  d="M646 236l4 4 7-8"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            </svg>

            {/* Progress rail */}
            <div className="mt-3 flex gap-1.5 px-1" aria-hidden="true">
              {s.steps.map((_, i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    className="h-full rounded-full bg-ember"
                    initial={false}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: d, ease: EASE }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- Steps ---------------- */}
          <ol className="space-y-2">
            {s.steps.map((item, i) => {
              const active = i === step;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={active ? "step" : undefined}
                    className={
                      active
                        ? "w-full rounded-2xl border border-ember/40 bg-ember/[0.07] p-4 text-left transition-colors"
                        : "w-full rounded-2xl border border-transparent p-4 text-left transition-colors hover:border-border/60 hover:bg-accent/40"
                    }
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className={
                          active
                            ? "font-display text-xs font-semibold text-ember"
                            : "font-display text-xs font-semibold text-muted-foreground"
                        }
                      >
                        0{i + 1}
                      </span>
                      <span className="font-display text-base font-semibold">{item.title}</span>
                    </span>
                    <span className="mt-1 block pl-8 text-sm leading-6 text-muted-foreground">
                      {item.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

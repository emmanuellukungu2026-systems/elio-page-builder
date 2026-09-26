import { AethelMark } from "@/components/AethelMark";
import { ElioMark } from "@/components/ElioMark";
import { useI18n } from "@/lib/i18n";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, MessageCircle, Nfc, Sparkles, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * "Order your card" section — three NFC card tiers:
 *  - Standard: black card with the business logo + Aethel signature, fixed design.
 *  - Pro & Independent: showcase illustration — two overlapping cards with
 *    geometric accent shapes (like a print mockup). Pro carries the Aethel mark;
 *    Independent is fully white-label.
 */

/* ------------------------------------------------------------------ */
/* Standard — the simple fixed black card                              */
/* ------------------------------------------------------------------ */

function StandardCard({ businessName, businessLogo }: { businessName: string; businessLogo?: string }) {
  return (
    <div className="relative h-[120px] w-[190px] -rotate-[4deg] rounded-2xl bg-gradient-to-br from-[#111527] to-[#0b0e1a] p-4 shadow-[0_18px_40px_-18px_rgba(11,20,45,0.55)] ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-white">
          {businessLogo ? (
            <img src={businessLogo} alt="" className="size-full object-cover" />
          ) : (
            <span className="font-display text-xs font-bold text-[#0b0e1a]">
              {businessName.slice(0, 1)}
            </span>
          )}
        </div>
        <svg
          viewBox="0 0 24 24"
          className="size-5 text-white/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 8.5a7 7 0 0 1 0 7" />
          <path d="M9.5 6.5a10 10 0 0 1 0 11" />
          <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
        </svg>
      </div>
      <p className="mt-5 font-display text-[13px] font-semibold leading-tight text-white">
        {businessName} <span className="text-white/60">· Elio</span>
      </p>
      <p className="text-[10px] text-white/55">/u/{businessName.toLowerCase().replace(/\s+/g, "-")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase — two overlapping cards, geometric print-mockup style      */
/* ------------------------------------------------------------------ */

function ContactlessWaves({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 8.5a7 7 0 0 1 0 7" />
      <path d="M9.5 6.5a10 10 0 0 1 0 11" />
      <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
    </svg>
  );
}

function ShowcaseFront({
  accent,
  name,
  role,
  phone,
  email,
  mark,
}: {
  accent: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  mark: ReactNode;
}) {
  return (
    <div className="relative h-[124px] w-[200px] overflow-hidden rounded-xl bg-[#182742] shadow-[0_20px_44px_-18px_rgba(11,20,45,0.7)] ring-1 ring-white/10">
      {/* Geometric accent shapes */}
      <svg viewBox="0 0 200 124" className="absolute inset-0 size-full" aria-hidden="true">
        <path d="M200 0v62L126 0Z" fill={accent} />
        <path d="M200 72v52h-56Z" fill={accent} opacity="0.9" />
        <path d="M0 124V84l58 40Z" fill={accent} />
        <path d="M62 0h18L34 124H16Z" fill={accent} opacity="0.16" />
      </svg>

      <ContactlessWaves className="absolute left-4 top-4 size-5 text-white" />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">{mark}</div>

      <div className="absolute left-4 top-[46px]">
        <p className="font-display text-[13px] font-semibold leading-tight text-white">{name}</p>
        <p className="text-[9px] font-medium" style={{ color: accent }}>
          {role}
        </p>
      </div>

      <div className="absolute bottom-3 left-4 space-y-0.5">
        <p className="text-[8px] tracking-wide text-white/75">{phone}</p>
        <p className="text-[8px] tracking-wide text-white/75">{email}</p>
      </div>
    </div>
  );
}

function ShowcaseBack({ accent }: { accent: string }) {
  return (
    <div className="relative h-[124px] w-[200px] overflow-hidden rounded-xl bg-[#121d34] ring-1 ring-white/10">
      <svg viewBox="0 0 200 124" className="absolute inset-0 size-full" aria-hidden="true">
        <path d="M0 0h44L0 38Z" fill={accent} />
        <path d="M200 124v-40l-52 40Z" fill={accent} opacity="0.85" />
        <path d="M150 0h50v44Z" fill={accent} opacity="0.18" />
      </svg>

      {/* Social dots */}
      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="size-2 rounded-full bg-white/35" />
        ))}
      </div>

      {/* NFC mark */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1 text-white">
        <ContactlessWaves className="size-4" />
        <span className="text-[9px] font-bold tracking-widest">NFC</span>
      </div>
    </div>
  );
}

function ShowcaseCards({
  accent,
  name,
  role,
  phone,
  email,
  mark,
}: {
  accent: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  mark: ReactNode;
}) {
  return (
    <div className="relative h-[184px] w-[240px]">
      <div className="absolute left-0 top-9 rotate-[9deg] drop-shadow-[0_14px_24px_rgba(11,20,45,0.45)]">
        <ShowcaseBack accent={accent} />
      </div>
      <div className="absolute left-9 top-1 -rotate-[7deg]">
        <ShowcaseFront accent={accent} name={name} role={role} phone={phone} email={email} mark={mark} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier layout                                                         */
/* ------------------------------------------------------------------ */

function TierCard({
  icon: Icon,
  badge,
  title,
  desc,
  features,
  art,
  featured,
  cta,
}: {
  icon: LucideIcon;
  badge: string;
  title: string;
  desc: string;
  features: readonly string[];
  art: ReactNode;
  featured?: boolean;
  cta: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
      className={cn(
        "glass relative flex h-full flex-col rounded-3xl p-6",
        featured && "ring-2 ring-[#1e4fd8]/60",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[#1e4fd8] px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
          <Sparkles className="size-3" /> {badge}
        </span>
      )}

      <div className="flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-ember/15 text-ember">
          <Icon className="size-5" />
        </span>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p>

      <div className="my-5 flex justify-center overflow-hidden py-2">
        <div className="animate-floaty">{art}</div>
      </div>

      <ul className="mt-auto space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-foreground/85">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href="https://wa.me/243000000000"
        target="_blank"
        rel="noreferrer"
        className="btn-glow mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
      >
        <MessageCircle className="size-4" /> {cta}
      </a>
    </motion.div>
  );
}

export function CardOrdering({ className }: { className?: string }) {
  const { t } = useI18n();
  const c = t.cardOrder;

  const tiers: {
    key: "standard" | "pro" | "independent";
    icon: LucideIcon;
    featured?: boolean;
    accent: string;
    logo?: string;
    name: string;
  }[] = [
    { key: "standard", icon: Nfc, accent: "#ffffff30", logo: photos.portraits, name: c.stdName },
    { key: "pro", icon: Wand2, featured: true, accent: "#c0854f", name: c.proName },
    { key: "independent", icon: Sparkles, accent: "#0e7490", name: c.indName },
  ];

  return (
    <section id="cards" className={cn("relative px-4 py-24 sm:px-6", className)}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">{c.kicker}</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{c.text}</p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tiers.map((tier) => {
            const dict = c[tier.key];
            return (
              <TierCard
                key={tier.key}
                icon={tier.icon}
                badge={c.popular}
                title={dict.title}
                desc={dict.desc}
                features={dict.features}
                cta={c.cta}
                featured={tier.featured}
                art={
                  tier.key === "standard" ? (
                    <StandardCard businessName={tier.name} businessLogo={tier.logo} />
                  ) : tier.key === "pro" ? (
                    <ShowcaseCards
                      accent={tier.accent}
                      name={tier.name}
                      role={t.hero.cardRole}
                      phone="+243 990 000 000"
                      email="bonjour@studiokivu.cd"
                      mark={<AethelMark className="size-8 rounded-md bg-white/95 p-0.5" />}
                    />
                  ) : (
                    <ShowcaseCards
                      accent={tier.accent}
                      name={tier.name}
                      role={t.hero.cardRole}
                      phone="+243 990 000 000"
                      email="hello@novadesign.cd"
                      mark={
                        <span className="flex size-8 items-center justify-center rounded-full bg-white/95 font-display text-xs font-bold text-[#0e7490]">
                          N
                        </span>
                      }
                    />
                  )
                }
              />
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-xs text-muted-foreground"
        >
          <ElioMark className="size-4" />
          {c.note}
        </motion.p>
      </div>
    </section>
  );
}

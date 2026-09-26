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
 *  - Standard: black card with the business logo + Aethel logo, fixed design.
 *  - Pro: Aethel-branded card, customizable (accent, cover, layout of the page it opens).
 *  - Independent: fully custom on request, no Aethel mention.
 */

type CardArt = "standard" | "pro" | "independent";

function MiniCard({
  variant,
  businessLogo,
  businessName,
  accent,
}: {
  variant: CardArt;
  businessLogo?: string;
  businessName: string;
  accent: string;
}) {
  return (
    <div className="relative h-[120px] w-[190px] -rotate-[4deg] rounded-2xl bg-gradient-to-br from-[#111527] to-[#0b0e1a] p-4 shadow-[0_18px_40px_-18px_rgba(11,20,45,0.55)] ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        {/* Business logo (or monogram for the fully-custom tier) */}
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-white">
          {businessLogo ? (
            <img src={businessLogo} alt="" className="size-full object-cover" />
          ) : (
            <span className="font-display text-xs font-bold text-[#0b0e1a]">
              {businessName.slice(0, 1)}
            </span>
          )}
        </div>

        {variant === "standard" ? (
          /* Standard: Elio waves chip */
          <svg viewBox="0 0 24 24" className="size-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 8.5a7 7 0 0 1 0 7" />
            <path d="M9.5 6.5a10 10 0 0 1 0 11" />
            <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
          </svg>
        ) : variant === "pro" ? (
          /* Pro: Aethel mark printed on the card */
          <AethelMark className="size-7 rounded-md bg-white/95 p-0.5" />
        ) : (
          /* Independent: no branding, just the NFC symbol */
          <Nfc className="size-5 text-white/60" />
        )}
      </div>

      <p className="mt-5 font-display text-[13px] font-semibold leading-tight text-white">
        {businessName} <span className="text-white/60">{variant === "independent" ? "" : "· Elio"}</span>
      </p>
      <p className="text-[10px] text-white/55">/u/{businessName.toLowerCase().replace(/\s+/g, "-")}</p>

      {/* Accent strip: neutral on the standard card, client's accent on Pro & Independent */}
      <span
        className={cn(
          "absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full",
          variant === "standard" ? "bg-white/15" : "",
        )}
        style={variant === "standard" ? undefined : { background: accent }}
      />
    </div>
  );
}

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
    { key: "standard", icon: Nfc, accent: "#ffffff30", name: c.stdName },
    { key: "pro", icon: Wand2, featured: true, accent: "#1e4fd8", logo: photos.portraits, name: c.proName },
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
                  <MiniCard
                    variant={tier.key}
                    businessLogo={tier.logo}
                    businessName={tier.name}
                    accent={tier.accent}
                  />
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

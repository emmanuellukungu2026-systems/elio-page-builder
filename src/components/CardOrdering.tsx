import { AethelMark } from "@/components/AethelMark";
import { ElioMark } from "@/components/ElioMark";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, MessageCircle, Nfc, Sparkles, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * "Order your card" section — the three NFC card tiers shown side by side,
 * no scroll hijacking.
 *  - Standard: black cards (logos front, QR back), fixed design.
 *  - Pro: Aethel-branded geometric showcase, customizable.
 *  - Independent: fully custom luxury card, no Aethel mention.
 */

/* ------------------------------------------------------------------ */
/* Standard — two stacked black cards: logos front, QR back            */
/* ------------------------------------------------------------------ */

export function StandardCard({ businessName, businessLogo }: { businessName: string; businessLogo?: string }) {
  return (
    <div className="relative h-[288px] w-[230px]">
      {/* Front — business logo + Aethel logo side by side, three brand dots */}
      <div className="absolute left-0 top-0 flex h-[136px] w-[230px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#17171b] to-[#0a0a0c] shadow-[0_18px_40px_-18px_rgba(11,20,45,0.65)] ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-white">
            {businessLogo ? (
              <img src={businessLogo} alt="" className="size-full object-cover" />
            ) : (
              <span className="font-display text-xs font-bold text-[#0b0e1a]">
                {businessName.slice(0, 1)}
              </span>
            )}
          </div>
          <span className="h-7 w-px bg-white/15" />
          <AethelMark className="size-10 rounded-xl bg-white/95 p-1" />
        </div>
        <div className="mt-3 flex gap-1.5">
          <span className="size-1.5 rounded-full bg-[#ea4335]" />
          <span className="size-1.5 rounded-full bg-[#34a853]" />
          <span className="size-1.5 rounded-full bg-[#4285f4]" />
        </div>
      </div>

      {/* Back — QR code centered, contactless mark fused inside */}
      <div className="absolute left-4 top-[152px] flex h-[136px] w-[222px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#131317] to-[#08080a] shadow-[0_18px_40px_-18px_rgba(11,20,45,0.65)] ring-1 ring-white/10">
        <svg viewBox="0 0 33 33" className="size-[76px]" aria-hidden="true">
          <defs>
            <pattern id="qrCells" width="5" height="5" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="2" height="2" fill="white" />
              <rect x="3" y="1" width="1.6" height="1.6" fill="white" />
              <rect x="1" y="3" width="1.8" height="1.8" fill="white" />
              <rect x="4" y="4" width="1.2" height="1.2" fill="white" />
            </pattern>
          </defs>
          <rect x="6" y="6" width="21" height="21" fill="url(#qrCells)" />
          <g fill="white">
            <rect width="7" height="7" />
            <rect x="26" width="7" height="7" />
            <rect y="26" width="7" height="7" />
          </g>
          <g fill="#0c0f16">
            <rect x="1" y="1" width="5" height="5" />
            <rect x="27" y="1" width="5" height="5" />
            <rect x="1" y="27" width="5" height="5" />
          </g>
          <g fill="white">
            <rect x="2.5" y="2.5" width="2" height="2" />
            <rect x="28.5" y="2.5" width="2" height="2" />
            <rect x="2.5" y="28.5" width="2" height="2" />
          </g>
          <circle cx="16.5" cy="16.5" r="4.2" fill="#0c0f16" />
          <g
            transform="translate(16.5 16.5) scale(0.32) translate(-9.5 -12)"
            stroke="white"
            strokeWidth="1.9"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M6 8.5a7 7 0 0 1 0 7" />
            <path d="M9.5 6.5a10 10 0 0 1 0 11" />
            <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pro — two overlapping cards, geometric print-mockup style           */
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

export function ShowcaseCards({
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
/* Independent — single luxury card, dark silk waves + gold mark       */
/* ------------------------------------------------------------------ */

function GoldDelta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="indGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8c877" />
          <stop offset="0.55" stopColor="#c9a24b" />
          <stop offset="1" stopColor="#9a742a" />
        </linearGradient>
      </defs>
      <path d="M12 2.5 21.5 21h-19Z" fill="url(#indGold)" />
      <path d="M12 9.5 17.5 20h-11Z" fill="#161616" />
    </svg>
  );
}

export function IndependentCard({ company, person, role }: { company: string; person: string; role: string }) {
  const [line1, line2] = company.split(" ");
  return (
    <div className="relative h-[168px] w-[276px] overflow-hidden rounded-2xl bg-[#141414] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
      {/* Dark silk waves */}
      <svg viewBox="0 0 276 168" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="indBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d1d1d" />
            <stop offset="0.5" stopColor="#0f0f0f" />
            <stop offset="1" stopColor="#262626" />
          </linearGradient>
          <linearGradient id="indWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a3a3a" stopOpacity="0" />
            <stop offset="0.35" stopColor="#4a4a4a" />
            <stop offset="0.7" stopColor="#2c2c2c" />
            <stop offset="1" stopColor="#3f3f3f" stopOpacity="0" />
          </linearGradient>
          <filter id="indSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        </defs>
        <rect width="276" height="168" fill="url(#indBase)" />
        <g filter="url(#indSoft)" fill="none" strokeLinecap="round">
          <path d="M-20 28C50 4 110 58 170 30s80-16 130-2" stroke="url(#indWave)" strokeWidth="14" opacity="0.5" />
          <path d="M-20 52C60 24 120 84 180 52s70-18 120-4" stroke="url(#indWave)" strokeWidth="10" opacity="0.4" />
          <path d="M-20 78C40 58 130 104 190 74s60-12 110-6" stroke="url(#indWave)" strokeWidth="16" opacity="0.35" />
          <path d="M-20 104C60 76 110 132 180 100s70-14 120-2" stroke="url(#indWave)" strokeWidth="9" opacity="0.45" />
          <path d="M-20 126C50 104 120 152 186 124s70-10 114-4" stroke="url(#indWave)" strokeWidth="12" opacity="0.3" />
          <path d="M-20 148C60 128 130 168 200 146s60-6 100-4" stroke="url(#indWave)" strokeWidth="8" opacity="0.35" />
        </g>
      </svg>

      {/* Company: gold delta + two-line wordmark */}
      <div className="absolute left-5 top-4 flex items-center gap-2">
        <GoldDelta className="size-7" />
        <div className="leading-tight">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-white">{line1}</p>
          {line2 && <p className="text-[10px] font-semibold tracking-[0.14em] text-white">{line2}</p>}
        </div>
      </div>

      {/* Contactless waves, gold */}
      <svg
        viewBox="0 0 24 24"
        className="absolute right-5 top-4 size-6 text-[#d9b45e]"
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

      {/* Centered identity */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
        <p className="font-display text-lg font-light tracking-[0.28em] text-white">{person}</p>
        <span className="mx-auto mt-2 block h-px w-24 bg-[#c9a24b]/70" />
        <p className="mt-2 text-[11px] font-light tracking-[0.08em] text-white/85">{role}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Uniform-fit preview (form picker + dashboard card panel)             */
/* ------------------------------------------------------------------ */

/** Natural render size of each card visual, used to scale previews uniformly. */
export const CARD_SIZES = {
  standard: { w: 230, h: 288 },
  pro: { w: 240, h: 184 },
  independent: { w: 276, h: 168 },
} as const;

export type CardTier = keyof typeof CARD_SIZES;

/**
 * Renders a card visual scaled so it is exactly `height` px tall — width
 * follows the card's real aspect ratio, so nothing is stretched or clipped.
 * The layout box equals the scaled size, so flex centering works cleanly.
 */
export function CardFit({
  tier,
  height,
  children,
  className,
}: {
  tier: CardTier;
  height: number;
  children: ReactNode;
  className?: string;
}) {
  const { w, h } = CARD_SIZES[tier];
  const s = height / h;
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div style={{ width: Math.round(w * s), height: Math.round(h * s) }}>
        <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: "top left" }}>
          {children}
        </div>
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
    <div
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
        <h3 className="font-display text-base font-semibold sm:text-lg">{title}</h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {desc}
      </p>
      {/* Fixed-height art stage: the card visual is scaled down to fit. */}
      <div className="my-3 flex h-[160px] justify-center overflow-visible sm:h-[220px] lg:h-[260px]">
        <div className="origin-top scale-[0.55] sm:scale-[0.72] lg:scale-[0.86]">{art}</div>
      </div>

      <ul className="mt-auto space-y-2 text-sm sm:space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-foreground/85">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href={waLink(CONCIERGE_WHATSAPP, `Hello Aethel team 👋 I'd like to order a card — tier: ${title}`)}
        target="_blank"
        rel="noreferrer"
        className="btn-glow mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-500"
      >
        <MessageCircle className="size-4" /> {cta}
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section layout — plain grid, no scroll hijacking                    */
/* ------------------------------------------------------------------ */

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

  const renderCard = (tier: (typeof tiers)[number]) => {
    const dict = c[tier.key];
    const art =
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
        <IndependentCard company={tier.name} person="KATE MILLER" role="Product Manager" />
      );
    return (
      <TierCard
        icon={tier.icon}
        badge={c.popular}
        title={dict.title}
        desc={dict.desc}
        features={dict.features}
        art={art}
        cta={c.cta}
        featured={tier.featured}
      />
    );
  };

  return (
    <section id="cards" className={cn("relative px-4 py-24 sm:px-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">{c.kicker}</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h2>
        <p className="mt-4 leading-7 text-muted-foreground">{c.text}</p>
      </motion.div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.key} className="flex">
            {renderCard(tier)}
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <ElioMark className="size-4" />
        {c.note}
      </p>
    </section>
  );
}

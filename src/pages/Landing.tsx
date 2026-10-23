import { AdSwirl } from "@/components/AdSwirl";
import { AethelMark } from "@/components/AethelMark";
import { CardOrdering } from "@/components/CardOrdering";
import { NfcLinkCard } from "@/components/NfcLinkCard";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { photoStrip, photos } from "@/lib/photos";
import { useQuery } from "convex/react";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { ArrowRight, LayoutGrid, MessageCircle, Nfc, Store } from "lucide-react";
import { Link } from "react-router";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { cn } from "@/lib/utils";

/* Flat blue field for the Fedora-style hero: one confident colour, soft light
   from the top, nothing else. The dark lineup section shows through the
   diagonal clip at the bottom. */
const heroFieldStyle = {
  background: [
    "radial-gradient(760px 460px at 50% -6%, rgba(255, 255, 255, 0.18), transparent 62%)",
    "#2f62d9",
  ].join(", "),
};

/* Deep-blue poster panel shared by the hero and the closing CTA. */
const adPanelStyle = {
  background: [
    "radial-gradient(820px 560px at 16% 26%, rgba(66, 126, 255, 0.5), transparent 64%)",
    "radial-gradient(640px 460px at 92% 88%, rgba(11, 42, 107, 0.85), transparent 62%)",
    "linear-gradient(150deg, #06143a 0%, #0d2f80 50%, #071a4d 100%)",
  ].join(", "),
};

export default function Landing() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  // Signed-in visitors who already have a page get "Check your page" instead
  // of "Create your page" — it opens their live page.
  const myPage = useQuery(api.pages.getMyPage);
  const pageHref = myPage ? `/u/${myPage.username}` : "/auth?returnTo=%2Fdashboard";

  const featureKeys = [
    "profile",
    "work",
    "ideas",
    "search",
    "comments",
    "qr",
  ] as const;

  // The three offerings shown under the hero diagonal (Fedora-style lineup).
  const productCards = [
    { key: "page" as const, accent: "#6ee7a0", Icon: LayoutGrid, href: pageHref },
    { key: "card" as const, accent: "#7db4ff", Icon: Nfc, href: "#cards" },
    {
      key: "concierge" as const,
      accent: "#ffbe6f",
      Icon: MessageCircle,
      href: "/services",
    },
  ];

  return (
    <div className="center-mobile relative min-h-screen">

      {/* ================= HERO — flat blue field, Fedora-style ================= */}
      <section className="relative bg-[#06143a]">
        {/* Transparent over the poster; the white bar fades in on scroll. */}
        <Nav overlay />
        <div
          id="main"
          className="hero-diagonal relative flex min-h-[88svh] flex-col overflow-hidden"
          style={heroFieldStyle}
        >
          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-10 pt-28 sm:px-10 sm:pt-32 lg:px-14">
            {/* The circle badge — the "latest release" disc of the poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto flex size-40 flex-col items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:size-52"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/85 sm:text-xs">
                {t.hero.circleLabel}
              </span>
              <span className="mt-1 font-display text-4xl font-bold text-white sm:text-5xl">
                {t.hero.circleValue}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto mt-10 max-w-[18ch] text-center font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-white"
            >
              <span className="text-[#bcd7ff]">{t.hero.titleA}</span>{" "}
              {t.hero.titleB}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto mt-5 max-w-xl text-center text-lg leading-8 text-white/80"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                size="lg"
                className="h-12 rounded-2xl bg-white px-7 text-base font-semibold text-[#0b1020] shadow-lg hover:bg-white/90"
                asChild
              >
                <Link to={pageHref}>
                  {myPage ? t.hero.ctaVerify : t.hero.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-white/40 bg-white/10 px-7 text-base text-white hover:border-white/60 hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link to="/directory">{t.hero.secondary}</Link>
              </Button>
            </motion.div>
          </div>

          {/* Foot of the field — the strip of details, kept from the poster */}
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 pb-20 pt-6 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:pb-28 sm:text-sm lg:px-14">
            <span>{t.hero.note}</span>
            <a
              href={waLink(CONCIERGE_WHATSAPP, "Hello Aethel team 👋 I'd like my own Elio page.")}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              {t.aethelTeam.cta}
            </a>
          </div>
        </div>

        {/* ============ LINEUP — the three offerings under the diagonal ============ */}
        <div className="pb-20 pt-4 sm:pb-28 sm:pt-8">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:px-10 md:grid-cols-3 lg:px-14">
            {productCards.map(({ key, accent, Icon, href }, i) => {
              const cardBody = (
                <>
                  <span
                    className="flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${accent}26`, color: accent }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    elio
                  </span>
                  <span className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    {t.products[key].name}
                  </span>
                  <h2
                    className="mt-4 font-display text-2xl font-bold leading-snug sm:text-[1.75rem]"
                    style={{ color: accent }}
                  >
                    {t.products[key].title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {t.products[key].text}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-white/90 transition-transform duration-300 group-hover:translate-x-1.5">
                    {t.products[key].link} <ArrowRight className="size-4" />
                  </span>
                </>
              );
              const cardClass =
                "group flex h-full flex-col rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 transition-[background-color,box-shadow] duration-300 hover:bg-white/[0.08] hover:shadow-[0_28px_60px_-28px_var(--glow)] hover:ring-white/25 sm:p-7";
              return (
                /* "Claude-style" card motion: spring entrance (fade + rise +
                   slight scale, staggered per column) and a hover lift. The
                   accent colour doubles as a soft glow under the card. */
                <motion.div
                  key={key}
                  className="h-full"
                  style={{ "--glow": `${accent}66` } as CSSProperties}
                  initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.96 }}
                  whileInView={
                    reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
                  }
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    type: "spring",
                    stiffness: 110,
                    damping: 18,
                    delay: 0.09 * i,
                  }}
                  whileHover={reduceMotion ? undefined : { y: -10 }}
                >
                  {/* In-page anchors (#cards) must be native links so the
                      browser scrolls to the section itself. */}
                  {href.startsWith("#") ? (
                    <a href={href} className={cardClass}>
                      {cardBody}
                    </a>
                  ) : (
                    <Link to={href} className={cardClass}>
                      {cardBody}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= MARQUEE BAND ================= */}
      <Marquee items={t.marquee.a} tone="dark" speed={52} />

      {/* ================= HOW ================= */}
      <section id="how" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
            {t.how.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.how.title}
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
          {t.how.items.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="h-full border-t border-border/70 pt-5">
                <span className="font-display text-sm font-semibold text-ember">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
            {t.features.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.features.title}
          </h2>
        </Reveal>

        {/* Editorial list — hairline rules instead of six identical cards */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((key, i) => (
            <Reveal key={key} delay={i * 0.05}>
              <div className="border-t border-border/70 py-5">
                <div className="flex items-baseline justify-center gap-2 sm:justify-between sm:gap-4">
                  <h3 className="font-display text-base font-semibold">
                    {t.features[key].title}
                  </h3>
                  <span className="font-display text-xs font-semibold text-ember">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t.features[key].text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
            {t.gallery.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.gallery.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground sm:mx-0">{t.gallery.text}</p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {photoStrip.map((src, i) => (
            <Reveal key={src} delay={i * 0.05}>                <figure
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border/50",
                    i % 4 === 1 || i % 4 === 2 ? "lg:mt-8" : "",
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </figure>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-6xl">
          <div className="glass relative overflow-hidden rounded-2xl">
            <img
              src={photos.team}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/80 to-background/40" />
            <p className="relative mx-auto max-w-md px-6 py-10 font-display text-lg font-semibold leading-relaxed sm:mx-0 sm:px-10 sm:py-14 sm:text-xl">
              {t.gallery.band}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ================= CARD ORDERING ================= */}
      <CardOrdering />

      {/* ================= QR ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
              {t.qr.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.qr.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground sm:mx-0">{t.qr.text}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {t.qr.bullets.map((b) => (
                <li key={b} className="flex items-center justify-center gap-3 text-foreground/85 sm:justify-start">
                  <span className="flex size-5 items-center justify-center rounded-full bg-ember/15">
                    <Nfc className="size-3 text-ember" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Button className="btn-glow mt-8 rounded-2xl" asChild>
              <Link to="/auth?returnTo=%2Fdashboard">
                {t.qr.cta} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto w-full max-w-sm">
            <div className="[perspective:1000px]">
              <TiltCard max={6}>
                <NfcLinkCard username="atelier-kivu" />
              </TiltCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= DIRECTORY CTA ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-4xl">
          <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-10">
            <img
              src={photos.craft}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
            <div className="relative grid items-center gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
                  {t.directoryCta.kicker}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                  {t.directoryCta.title}
                </h2>
                <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground sm:mx-0">
                  {t.directoryCta.text}
                </p>
              </div>
              <Button size="lg" className="btn-glow h-12 rounded-2xl px-7" asChild>
                <Link to="/directory">
                  <Store className="size-4" /> {t.directoryCta.cta}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= CONCIERGE TEASER ================= */}
      <section className="relative px-4 py-16 sm:px-6">
        <Reveal className="mx-auto grid max-w-6xl gap-x-10 gap-y-6 sm:grid-cols-3">
          {t.services.steps.map((s) => (
            <div key={s.title} className="border-t border-border/70 pt-5">
              <span className="font-display text-sm font-semibold text-ember">{s.title}</span>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">{t.services.subtitle}</p>
          <Button variant="outline" className="btn-outline-glass mt-4 rounded-xl" asChild>
            <Link to="/services">{t.nav.services}</Link>
          </Button>
        </Reveal>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
              {t.faq.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.faq.title}
            </h2>
            <p className="mx-auto mt-4 max-w-sm leading-7 text-muted-foreground sm:mx-0">{t.faq.sub}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="glass rounded-2xl px-6">
              {t.faq.items.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-border/60">
                  <AccordionTrigger className="justify-center gap-2 text-center text-sm font-medium sm:justify-between sm:gap-4 sm:text-left sm:text-base">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ================= ABOUT AETHEL ================= */}
      <section id="about" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
              {t.about.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.about.title}
            </h2>
            <AethelMark className="mt-8 hidden h-10 w-auto opacity-90 lg:block" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto max-w-xl leading-7 text-muted-foreground sm:mx-0">{t.about.text}</p>
            <div className="mt-8 grid gap-x-10 sm:grid-cols-3">
              {t.about.items.map((item) => (
                <div key={item.title} className="border-t border-border/70 pt-5">
                  <h3 className="font-display text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= WORK WITH AETHEL TEAM ================= */}
      <section id="aethel-team" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <div className="glass relative overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-14">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
                {t.aethelTeam.kicker}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t.aethelTeam.title}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">{t.aethelTeam.text}</p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {t.aethelTeam.items.map((item) => (
                <div key={item.title} className="border-t border-border/70 pt-5">
                  <h3 className="font-display text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <Button
                size="lg"
                className="btn-glow h-12 rounded-xl bg-emerald-600 px-8 text-base text-white hover:bg-emerald-500"
                asChild
              >
                <a
                  href={waLink(
                    CONCIERGE_WHATSAPP,
                    "Hello Aethel team 👋 I'd like to work with you / join the team — here's who I am and what I do:",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" /> {t.aethelTeam.cta}
                </a>
              </Button>
              <AethelMark className="h-10 w-auto opacity-80" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= MARQUEE BAND ================= */}
      <Marquee items={t.marquee.b} speed={44} />

      {/* ================= FINAL CTA ================= */}
      <section className="relative px-4 pb-8 pt-10 sm:px-6">
        <Reveal className="mx-auto max-w-4xl">            <div
              className="relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12"
              style={adPanelStyle}
            >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-white/15"
            />
            <AdSwirl className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 text-white/25" />
            <AdSwirl className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 -rotate-90 text-white/15" />
            <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.finalCta.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/75">{t.finalCta.text}</p>
            <div className="relative mt-8 flex justify-center">
              <Button
                size="lg"
                className="h-12 rounded-2xl bg-white px-8 text-base font-semibold text-[#0b1020] shadow-lg hover:bg-white/90"
                asChild
              >
                <Link to={pageHref}>
                  {myPage ? t.finalCta.ctaVerify : t.finalCta.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}

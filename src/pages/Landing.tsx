import { AdSwirl } from "@/components/AdSwirl";
import { AethelMark } from "@/components/AethelMark";
import { CardOrdering } from "@/components/CardOrdering";
import {
  CardFace,
  CardLink,
  CinematicStage,
  type StageItem,
} from "@/components/CinematicStage";
import { NfcLinkCard } from "@/components/NfcLinkCard";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { ModelPreview } from "@/components/ModelPreview";
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
import { photos } from "@/lib/photos";
import { MODELS, MODEL_ORDER } from "@/lib/portfolio-models";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
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

/* The gallery keeps three prints — the rest of the strip is distributed
   across the sections above and below, so imagery reads across the page
   instead of piling up in one block. */
const galleryPhotos = [
  photos.studio,
  photos.film,
  photos.hands,
];

/* Scattered pinboard layout for the gallery strip: vertical offset, crop
   ratio and a slight tilt per print. Offsets only kick in at the breakpoint
   where the column count makes them meaningful. */
const scatter = [
  { y: "lg:mt-2", ratio: "aspect-[4/5]", tilt: "-rotate-1" },
  { y: "mt-8 lg:mt-24", ratio: "aspect-[3/4]", tilt: "rotate-[1.5deg]" },
  { y: "mt-8 lg:mt-10", ratio: "aspect-square", tilt: "rotate-1" },
] as const;

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
  // Signed-in visitors who already have a page get "Check your page" instead
  // of "Create your page" — it opens their live page.
  const myPage = useQuery(api.pages.getMyPage);
  // Live platform counter shown in the hero badge, next to the Aethel mark.
  const stats = useQuery(api.pages.platformStats);
  const pageHref = myPage ? `/u/${myPage.username}` : "/auth?returnTo=%2Fdashboard";

  const featureKeys = [
    "profile",
    "work",
    "ideas",
    "search",
    "comments",
    "qr",
  ] as const;

  // The three offerings under the hero diagonal, staged by CinematicStage.
  const stageItems: StageItem[] = (
    [
      { key: "page", accent: "#6ee7a0", Icon: LayoutGrid, href: pageHref },
      { key: "card", accent: "#7db4ff", Icon: Nfc, href: "#cards" },
      { key: "concierge", accent: "#ffbe6f", Icon: MessageCircle, href: "/services" },
    ] as const
  ).map(({ key, accent, Icon, href }) => ({
    key,
    accent,
    Icon,
    href,
    name: t.products[key].name,
    title: t.products[key].title,
    text: t.products[key].text,
    link: t.products[key].link,
  }));

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
            {/* The circle badge — Aethel's own introduction, in the place of
                the poster's "latest release" disc */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto flex size-48 flex-col items-center justify-center rounded-full bg-white/15 px-7 text-center ring-1 ring-white/25 backdrop-blur-md sm:size-64 sm:px-10"
            >
              {/* White Aethel mark + the live number of people on the platform */}
              <AethelMark className="size-9 brightness-0 invert drop-shadow-sm sm:size-12" />
              <p className="mt-3.5 font-display text-3xl font-bold tabular-nums leading-none text-white sm:text-4xl">
                {stats ? stats.users.toLocaleString() : "—"}
              </p>
              <p className="mt-2 text-[10px] font-medium leading-[13px] text-white/75 sm:text-xs">
                {t.hero.usersLabel}
              </p>
            </motion.div>

            {/* Welcome — Aethel greets you on its very first product */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto mt-7 max-w-lg text-center text-[15px] leading-6 text-white/85 sm:text-base"
            >
              <span className="font-semibold text-white">{t.hero.welcome}</span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto mt-6 max-w-[18ch] text-center font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-white"
            >
              <span className="text-[#bcd7ff]">{t.hero.titleA}</span>{" "}
              {t.hero.titleB}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.21, 0.6, 0.35, 1] }}
              className="mx-auto mt-5 max-w-xl text-center text-lg leading-8 text-white/80"
            >
              {t.hero.subtitle}
            </motion.p>

          <motion.div
            data-tour="hero-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: [0.21, 0.6, 0.35, 1] }}
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

          {/* Foot of the field — frosted glass strip carrying the details */}
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-10 sm:pb-28 lg:px-14">
            <div className="flex flex-col gap-2 rounded-2xl bg-white/[0.08] px-4 py-3.5 text-xs text-white/80 ring-1 ring-white/20 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3 sm:text-sm">
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
        </div>

        {/* ============ LINEUP — the scroll-driven product sequence ============ */}
        <CinematicStage
          items={stageItems}
          className="pt-4 sm:pt-8"
          renderCard={(item, face) => (
            <CardLink href={item.href}>
              <CardFace
                item={item}
                title={face.title}
                titleStyle={face.titleStyle}
                faceStyle={face.bodyStyle}
              />
            </CardLink>
          )}
        />
      </section>


      {/* ================= MARQUEE BAND ================= */}
      <Marquee items={t.marquee.a} tone="dark" speed={52} tilt={-2.5} />

      {/* ================= HOW ================= */}
      <section id="how" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto grid max-w-6xl items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
              {t.how.kicker}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.how.title}
            </h2>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-border/50 lg:-rotate-1">
            <img
              src={photos.work}
              alt=""
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
          </figure>
        </Reveal>
        <div data-tour="how" className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
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
        {/* Pinboard: every print keeps its own offset, ratio and a whisper of
            tilt, so the strip reads like photos laid out on a table rather
            than a grid of identical tiles. */}
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {galleryPhotos.map((src, i) => {
            const { y, ratio, tilt } = scatter[i];
            return (
              <Reveal key={src} delay={i * 0.05} className={y}>
                <figure
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border/50",
                    tilt,
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className={cn(
                      "w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      ratio,
                    )}
                  />
                </figure>
              </Reveal>
            );
          })}
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

      {/* ================= PAGE STYLES ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ember">
            {t.models.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.models.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground sm:mx-0">
            {t.models.sub}
          </p>
        </Reveal>

        <div data-tour="models" className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODEL_ORDER.map((id, i) => (
            <Reveal key={id} delay={i * 0.07}>
              <Link
                to="/services#order"
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left transition-colors hover:border-primary/50"
              >
                <span className="relative block">
                  <ModelPreview model={id} className="rounded-xl" />
                  <span className="absolute right-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground backdrop-blur">
                    #{i + 1}
                  </span>
                  {id === "editorial" && (
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                      {t.services.form.recommended}
                    </span>
                  )}
                </span>
                <span className="flex items-baseline justify-between gap-2 px-1">
                  <span className="font-display text-sm font-semibold group-hover:text-primary">
                    {MODELS[id].label}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </span>
                <span className="px-1 pb-1 text-xs leading-5 text-muted-foreground">
                  {t.services.form.modelDescs[id]}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-6xl text-center">
          <Button className="btn-glow rounded-2xl" asChild>
            <Link to="/services#order">
              {t.models.cta} <ArrowRight className="size-4" />
            </Link>
          </Button>
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
            <div data-tour="nfc" className="[perspective:1000px]">
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
            <figure className="mt-8 max-w-sm overflow-hidden rounded-2xl border border-border/50 rotate-1">
              <img
                src={photos.space}
                alt=""
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
            </figure>
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
      <Marquee items={t.marquee.b} speed={44} tilt={2.5} />

      {/* ================= FINAL CTA ================= */}
      <section className="relative px-4 pb-8 pt-10 sm:px-6">
        <Reveal className="mx-auto max-w-4xl">            <div
              data-tour="final"
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

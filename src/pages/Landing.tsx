import { Atmosphere } from "@/components/Atmosphere";
import { AethelMark } from "@/components/AethelMark";
import { CardOrdering } from "@/components/CardOrdering";
import { NfcHeroVisual } from "@/components/NfcHeroVisual";
import { NfcLinkCard } from "@/components/NfcLinkCard";
import { Footer } from "@/components/Footer";
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
import { motion } from "framer-motion";
import {
  ArrowRight,
  FolderGit2,
  Lightbulb,
  MessageCircle,
  Nfc,
  Search,
  Sparkles,
  Store,
} from "lucide-react";
import { Link } from "react-router";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { cn } from "@/lib/utils";

export default function Landing() {
  const { t } = useI18n();
  // Signed-in visitors who already have a page get "Check your page" instead
  // of "Create your page" — it opens their live page.
  const myPage = useQuery(api.pages.getMyPage);
  const pageHref = myPage ? `/u/${myPage.username}` : "/auth?returnTo=%2Fdashboard";

  const featureCards = [
    { icon: Store, key: "profile" as const },
    { icon: FolderGit2, key: "work" as const },
    { icon: Lightbulb, key: "ideas" as const },
    { icon: Search, key: "search" as const },
    { icon: MessageCircle, key: "comments" as const },
    { icon: Nfc, key: "qr" as const },
  ];

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      {/* ================= HERO ================= */}
      <section className="relative px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] sm:rounded-[2.75rem]">
          {/* Blue → magenta bloom filling the panel */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(180deg, rgba(6,10,26,0.45) 0%, rgba(6,10,26,0.18) 45%, rgba(6,10,26,0.5) 100%)",
                "radial-gradient(900px 560px at 88% 12%, rgba(224, 72, 140, 0.45), transparent 62%)",
                "radial-gradient(760px 620px at 4% 95%, rgba(79, 125, 255, 0.5), transparent 60%)",
                "linear-gradient(145deg, #0a1130 0%, #131c52 48%, #23103f 100%)",
              ].join(", "),
            }}
          />
          <div className="relative px-5 py-14 sm:px-10 sm:py-16 lg:px-14">
            <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/85"
                >
                  <Sparkles className="size-3.5 text-white" />
                  {t.hero.badge}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
                  className="mt-6 font-display text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.03] tracking-tight text-white"
                >
                  {t.hero.titleA}
                  <br />
                  {t.hero.titleB}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
                  className="mt-6 max-w-lg text-lg leading-8 text-white/75"
                >
                  {t.hero.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
                  className="mt-9 flex flex-wrap items-center gap-3"
                >
                  <Button
                    size="lg"
                    className="h-12 rounded-xl bg-white px-7 text-base font-semibold text-[#0b1020] hover:bg-white/90"
                    asChild
                  >
                    <Link to={pageHref}>
                      {myPage ? t.hero.ctaVerify : t.hero.cta} <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-xl border-white/30 bg-white/10 px-7 text-base text-white hover:bg-white/20 hover:text-white"
                    asChild
                  >
                    <a href="/directory">{t.hero.secondary}</a>
                  </Button>
                </motion.div>
              </div>

              {/* NFC-ad moment: card tapping the phone */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
                className="relative mx-auto w-full max-w-md"
              >
                <NfcHeroVisual />
              </motion.div>
            </div>

            {/* Meta row — the bottom of the panel */}
            <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
              <span>{t.hero.note}</span>
              <span className="hidden sm:block">—</span>
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
      </section>

      {/* ================= HOW ================= */}
      <section id="how" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">{t.how.kicker}</p>
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
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan">
            {t.features.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.features.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.06}>
              <div className="glass h-full rounded-2xl p-6 transition-colors duration-200 hover:bg-white/[0.05]">
                <div className="flex size-10 items-center justify-center rounded-xl bg-ember/15 text-ember">
                  <c.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {t.features[c.key].title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t.features[c.key].text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan">
            {t.gallery.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.gallery.title}
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{t.gallery.text}</p>
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
            <p className="relative max-w-md px-6 py-10 font-display text-lg font-semibold leading-relaxed sm:px-10 sm:py-14 sm:text-xl">
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
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">
              {t.qr.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.qr.title}
            </h2>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">{t.qr.text}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {t.qr.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-foreground/85">
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
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan">
                  {t.directoryCta.kicker}
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                  {t.directoryCta.title}
                </h2>
                <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
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
      <section className="relative px-4 py-10 sm:px-6">
        <Reveal className="mx-auto grid max-w-6xl gap-x-10 gap-y-6 md:grid-cols-3">
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
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">{t.faq.kicker}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.faq.title}
            </h2>
            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">{t.faq.sub}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="glass rounded-2xl px-6">
              {t.faq.items.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-border/60">
                  <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
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

      {/* ================= WORK WITH AETHEL TEAM ================= */}
      <section id="aethel-team" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <div className="glass relative overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-14">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">
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
            <div className="mt-10 flex flex-wrap items-center gap-4">
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

      {/* ================= FINAL CTA ================= */}
      <section className="relative px-4 pb-8 pt-10 sm:px-6">
        <Reveal className="mx-auto max-w-4xl">
          <div className="glass relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12">
            <h2 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t.finalCta.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">{t.finalCta.text}</p>
            <div className="relative mt-8 flex justify-center">
              <Button size="lg" className="btn-glow h-12 rounded-xl px-8 text-base" asChild>
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

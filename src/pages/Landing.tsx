import { Atmosphere } from "@/components/Atmosphere";
import { ElioCardPreview } from "@/components/ElioCardPreview";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { QrShowcase } from "@/components/QrShowcase";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  FolderGit2,
  Images,
  Lightbulb,
  MessageCircle,
  Nfc,
  Search,
  QrCode,
  ScanLine,
  Sparkles,
  Store,
} from "lucide-react";
import { Link } from "react-router";

export default function Landing() {
  const { t } = useI18n();

  const featureCards = [
    { icon: Store, key: "profile" as const },
    { icon: FolderGit2, key: "work" as const },
    { icon: Lightbulb, key: "ideas" as const },
    { icon: Search, key: "search" as const },
    { icon: MessageCircle, key: "comments" as const },
    { icon: QrCode, key: "qr" as const },
  ];

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-4 pt-36 pb-24 sm:px-6">
        <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"
            >
              <Sparkles className="size-3.5 text-ember" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {t.hero.titleA}
              <br />
              <span className="text-gradient">{t.hero.titleB}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" className="btn-glow h-12 rounded-2xl px-7 text-base" asChild>
                <Link to="/auth?returnTo=%2Fdashboard">
                  {t.hero.cta} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-outline-glass h-12 rounded-2xl border-border/70 px-7 text-base backdrop-blur"
                asChild
              >
                <a href="/directory">{t.hero.secondary}</a>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-5 text-sm text-muted-foreground/70"
            >
              {t.hero.note}
            </motion.p>
          </div>

          {/* Tilted floating business card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
            className="relative mx-auto w-full max-w-sm [perspective:1200px]"
          >
            <div className="animate-floaty">
              <TiltCard max={7}>
                <ElioCardPreview />
              </TiltCard>
            </div>
            <div className="glass absolute -left-6 top-10 -z-10 hidden h-40 w-40 rotate-[-8deg] rounded-3xl sm:block" />
            <div className="glass absolute -right-5 -bottom-8 -z-10 h-28 w-48 rotate-[6deg] rounded-3xl" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 flex justify-center text-muted-foreground/60"
        >
          <ChevronDown className="size-5 animate-bounce" />
        </motion.div>
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
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="glass h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
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
              <div className="glass h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                  <c.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">
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
                <QrShowcase username="atelier-kivu" />
              </TiltCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= DIRECTORY CTA ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-4xl">
          <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
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
        <Reveal className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {t.services.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="glass h-full rounded-3xl p-6">
                <span className="font-display text-sm font-semibold text-ember">{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-6xl">
          <div className="glass rounded-3xl p-6 text-center">
            <p className="text-sm text-muted-foreground">{t.services.subtitle}</p>
            <Button variant="outline" className="btn-outline-glass mt-4 rounded-2xl" asChild>
              <Link to="/services">{t.nav.services}</Link>
            </Button>
          </div>
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
            <Accordion type="single" collapsible className="glass rounded-3xl px-6">
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

      {/* ================= FINAL CTA ================= */}
      <section className="relative px-4 pb-8 pt-10 sm:px-6">
        <Reveal className="mx-auto max-w-4xl">
          <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden="true" />
            <h2 className="relative font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t.finalCta.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">{t.finalCta.text}</p>
            <div className="relative mt-8 flex justify-center">
              <Button size="lg" className="btn-glow h-12 rounded-2xl px-8 text-base" asChild>
                <Link to="/auth?returnTo=%2Fdashboard">
                  {t.finalCta.cta} <ArrowRight className="size-4" />
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

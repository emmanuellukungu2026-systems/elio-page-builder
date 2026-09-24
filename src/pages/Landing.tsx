import { Atmosphere } from "@/components/Atmosphere";
import { ElioCardPreview } from "@/components/ElioCardPreview";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { QrShowcase } from "@/components/QrShowcase";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { ElioMark } from "@/components/ElioMark";
import { Button } from "@/components/ui/button";
import { PACKS } from "@/lib/elio";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  FolderGit2,
  GraduationCap,
  Images,
  Lightbulb,
  Nfc,
  QrCode,
  ScanLine,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router";

const FAQ_ITEMS = [
  {
    q: "Do I need to know how to code or design?",
    a: "No. Elio is built so anyone can create a beautiful personal page in minutes. If you can fill in a form, you can build your Elio. And if you'd rather have it done for you, our team can craft it with you through our services.",
  },
  {
    q: "How does the QR code and NFC card work?",
    a: "Every Elio page comes with a personal link and a QR code. You can print it on your CV, business card or portfolio — or order an NFC card that opens your page when tapped on a phone. One scan, and people discover everything about you.",
  },
  {
    q: "What can I put on my page?",
    a: "Your profile, your story, your projects, a visual portfolio, ideas in progress, services and pricing, plus links to your email, WhatsApp, LinkedIn, Instagram and anything else. Everything that makes you, you.",
  },
  {
    q: "What's my page address?",
    a: "Your page lives at your own username — like elio.aethel.io/emmanuel. The username becomes part of your digital identity, so choose something that feels like you.",
  },
  {
    q: "Can Elio replace my website?",
    a: "For most people, yes. Instead of scattering your work across Instagram, Google Drive and a CV, Elio brings it together in one simple space you fully control.",
  },
];

export default function Landing() {
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
              Elio by Aethel Technologies
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Your work.
              <br />
              Your story.
              <br />
              <span className="text-gradient">Your space.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground"
            >
              Create a personal space that feels like you — your projects, portfolio,
              ideas and contact details in one beautiful page. One link, one QR code,
              shared anywhere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" className="btn-glow h-12 rounded-2xl px-7 text-base" asChild>
                <Link to="/auth?returnTo=%2Fdashboard">
                  Create your Elio <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-border/70 bg-white/[0.03] px-7 text-base backdrop-blur hover:bg-white/[0.07]"
                asChild
              >
                <a href="/#how">Explore Elio</a>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-5 text-sm text-muted-foreground/70"
            >
              Free to start · No code needed · Your page in minutes
            </motion.p>
          </div>

          {/* Tilted floating profile card */}
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
            {/* echo card behind */}
            <div className="glass absolute -left-6 top-10 -z-10 hidden h-40 w-40 rotate-[-8deg] rounded-3xl sm:block" />
            <div className="glass absolute -right-5 -bottom-8 -z-10 h-28 w-48 rotate-[6deg] rounded-3xl" />
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 flex justify-center text-muted-foreground/60"
        >
          <ChevronDown className="size-5 animate-bounce" />
        </motion.div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">Scan. Discover. Connect.</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One scan opens your whole world.
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            {
              icon: ScanLine,
              title: "They scan",
              text: "Your QR code or NFC card — on your CV, your business card, your phone case. A tap, a scan, done.",
            },
            {
              icon: QrCode,
              title: "They discover",
              text: "Your Elio opens instantly: who you are, what you've built, what you care about. No app, no searching.",
            },
            {
              icon: ArrowRight,
              title: "They connect",
              text: "Email, WhatsApp, Instagram, LinkedIn — every way to reach you is right there at the bottom of your story.",
            },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="glass group h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                  <s.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FEATURES BENTO ================= */}
      <section id="features" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan">Everything about you</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One page. Every piece of your identity.
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-6">
          {/* Profile + story */}
          <Reveal className="md:col-span-4">
            <div className="glass h-full rounded-3xl p-7">
              <h3 className="font-display text-xl font-semibold">Profile &amp; Story</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Who you are, where you're going. Not just a CV — a human introduction
                with your picture, your journey and your voice.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Profile</p>
                  <p className="mt-1 font-display font-semibold">Emmanuel Lukungu</p>
                  <p className="text-sm text-muted-foreground">Developer • Creator</p>
                </div>
                <div className="font-serif-accent rounded-2xl border border-border/60 bg-white/[0.02] p-4 text-sm italic leading-6 text-foreground/80">
                  "From Kinshasa to the web — I build things that help people show who they are."
                </div>
              </div>
            </div>
          </Reveal>

          {/* QR */}
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="glass flex h-full flex-col items-center justify-center rounded-3xl p-7 text-center">
              <ElioMark className="size-8" />
              <h3 className="mt-4 font-display text-xl font-semibold">Your personal link</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-mono text-foreground/80">elio.aethel.io/you</span> — printed,
                shared, remembered.
              </p>
            </div>
          </Reveal>

          {/* Projects */}
          <Reveal className="md:col-span-2">
            <div className="glass h-full rounded-3xl p-7">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
                <FolderGit2 className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Projects</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Apps, websites, businesses — everything you've built, with links, tech
                and status.
              </p>
            </div>
          </Reveal>

          {/* Portfolio */}
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="glass h-full rounded-3xl p-7">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-glow/15 text-indigo-glow">
                <Images className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Portfolio</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A clean, visual gallery for photos, designs, artwork and everything
                in between.
              </p>
            </div>
          </Reveal>

          {/* Ideas */}
          <Reveal delay={0.15} className="md:col-span-2">
            <div className="glass h-full rounded-3xl p-7">
              <div className="flex size-10 items-center justify-center rounded-xl bg-ember/15 text-ember">
                <Lightbulb className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Ideas</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Not everything is finished. Share concepts, experiments and dreams —
                where you're going matters too.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= QR SHOWCASE ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">NFC &amp; QR</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Put your space in the physical world.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              A student puts it on their CV. A photographer on a business card. A
              freelancer on an invoice. An entrepreneur on their packaging. One scan
              gives access to your entire digital space — no explanation needed.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Personal QR code, always up to date",
                "NFC card that opens your page with a tap",
                "Works with any phone camera — no app required",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-foreground/85">
                  <span className="flex size-5 items-center justify-center rounded-full bg-ember/15">
                    <Nfc className="size-3 text-ember" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Button className="mt-8 btn-glow rounded-2xl" asChild>
              <Link to="/auth?returnTo=%2Fdashboard">
                Get my QR code <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto w-full max-w-sm">
            <div className="[perspective:1000px]">
              <TiltCard max={6}>
                <QrShowcase username="emmanuel" />
              </TiltCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= AUDIENCES ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan">Built for everyone</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everyone has something worth showing.
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, title: "Students", text: "Projects, achievements, and the person behind them." },
            { icon: Images, title: "Creators", text: "A visual home for your art, photos and videos." },
            { icon: Briefcase, title: "Freelancers", text: "Services, prices and a direct line to clients." },
            { icon: FolderGit2, title: "Builders", text: "Code, products and ideas — all in one place." },
          ].map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="glass h-full rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]">
                <a.icon className="size-6 text-muted-foreground" />
                <h3 className="mt-4 font-display text-lg font-semibold">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">Elio Studio</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Want it done for you? We craft it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
            Order a personalized, professional Elio page — our team writes, designs
            and ships it with you. You show up; we build the space.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
          {PACKS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <div
                className={
                  p.popular
                    ? "glass-strong relative h-full rounded-3xl p-7 ring-1 ring-ember/40"
                    : "glass relative h-full rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
                }
              >
                {p.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-5 font-display text-4xl font-bold tracking-tight">
                  {p.price}
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">{p.period}</span>
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ember/70" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={
                    p.popular
                      ? "btn-glow mt-7 w-full rounded-2xl"
                      : "mt-7 w-full rounded-2xl border-border/70 bg-white/[0.03] backdrop-blur hover:bg-white/[0.07]"
                  }
                  variant={p.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to={`/services?pack=${p.id}`}>Order {p.name}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="relative px-4 py-24 sm:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <ElioMark className="mx-auto size-10" />
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Built for everyone.
          </h2>
          <p className="mt-5 leading-8 text-muted-foreground">
            Elio was created on September 22, 2026, by Aethel Technologies with a
            simple belief: everyone deserves a place to be seen. Whether you're
            starting your journey, building something new, or showcasing years of
            work — Elio gives you the space to do it. One page. One link. One space
            that grows with you.
          </p>
          <p className="mt-6 font-serif-accent text-lg italic text-foreground/80">
            "This is me."
          </p>
        </Reveal>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Questions, answered.
            </h2>
            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">
              Everything you need to know about creating, sharing and owning your
              Elio space.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="glass rounded-3xl px-6">
              {FAQ_ITEMS.map((f, i) => (
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
              Your space is waiting.
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">
              Create your Elio today — it takes minutes, and it's yours forever.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Button size="lg" className="btn-glow h-12 rounded-2xl px-8 text-base" asChild>
                <Link to="/auth?returnTo=%2Fdashboard">
                  Create your Elio <ArrowRight className="size-4" />
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

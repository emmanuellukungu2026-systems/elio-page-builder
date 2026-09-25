import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { styleById, waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Link, useParams } from "react-router";

export default function ItemDetail() {
  const { username, itemId } = useParams<{ username: string; itemId: string }>();
  const data = useQuery(api.pages.getPublicItem, { username: username ?? "", itemId: itemId ?? "" });
  const { t } = useI18n();
  const d = t.itemDetail;

  if (data === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Atmosphere />
        <ElioMark className="size-10" />
        <h1 className="font-display text-2xl font-bold">{t.profile.notLive}</h1>
        <Button className="btn-glow mt-2 rounded-2xl" asChild>
          <Link to={`/u/${username}`}>{d.back}</Link>
        </Button>
      </div>
    );
  }

  const { item, business } = data;
  const accent = business.accent ?? "#1e4fd8";
  const style = styleById(business.style);
  const serif = style.id === "atelier";

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
        style={{ background: `radial-gradient(600px 280px at 50% 0%, ${accent}20, transparent 70%)` }}
        aria-hidden="true"
      />

      <main className={cn("relative z-10 mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6", serif && "font-serif-accent")}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="rounded-xl" asChild>
              <Link to={`/u/${username}`}>
                <ArrowLeft className="size-4" /> {business.displayName}
              </Link>
            </Button>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: `${accent}1f`, color: accent }}
            >
              {item.kind}
            </span>
          </div>

          {/* Hero image */}
          {item.imageUrl && (
            <div className="glass-strong mt-4 overflow-hidden rounded-[2rem]">
              <img src={item.imageUrl} alt={item.title} className="max-h-[420px] w-full object-cover" />
            </div>
          )}

          <h1 className="mt-7 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {item.title}
          </h1>

          {/* Meta chips */}
          {(item.date || item.status) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.date && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" /> {item.date}
                </span>
              )}
              {item.status && (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  {item.status}
                </span>
              )}
              {(item.tags ?? []).map((tg) => (
                <span
                  key={tg}
                  className="inline-flex items-center rounded-full border border-border/60 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {tg}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="glass mt-6 rounded-[2rem] p-7 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: accent }}>
                {d.scope}
              </p>
              <p className="mt-4 whitespace-pre-line leading-8 text-foreground/85">
                {item.description}
              </p>
            </div>
          )}

          {/* Link out */}
          {item.linkUrl && (
            <a
              href={item.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="glass mt-4 flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-white/[0.05]"
            >
              <span className="text-sm font-medium">{d.viewLink}</span>
              <ArrowUpRight className="size-4 text-muted-foreground" />
            </a>
          )}

          {/* Discuss CTA */}
          <div className="glass-strong mt-6 rounded-[2rem] p-7 text-center">
            <h2 className="font-display text-xl font-semibold">{d.discuss}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{d.discussText}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {business.whatsapp && (
                <Button
                  className="btn-glow rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                  onClick={() =>
                    window.open(
                      waLink(
                        business.whatsapp!,
                        `Hello ${business.displayName} — I just saw "${item.title}" on your Elio page. Is something like this possible?`,
                      ),
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </Button>
              )}
              {business.email && (
                <Button variant="outline" className="btn-outline-glass rounded-xl" asChild>
                  <a href={`mailto:${business.email}`}>
                    <Mail className="size-4" /> Email
                  </a>
                </Button>
              )}
              {business.instagram && (
                <a
                  href={
                    business.instagram.startsWith("http")
                      ? business.instagram
                      : `https://instagram.com/${business.instagram.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                >
                  <Instagram className="size-4" />
                </a>
              )}
              {business.linkedin && (
                <a
                  href={
                    business.linkedin.startsWith("http")
                      ? business.linkedin
                      : `https://linkedin.com/in/${business.linkedin.replace(/^\//, "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                >
                  <Linkedin className="size-4" />
                </a>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {d.contact} · {business.displayName}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

import { Atmosphere } from "@/components/Atmosphere";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowUpRight, Images, Search, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type CatalogPage = NonNullable<
  ReturnType<typeof useQuery<typeof api.pages.listPublishedPages>>
>[number];

export default function Directory() {
  const { t } = useI18n();
  const raw = useQuery(api.pages.listPublishedPages);
  const pages: CatalogPage[] = raw ?? [];
  const [query, setQuery] = useState("");
  const [trade, setTrade] = useState("");

  const trades = useMemo(() => {
    const set = new Set<string>();
    for (const p of pages) if (p.trade) set.add(p.trade);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [pages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pages.filter((p) => {
      if (trade && p.trade !== trade) return false;
      if (!q) return true;
      return [p.displayName, p.trade, p.location, p.headline, p.bio]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [pages, query, trade]);

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      <main className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">
            {t.directory.kicker}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t.directory.title}
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">{t.directory.sub}</p>
        </div>

        {/* Search + trade filter */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.directory.searchPh}
              className="rounded-xl bg-white/[0.04] pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTrade("")}
              className={
                trade === ""
                  ? "rounded-full bg-ember px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  : "rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              }
            >
              {t.directory.allTrades}
            </button>
            {trades.map((tr) => (
              <button
                key={tr}
                onClick={() => setTrade(trade === tr ? "" : tr)}
                className={
                  trade === tr
                    ? "rounded-full bg-ember px-3 py-1.5 text-xs font-medium text-primary-foreground"
                    : "rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                }
              >
                {tr}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {pages.length === 0 ? (
          <div className="glass mt-12 flex flex-col items-center rounded-3xl p-14 text-center">
            <Store className="size-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">{t.directory.empty}</p>
            <Button className="btn-glow mt-6 rounded-2xl" asChild>
              <Link to="/auth?returnTo=%2Fdashboard">{t.directory.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-8 text-xs text-muted-foreground">
              {filtered.length} {t.directory.pages}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.username}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.25) }}
                >
                  <Link
                    to={`/u/${p.username}`}
                    className="glass group block h-full overflow-hidden rounded-2xl transition-colors duration-200 hover:bg-white/[0.06]"
                  >
                    {/* Cover */}
                    <div
                      className="relative h-24 overflow-hidden sm:h-32"
                      style={{
                        background:
                          p.coverUrl && p.coverKind
                            ? undefined
                            : `linear-gradient(135deg, ${p.accent ?? "#1e4fd8"}33, transparent 70%)`,
                      }}
                    >
                      {p.coverKind ? (
                        <img
                          src={p.coverKind}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <div
                          className="size-full"
                          style={{
                            background: `radial-gradient(300px 160px at 50% 120%, ${p.accent ?? "#1e4fd8"}55, transparent)`,
                          }}
                        />
                      )}
                      {p.logoUrl && (
                        <img
                          src={p.logoUrl}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="absolute bottom-2.5 left-3 size-10 rounded-full object-cover object-[50%_32%] ring-2 ring-background sm:bottom-3 sm:left-4 sm:size-14"
                        />
                      )}
                    </div>

                    <div className="p-3 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="truncate font-display text-sm font-semibold sm:text-lg">
                            {p.displayName}
                          </h2>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground sm:mt-0 sm:text-sm">
                            {[p.trade, p.location].filter(Boolean).join(" · ") || p.username}
                          </p>
                        </div>
                        <span className="hidden size-8 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors group-hover:text-foreground sm:flex">
                          <ArrowUpRight className="size-4" />
                        </span>
                      </div>
                      {p.headline && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground sm:mt-2.5 sm:text-sm sm:leading-6">
                          {p.headline}
                        </p>
                      )}
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground sm:mt-3 sm:text-xs">
                        <Images className="size-3.5" />
                        {p.itemCount} {t.directory.pages}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

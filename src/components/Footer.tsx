import logo from "@/assets/logo.png";
import { AethelMark } from "@/components/AethelMark";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { useQuery } from "convex/react";
import { Link } from "react-router";

export function Footer() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  // Already have a page? The "Create your page" link becomes "Check your page".
  const myPage = useQuery(api.pages.getMyPage);
  return (
    <footer className="relative z-10 mt-24 border-t border-border/60">
      {!isAuthenticated && (
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <div className="glass-strong flex flex-col items-center justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:p-7">
            <div className="min-w-0 text-center sm:text-left">
              <p className="font-display text-lg font-semibold">{t.account.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.account.text}</p>
            </div>
            <Button size="lg" className="btn-glow shrink-0 rounded-2xl px-6" asChild>
              <Link to="/auth?returnTo=%2Fdashboard">{t.account.cta}</Link>
            </Button>
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Elio Pages" className="size-7 rounded-md" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Elio <span className="text-muted-foreground">Pages</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.footer.blurb}</p>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Elio Pages — by Aethel Technologies
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.product}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.nav.features}
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.directory}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.concierge}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.start}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  to={myPage ? `/u/${myPage.username}` : "/auth?returnTo=%2Fdashboard"}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {myPage ? t.footer.verify : t.footer.create}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.myPage}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.aethel}
            </h4>
            <div className="mt-3 flex items-center gap-2">
              <AethelMark className="size-7 rounded-lg" />
              <span className="font-display text-sm font-semibold">Aethel Technologies</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/#about" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <a
                  href={waLink(CONCIERGE_WHATSAPP, "Hello Aethel team — I'd like to get in touch.")}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.footer.contact}
                </a>
              </li>
              <li>
                <Link to="/#faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.faq}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground/70"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <span className="inline-flex items-center justify-center gap-1.5">
          <AethelMark className="size-4" /> © {new Date().getFullYear()} Aethel Technologies · {t.footer.rights}
        </span>
      </div>
    </footer>
  );
}

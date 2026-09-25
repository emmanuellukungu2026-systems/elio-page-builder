import logo from "@/assets/logo.png";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative z-10 mt-24 border-t border-border/60">
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
            Elio Pages — by Aethel Technologies · est. September 22, 2026
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.product}
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.nav.features}
                </a>
              </li>
              <li>
                <a href="/directory" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.directory}
                </a>
              </li>
              <li>
                <a href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.footer.concierge}
                </a>
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
                  to="/auth?returnTo=%2Fdashboard"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.footer.create}
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
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">{t.footer.about}</span>
              </li>
              <li>
                <span className="text-muted-foreground">{t.footer.contact}</span>
              </li>
              <li>
                <span className="text-muted-foreground">{t.footer.privacy}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground/70"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        © {new Date().getFullYear()} Aethel Technologies · {t.footer.rights}
      </div>
    </footer>
  );
}

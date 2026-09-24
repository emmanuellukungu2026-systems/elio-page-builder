import logo from "@/assets/logo.svg";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Elio" className="size-7" />
            <span className="font-display text-lg font-semibold tracking-tight">Elio</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your work. Your story. Your space. Elio is your personal space on the
            internet — one page, one link, one QR code.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Elio by Aethel Technologies — est. September 22, 2026.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</a></li>
              <li><a href="/services" className="text-muted-foreground transition-colors hover:text-foreground">Services</a></li>
              <li><a href="/#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/auth?returnTo=%2Fdashboard" className="text-muted-foreground transition-colors hover:text-foreground">Create your Elio</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">My dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aethel</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><span className="text-muted-foreground">About Aethel</span></li>
              <li><span className="text-muted-foreground">Contact</span></li>
              <li><span className="text-muted-foreground">Privacy</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Aethel Technologies. One person. One page. One identity.
      </div>
    </footer>
  );
}

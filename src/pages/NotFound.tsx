import logo from "@/assets/logo.png";
import { Atmosphere } from "@/components/Atmosphere";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Atmosphere />
      <img src={logo} alt="Elio Pages" className="size-12 rounded-xl" />
      <h1 className="mt-6 font-display text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-3 max-w-sm leading-7 text-muted-foreground">{t.notFound.text}</p>
      <div className="mt-8 flex gap-3">
        <Button className="btn-glow rounded-2xl" asChild>
          <Link to="/">{t.notFound.back}</Link>
        </Button>
        <Button variant="outline" className="btn-outline-glass rounded-2xl border-border/70" asChild>
          <Link to="/auth?returnTo=%2Fdashboard">{t.notFound.create}</Link>
        </Button>
      </div>
    </div>
  );
}

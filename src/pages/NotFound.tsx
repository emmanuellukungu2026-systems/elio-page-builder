import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Atmosphere />
      <ElioMark className="size-12" />
      <h1 className="mt-6 font-display text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-3 max-w-sm leading-7 text-muted-foreground">
        This space doesn't exist — but yours can.
      </p>
      <div className="mt-8 flex gap-3">
        <Button className="btn-glow rounded-2xl" asChild>
          <Link to="/">Back to Elio</Link>
        </Button>
        <Button variant="outline" className="rounded-2xl border-border/70 bg-white/[0.03]" asChild>
          <Link to="/auth?returnTo=%2Fdashboard">Create your Elio</Link>
        </Button>
      </div>
    </div>
  );
}

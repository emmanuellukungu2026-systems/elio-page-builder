import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { PageLoading } from "@/components/PageLoading";
import { ProProfile } from "@/components/ProProfile";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";

/**
 * Public portfolio router. Every page renders the same section build
 * (ProProfile); the `style` stored on the page picks the visual model
 * (editorial | authory | corporate | elegant).
 */
export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const page = useQuery(api.pages.getPublicPage, { username: username ?? "" });
  const { t } = useI18n();
  const p = t.profile;

  if (page === undefined) {
    return <PageLoading />;
  }

  if (page === null) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Atmosphere />
        <ElioMark className="size-10" />
        <h1 className="font-display text-2xl font-bold">{p.notLive}</h1>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">{p.notLiveText}</p>
        <Link
          to="/auth?returnTo=%2Fdashboard"
          className="btn-glow mt-2 inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {p.claim}
        </Link>
      </div>
    );
  }

  return <ProProfile page={page} />;
}

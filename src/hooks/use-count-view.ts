import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";

/**
 * Count a visit on a public Elio page (feeds the owner's dashboard stats).
 *
 * `enabled` turns counting off — the studio preview and loading states pass
 * `false` so nobody inflates their own numbers. The server additionally
 * dedupes per browser session for 30 minutes, so refresh loops don't count.
 */
export function useCountView(username: string, enabled = true) {
  const recordView = useMutation(api.pages.recordView);
  const counted = useRef(false);

  useEffect(() => {
    if (!enabled || !username || counted.current) return;
    counted.current = true;

    let viewerKey: string;
    try {
      const existing = window.localStorage.getItem("elio.viewer");
      const key =
        existing ??
        (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);
      window.localStorage.setItem("elio.viewer", key);
      viewerKey = key;
    } catch {
      // Storage blocked (private mode): fall back to a per-mount key.
      viewerKey = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }

    void recordView({ username, viewerKey });
  }, [enabled, username, recordView]);
}

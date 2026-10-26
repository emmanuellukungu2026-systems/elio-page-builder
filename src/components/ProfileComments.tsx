import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { alpha, P } from "@/lib/page-theme";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* Page tokens — the palette of whichever model the page picked. */
const INK = P.ink;
const MUTED = P.muted;
const LINE = P.line;
const CARD = P.surf;

/**
 * Visitor comments on a portfolio page. `onAccent` renders the light-on-dark
 * variant used inside the Pro template's accent panels.
 */
export function ProfileComments({
  username,
  accent,
  onAccent = false,
}: {
  username: string;
  accent: string;
  onAccent?: boolean;
}) {
  const { t } = useI18n();
  const p = t.profile;
  const comments = useQuery(api.pages.listComments, { username });
  const addComment = useMutation(api.pages.addComment);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSending(true);
    try {
      await addComment({ username, authorName: name, body });
      setBody("");
      toast.success(p.thanks);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className={cn(
        "rounded-3xl p-6 sm:p-8",
        onAccent ? "bg-white/[0.05] ring-1 ring-white/10" : "border",
      )}
      style={onAccent ? undefined : { background: CARD, borderColor: LINE }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: onAccent ? "rgba(255,255,255,0.12)" : alpha(accent, 12), color: onAccent ? "#fff" : accent }}
        >
          <MessageCircle className="size-5" />
        </div>
        <div>
          <h2
            className="font-display text-lg font-semibold"
            style={onAccent ? undefined : { color: INK }}
          >
            {p.commentsTitle}
          </h2>
          <p className="text-xs" style={onAccent ? undefined : { color: MUTED }}>
            {p.connect}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
          <div className="space-y-1.5">
            <Label className="text-xs" style={onAccent ? undefined : { color: MUTED }}>{p.comment}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nadia / Atelier Kivu"
              className={cn("h-10 bg-[color:var(--p-bg)]", onAccent && "bg-white/10 text-white placeholder:text-white/40")}
              style={onAccent ? undefined : { color: INK }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={cn("text-xs select-none text-transparent", onAccent && "text-transparent")}>.</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={p.commentPh}
              rows={2}
              className={cn("resize-none bg-[color:var(--p-bg)]", onAccent && "bg-white/10 text-white placeholder:text-white/40")}
              style={onAccent ? undefined : { color: INK }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            className="rounded-xl"
            style={
              onAccent
                ? { background: "#fff", color: "#111318" }
                : { background: accent, color: "#fff" }
            }
            disabled={sending}
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
            {p.send}
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {comments === undefined ? null : comments.length === 0 ? (
          <p              className={cn(
                "rounded-2xl border border-dashed p-5 text-center text-sm",
                onAccent ? "border-white/25 text-white/60" : "",
              )}
              style={onAccent ? undefined : { borderColor: alpha(LINE, 70), color: MUTED }}
          >
            {p.commentsEmpty}
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className={cn(
                "rounded-2xl border p-4",
                onAccent ? "border-white/10 bg-white/[0.04]" : "",
              )}
              style={
                onAccent ? undefined : { borderColor: alpha(LINE, 80), background: alpha(MUTED, 6) }
              }
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={onAccent ? undefined : { color: INK }}>
                  {c.authorName}
                </p>
                <p className="text-[11px]" style={onAccent ? undefined : { color: MUTED }}>
                  {new Date(c.at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p
                className="mt-1.5 text-sm leading-6"
                style={onAccent ? undefined : { color: MUTED }}
              >
                {c.body}
              </p>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

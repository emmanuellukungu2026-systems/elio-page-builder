import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      className={cn("rounded-3xl p-6 sm:p-8", onAccent ? "bg-white/[0.05] ring-1 ring-white/10" : "glass")}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: onAccent ? "rgba(255,255,255,0.12)" : `${accent}1f`, color: onAccent ? "#fff" : accent }}
        >
          <MessageCircle className="size-5" />
        </div>
        <div>
          <h2 className={cn("font-display text-lg font-semibold", onAccent && "text-white")}>{p.commentsTitle}</h2>
          <p className={cn("text-xs", onAccent ? "text-white/60" : "text-muted-foreground")}>{p.connect}</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
          <div className="space-y-1.5">
            <Label className={cn("text-xs", onAccent ? "text-white/60" : "text-muted-foreground")}>{p.comment}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nadia / Atelier Kivu"
              className={onAccent ? "bg-white/10 text-white placeholder:text-white/40" : "bg-white/[0.04]"}
            />
          </div>
          <div className="space-y-1.5">
            <Label className={cn("text-xs select-none text-transparent", onAccent && "text-transparent")}>.</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={p.commentPh}
              rows={2}
              className={onAccent ? "bg-white/10 text-white placeholder:text-white/40" : "bg-white/[0.04]"}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            className="rounded-xl"
            style={onAccent ? { background: "#fff", color: "#111318" } : undefined}
            disabled={sending}
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
            {p.send}
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {comments === undefined ? null : comments.length === 0 ? (
          <p
            className={cn(
              "rounded-2xl border border-dashed p-5 text-center text-sm",
              onAccent ? "border-white/25 text-white/60" : "border-border/70 text-muted-foreground",
            )}
          >
            {p.commentsEmpty}
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className={cn(
                "rounded-2xl border p-4",
                onAccent ? "border-white/10 bg-white/[0.04]" : "border-border/60 bg-white/[0.02]",
              )}
            >
              <div className="flex items-center justify-between">
                <p className={cn("text-sm font-medium", onAccent && "text-white")}>{c.authorName}</p>
                <p className={cn("text-[11px]", onAccent ? "text-white/50" : "text-muted-foreground")}>
                  {new Date(c.at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className={cn("mt-1.5 text-sm leading-6", onAccent ? "text-white/85" : "text-foreground/85")}>{c.body}</p>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

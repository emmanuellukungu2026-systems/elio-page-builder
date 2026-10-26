import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/* Editorial tokens shared with ProProfile. */
const INK = "#151a2b";
const MUTED = "#5b6479";
const CORAL = "#ef4b34";
const LINE = "rgba(21, 26, 43, 0.09)";
const PURPLE_DOT = "#6b39d6";

const tokenKey = (username: string) => `elio-chat:${username}`;
const seenKey = (username: string) => `elio-chat-seen:${username}`;

/**
 * Private messaging on a public page — the page as a profile you write to.
 *
 * A visitor starts a conversation, keeps it in their browser through the
 * conversation token (no account) and reads the owner's replies in the same
 * panel. The owner answers from their dashboard inbox.
 */
export function ProfileChat({
  username,
  displayName,
  accent,
  embedded = false,
}: {
  username: string;
  displayName: string;
  accent: string;
  /** True inside the studio preview frame — no floating launcher there. */
  embedded?: boolean;
}) {
  const { t } = useI18n();
  const c = t.profile.chat;
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [unread, setUnread] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [body, setBody] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const startOrSend = useMutation(api.messages.send);

  // Restore this browser's conversation with the page.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(tokenKey(username));
      if (saved) setToken(saved);
    } catch {
      /* private mode — start fresh */
    }
  }, [username]);

  // The stored token picks the query; "skip" keeps it silent.
  const thread = useQuery(api.messages.visitorThread, token ? { token } : "skip");

  // Unread marker: an owner reply newer than the last time the panel was open.
  useEffect(() => {
    if (!thread) return;
    const lastOwner = [...thread.messages].reverse().find((m) => m.from === "owner");
    if (open) {
      setUnread(false);
      if (lastOwner) {
        try {
          window.localStorage.setItem(seenKey(username), String(lastOwner.at));
        } catch {
          /* ignore */
        }
      }
      return;
    }
    if (!lastOwner) {
      setUnread(false);
      return;
    }
    try {
      const seen = Number(window.localStorage.getItem(seenKey(username)) ?? 0);
      setUnread(lastOwner.at > seen);
    } catch {
      setUnread(false);
    }
  }, [thread, open, username]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && open) el.scrollTop = el.scrollHeight;
  }, [open, thread?.messages.length, replyText]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const continuing = !!token;
    const text = (continuing ? replyText : body).trim();
    if (!continuing && !name.trim()) {
      toast.error(c.nameRequired);
      return;
    }
    if (!text) return;

    setSending(true);
    try {
      const res = await startOrSend({
        username,
        name: name.trim(),
        contact: contact.trim() || undefined,
        body: text,
        token: token ?? undefined,
      });
      setToken(res.token);
      try {
        window.localStorage.setItem(tokenKey(username), res.token);
      } catch {
        /* ignore */
      }
      if (continuing) {
        setReplyText("");
      } else {
        setBody("");
        toast.success(c.sent);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : c.error);
    } finally {
      setSending(false);
    }
  };

  if (embedded) return null;

  const loading = token !== null && thread === undefined;
  const messages = thread?.messages ?? [];

  return (
    <>
      {/* ---------------- launcher ---------------- */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? c.close : c.open}
        aria-expanded={open}
        className={cn(
          "fixed bottom-5 right-5 z-[60] inline-flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(21,26,43,0.25)] transition-transform hover:-translate-y-0.5 active:scale-95 sm:bottom-6 sm:right-6",
        )}
        style={{ background: CORAL }}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        <span className="hidden sm:inline">{open ? c.close : c.open}</span>
        {unread && !open && (
          <span
            className="absolute right-3 top-3 size-2.5 rounded-full ring-2 ring-white"
            style={{ background: PURPLE_DOT }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* ---------------- panel ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={c.title}
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.21, 0.6, 0.35, 1] }}
            className="fixed bottom-24 left-4 right-4 z-[60] flex max-h-[72vh] flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_24px_60px_rgba(21,26,43,0.25)] sm:left-auto sm:right-6 sm:w-[23rem] sm:bottom-28"
            style={{ borderColor: LINE }}
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: LINE }}>
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-white"
                style={{ background: accent }}
              >
                {displayName.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold" style={{ color: INK }}>
                  {displayName}
                </p>
                <p className="truncate text-xs" style={{ color: MUTED }}>
                  {token ? c.conversation : c.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={c.close}
                className="ml-auto flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/[0.05]"
                style={{ color: MUTED }}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* body */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-5 animate-spin" style={{ color: MUTED }} />
                </div>
              )}

              {!loading && !token && (
                <form id="elio-chat-start" onSubmit={submit} className="space-y-3">
                  <p className="text-[13px] leading-6" style={{ color: MUTED }}>
                    {c.hint}
                  </p>
                  <div className="space-y-1.5">
                    <Label className="text-xs" style={{ color: MUTED }}>
                      {c.name}
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={c.namePh}
                      maxLength={60}
                      className="h-10 bg-[#f4f2ee] text-sm"
                      style={{ color: INK }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs" style={{ color: MUTED }}>
                      {c.contact}
                    </Label>
                    <Input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={c.contactPh}
                      maxLength={120}
                      className="h-10 bg-[#f4f2ee] text-sm"
                      style={{ color: INK }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs" style={{ color: MUTED }}>
                      {c.body}
                    </Label>
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={c.bodyPh}
                      rows={3}
                      maxLength={2000}
                      className="resize-none bg-[#f4f2ee] text-sm"
                      style={{ color: INK }}
                    />
                  </div>
                </form>
              )}

              {!loading && token && messages.length === 0 && (
                <p
                  className="rounded-2xl border border-dashed p-4 text-center text-sm"
                  style={{ borderColor: LINE, color: MUTED }}
                >
                  {c.empty}
                </p>
              )}

              {!loading &&
                messages.map((m, i) => (
                  <motion.div
                    key={`${m.at}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("flex flex-col", m.from === "visitor" ? "items-end" : "items-start")}
                  >
                    <span className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                      {m.from === "visitor" ? c.you : c.owner}
                    </span>
                    <span
                      className={cn(
                        "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                        m.from === "visitor" ? "rounded-br-md" : "rounded-bl-md",
                      )}
                      style={
                        m.from === "visitor"
                          ? { background: "#f4f2ee", color: INK, border: `1px solid ${LINE}` }
                          : { background: CORAL, color: "#fff" }
                      }
                    >
                      {m.body}
                    </span>
                    <span className="mt-1 px-1 text-[10px]" style={{ color: MUTED }}>
                      {new Date(m.at).toLocaleString(undefined, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </motion.div>
                ))}
            </div>

            {/* footer — conversation continuation */}
            {token && (
              <form
                onSubmit={submit}
                className="flex items-center gap-2 border-t px-3 py-3"
                style={{ borderColor: LINE }}
              >
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={c.replyPh}
                  maxLength={2000}
                  className="h-10 flex-1 bg-[#f4f2ee] text-sm"
                  style={{ color: INK }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={sending || !replyText.trim()}
                  aria-label={c.send}
                  className="size-10 shrink-0 rounded-xl text-white"
                  style={{ background: CORAL }}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </form>
            )}

            {/* footer — first message */}
            {!token && (
              <div className="border-t px-4 py-3" style={{ borderColor: LINE }}>
                <p className="mb-2 text-[11px] leading-4" style={{ color: MUTED }}>
                  {c.note}
                </p>
                <Button
                  type="submit"
                  form="elio-chat-start"
                  disabled={sending}
                  className="h-10 w-full rounded-xl text-white"
                  style={{ background: CORAL }}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  {sending ? c.sending : c.send}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

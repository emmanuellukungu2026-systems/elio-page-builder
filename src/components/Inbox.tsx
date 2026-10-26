import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Inbox as InboxIcon, Loader2, Send, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const when = (at: number) =>
  new Date(at).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * The owner's inbox — every conversation started from their public page.
 * Selecting a thread marks it read; replies land back in the visitor's panel.
 */
export function PageInbox() {
  const { t } = useI18n();
  const k = t.dashboard.inbox;
  const inbox = useQuery(api.messages.inbox);
  const markRead = useMutation(api.messages.markRead);
  const reply = useMutation(api.messages.reply);

  const [selected, setSelected] = useState<Id<"conversations"> | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const thread = useQuery(
    api.messages.thread,
    selected ? { conversationId: selected } : "skip",
  );

  // Opening a thread clears its unread badge.
  useEffect(() => {
    if (selected) markRead({ conversationId: selected }).catch(() => {});
  }, [selected, markRead]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread?.messages.length, selected]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || sending) return;
    const body = text.trim();
    if (!body) return;
    setSending(true);
    try {
      await reply({ conversationId: selected, body });
      setText("");
    } catch {
      toast.error(k.error);
    } finally {
      setSending(false);
    }
  };

  if (inbox === undefined) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (inbox === null) return null;

  const conversations = inbox.conversations;
  const active =
    selected === null
      ? null
      : (conversations.find((c) => c.id === selected) ?? null);

  return (
    <section id="inbox" className="glass-strong mt-4 rounded-3xl p-6 sm:p-7 scroll-mt-24">
      {/* ---------- header ---------- */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ember/15 text-ember">
            <InboxIcon className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold sm:text-xl">{k.title}</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
              {k.sub}
            </p>
          </div>
        </div>
        {inbox.unread > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/15 px-3 py-1 text-xs font-semibold text-ember">
            {inbox.unread} {k.unread}
          </span>
        )}
      </div>

      {/* ---------- empty ---------- */}
      {conversations.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.05]">
            <UserRound className="size-5 text-muted-foreground" />
          </span>
          <h3 className="mt-4 font-display font-semibold">{k.empty}</h3>
          <p className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
            {k.emptyText}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[17rem_1fr]">
          {/* ---------- conversation list ---------- */}
          <div
            className={cn(
              "space-y-1.5 overflow-y-auto lg:max-h-[26rem]",
              selected && "hidden lg:block",
            )}
          >
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={cn(
                  "flex w-full flex-col gap-1 rounded-2xl border px-3.5 py-3 text-left transition-colors",
                  selected === c.id
                    ? "border-ember/40 bg-ember/10"
                    : "border-border/60 bg-white/[0.02] hover:bg-white/[0.05]",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{c.visitorName}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {when(c.lastAt)}
                  </span>
                </span>
                <span
                  className={cn(
                    "truncate text-xs",
                    c.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {c.lastFrom === "owner" ? `${k.you}: ` : ""}
                  {c.lastBody}
                </span>
                {c.unread > 0 && (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-ember">
                    {c.unread} {k.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ---------- thread ---------- */}
          <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border/60 bg-white/[0.02]">
            {active ? (
              <>
                <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label={k.back}
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-black/5 lg:hidden"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <span className="flex size-9 items-center justify-center rounded-full bg-ember/15 text-ember">
                    <UserRound className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{active.visitorName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {active.visitorContact || k.viaPage}
                    </p>
                  </div>
                </div>

                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  <AnimatePresence initial={false}>
                    {(thread?.messages ?? []).map((m, i) => (
                      <motion.div
                        key={`${m.at}-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                          "flex flex-col",
                          m.from === "owner" ? "items-end" : "items-start",
                        )}
                      >
                        <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {m.from === "owner" ? k.you : active.visitorName}
                        </span>
                        <span
                          className={cn(
                            "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                            m.from === "owner"
                              ? "rounded-br-md bg-primary text-primary-foreground"
                              : "rounded-bl-md border border-border/60 bg-white/[0.05]",
                          )}
                        >
                          {m.body}
                        </span>
                        <span className="mt-1 text-[10px] text-muted-foreground">
                          {when(m.at)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <form
                  onSubmit={send}
                  className="flex items-center gap-2 border-t border-border/60 px-3 py-3"
                >
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={k.write}
                    maxLength={2000}
                    className="h-10 flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={sending || !text.trim()}
                    aria-label={k.send}
                    className="size-10 shrink-0 rounded-xl"
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                <UserRound className="size-5 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">{k.select}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

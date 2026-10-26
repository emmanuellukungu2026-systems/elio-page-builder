import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

type Ctx = QueryCtx | MutationCtx;

/**
 * Private messaging — the Elio page as a profile you can write to.
 *
 * A visitor opens a page, starts a conversation and keeps talking with the
 * owner. Visitors stay anonymous, so each conversation carries a random
 * `visitorToken` handed back to their browser: that token is what lets them
 * read the owner's replies without an account. The owner replies from their
 * dashboard, where only conversations on their own page are visible.
 */

const BODY_MAX = 2000;
const NAME_MAX = 60;

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-");
}

function randomToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "") + Date.now().toString(36);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

async function pageByUsername(ctx: Ctx, username: string) {
  const value = normalizeUsername(username);
  return await ctx.db
    .query("elioPages")
    .withIndex("by_username", (q) => q.eq("username", value))
    .first();
}

/** The signed-in owner's own page, or null when they don't have one yet. */
async function myPage(ctx: Ctx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  return await ctx.db
    .query("elioPages")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

/**
 * Visitor side — open a conversation on a page (or continue the one the
 * token already points at) and post the first message.
 */
export const send = mutation({
  args: {
    username: v.string(),
    name: v.string(),
    body: v.string(),
    contact: v.optional(v.string()),
    token: v.optional(v.string()),
  },
  handler: async (ctx, { username, name, body, contact, token }) => {
    const page = await pageByUsername(ctx, username);
    if (!page || page.isPublished !== true) throw new Error("Page not found");

    const text = body.trim().slice(0, BODY_MAX);
    const visitorName = name.trim().slice(0, NAME_MAX);
    if (!text) throw new Error("Message is required");

    let conversation = null;
    if (token) {
      const found = await ctx.db
        .query("conversations")
        .withIndex("by_token", (q) => q.eq("visitorToken", token))
        .first();
      if (found && found.pageId === page._id) conversation = found;
    }

    const now = Date.now();
    if (!conversation) {
      if (!visitorName) throw new Error("Name is required");
      const visitorToken = randomToken();
      const conversationId = await ctx.db.insert("conversations", {
        pageId: page._id,
        visitorName,
        visitorContact: contact?.trim().slice(0, 120) || undefined,
        visitorToken,
        lastBody: text,
        lastAt: now,
        lastFrom: "visitor",
        unread: 1,
      });
      await ctx.db.insert("messages", {
        conversationId,
        from: "visitor",
        body: text,
        at: now,
      });
      return { conversationId, token: visitorToken };
    }

    await ctx.db.insert("messages", {
      conversationId: conversation._id,
      from: "visitor",
      body: text,
      at: now,
    });
    await ctx.db.patch(conversation._id, {
      lastBody: text,
      lastAt: now,
      lastFrom: "visitor",
      unread: conversation.unread + 1,
    });
    return { conversationId: conversation._id, token: conversation.visitorToken };
  },
});

/** Visitor side — the whole thread, unlocked by the browser's token. */
export const visitorThread = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (!token) return null;
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_token", (q) => q.eq("visitorToken", token))
      .first();
    if (!conversation) return null;
    const page = await ctx.db.get(conversation.pageId);
    if (!page) return null;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversation._id))
      .collect();

    return {
      username: page.username,
      displayName: page.displayName,
      accent: page.accent ?? "#ef4b34",
      logoUrl: page.logoUrl,
      ownerReplied: conversation.lastFrom === "owner",
      messages: messages
        .sort((a, b) => a.at - b.at)
        .map((m) => ({ from: m.from, body: m.body, at: m.at })),
    };
  },
});

/** Owner side — every conversation on their page, newest first. */
export const inbox = query({
  args: {},
  handler: async (ctx) => {
    const page = await myPage(ctx);
    if (!page) return null;

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_page_time", (q) => q.eq("pageId", page._id))
      .order("desc")
      .collect();

    return {
      username: page.username,
      displayName: page.displayName,
      unread: conversations.reduce((sum, c) => sum + c.unread, 0),
      conversations: conversations.map((c) => ({
        id: c._id,
        visitorName: c.visitorName,
        visitorContact: c.visitorContact,
        lastBody: c.lastBody,
        lastAt: c.lastAt,
        lastFrom: c.lastFrom,
        unread: c.unread,
      })),
    };
  },
});

/** Owner side — one thread, verified against their own page. */
export const thread = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const page = await myPage(ctx);
    if (!page) return null;
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || conversation.pageId !== page._id) return null;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();

    return {
      visitorName: conversation.visitorName,
      visitorContact: conversation.visitorContact,
      unread: conversation.unread,
      messages: messages
        .sort((a, b) => a.at - b.at)
        .map((m) => ({ from: m.from, body: m.body, at: m.at, readAt: m.readAt })),
    };
  },
});

/** Owner side — opening a thread clears its unread badge. */
export const markRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const page = await myPage(ctx);
    if (!page) throw new Error("Not signed in");
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || conversation.pageId !== page._id) throw new Error("Not found");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();
    const now = Date.now();
    for (const m of messages) {
      if (m.from === "visitor" && m.readAt === undefined) {
        await ctx.db.patch(m._id, { readAt: now });
      }
    }
    if (conversation.unread !== 0) await ctx.db.patch(conversationId, { unread: 0 });
  },
});

/** Owner side — reply from the dashboard. */
export const reply = mutation({
  args: { conversationId: v.id("conversations"), body: v.string() },
  handler: async (ctx, { conversationId, body }) => {
    const page = await myPage(ctx);
    if (!page) throw new Error("Not signed in");
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || conversation.pageId !== page._id) throw new Error("Not found");

    const text = body.trim().slice(0, BODY_MAX);
    if (!text) throw new Error("Message is required");

    const now = Date.now();
    await ctx.db.insert("messages", {
      conversationId,
      from: "owner",
      body: text,
      at: now,
    });
    await ctx.db.patch(conversationId, {
      lastBody: text,
      lastAt: now,
      lastFrom: "owner",
    });
  },
});

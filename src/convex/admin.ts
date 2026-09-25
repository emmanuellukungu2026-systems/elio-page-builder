import { v } from "convex/values";
import { query, mutation, type QueryCtx, type MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

/**
 * Admin console backend.
 *
 * Everything here is gated by OWNER_EMAILS: only the Aethel Technologies team
 * may read all client pages/orders or mutate client content. Any other signed-in
 * account gets `null` from the queries and hard errors from the mutations.
 */

const OWNER_EMAILS = [
  "emmanuellukungu6@gmail.com",
  "emmanuellukungu80@gmail.com",
  "emmanuellukungu77@gmail.com",
];

async function getOwner(
  ctx: QueryCtx | MutationCtx,
): Promise<{ userId: Id<"users">; email: string } | null> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  const user = await ctx.db.get(userId);
  const email = (user?.email ?? "").trim().toLowerCase();
  if (!email || !OWNER_EMAILS.includes(email)) return null;
  return { userId, email };
}

/** Who am I, and am I on the owner allowlist? Drives the /admin gate in the UI. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const owner = await getOwner(ctx);
    return owner
      ? { isOwner: true as const, email: owner.email }
      : { isOwner: false as const, email: null };
  },
});

/* ================= Reads ================= */

/** Every client page — drafts and published — newest activity first. */
export const listAllPages = query({
  args: {},
  handler: async (ctx) => {
    const owner = await getOwner(ctx);
    if (!owner) return null;
    const pages = await ctx.db.query("elioPages").collect();
    return pages
      .sort((a, b) => (b.updatedAt ?? b._creationTime) - (a.updatedAt ?? a._creationTime))
      .map((p) => ({
        _id: p._id,
        _creationTime: p._creationTime,
        username: p.username,
        displayName: p.displayName,
        trade: p.trade,
        headline: p.headline,
        bio: p.bio,
        story: p.story,
        location: p.location,
        since: p.since,
        email: p.email,
        whatsapp: p.whatsapp,
        instagram: p.instagram,
        linkedin: p.linkedin,
        logoUrl: p.logoUrl,
        coverUrl: p.coverUrl,
        accent: p.accent,
        style: p.style,
        isPublished: p.isPublished ?? false,
        updatedAt: p.updatedAt,
        itemCount: p.items.length,
        items: p.items,
      }));
  },
});

/** Every concierge order/brief submitted from /services, newest first. */
export const listOrders = query({
  args: {},
  handler: async (ctx) => {
    const owner = await getOwner(ctx);
    if (!owner) return null;
    const orders = await ctx.db.query("serviceOrders").collect();
    return orders.sort((a, b) => b._creationTime - a._creationTime);
  },
});

/* ================= Page mutations ================= */

/** Create a client page from the admin studio (e.g. from an accepted brief). */
export const adminCreatePage = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    // Optional: the client's account email (from the order). When it matches a
    // signed-up user, the page is linked to them so their portal shows it.
    clientEmail: v.optional(v.string()),
  },
  handler: async (ctx, { username, displayName, clientEmail }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");

    const value = username.trim().toLowerCase().replace(/\s+/g, "-");
    if (!/^[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])$/.test(value)) {
      throw new Error("Invalid username (3-24 chars, lowercase letters, numbers, dashes)");
    }
    const taken = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", value))
      .first();
    if (taken) throw new Error("That username is already taken");

    let pageUserId = owner.userId;
    const email = clientEmail?.trim().toLowerCase();
    if (email) {
      const client = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .first();
      if (client) pageUserId = client._id;
    }

    const now = Date.now();
    return await ctx.db.insert("elioPages", {
      userId: pageUserId,
      username: value,
      displayName: displayName.trim() || value,
      accent: "#1e4fd8",
      style: "noir",
      isPublished: false,
      items: [],
      updatedAt: now,
    });
  },
});

/**
 * Update any subset of a client page. Covers both admin flows:
 * admin edits (owner.userId set) and claimed pages (keep original owner).
 */
export const adminUpdatePage = mutation({
  args: {
    pageId: v.id("elioPages"),
    displayName: v.optional(v.string()),
    trade: v.optional(v.string()),
    headline: v.optional(v.string()),
    bio: v.optional(v.string()),
    story: v.optional(v.string()),
    location: v.optional(v.string()),
    since: v.optional(v.string()),
    email: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    accent: v.optional(v.string()),
    style: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    keepOwner: v.optional(v.boolean()),
  },
  handler: async (ctx, { pageId, isPublished, keepOwner, ...patch }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");

    const now = Date.now();
    await ctx.db.patch(pageId, {
      ...patch,
      ...(keepOwner ? {} : { userId: owner.userId }),
      ...(isPublished === undefined
        ? {}
        : { isPublished, publishedAt: isPublished ? (page.publishedAt ?? now) : undefined }),
      updatedAt: now,
    });
  },
});

/** Permanently delete a client page. */
export const adminDeletePage = mutation({
  args: { pageId: v.id("elioPages") },
  handler: async (ctx, { pageId }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    await ctx.db.delete(pageId);
  },
});

/* ================= Item mutations ================= */

function newId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Add a catalog item to any client page. */
export const adminAddItem = mutation({
  args: {
    pageId: v.id("elioPages"),
    kind: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { pageId, ...item }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    await ctx.db.patch(pageId, {
      items: [...page.items, { id: newId(), ...item }],
      updatedAt: Date.now(),
    });
  },
});

/** Update one catalog item by id on any client page. */
export const adminUpdateItem = mutation({
  args: {
    pageId: v.id("elioPages"),
    itemId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { pageId, itemId, ...patch }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    const items = page.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it));
    await ctx.db.patch(pageId, { items, updatedAt: Date.now() });
  },
});

/** Remove one catalog item by id from any client page. */
export const adminRemoveItem = mutation({
  args: { pageId: v.id("elioPages"), itemId: v.string() },
  handler: async (ctx, { pageId, itemId }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    await ctx.db.patch(pageId, {
      items: page.items.filter((it) => it.id !== itemId),
      updatedAt: Date.now(),
    });
  },
});

/* ================= Order status ================= */

/** Move an order through the pipeline: new → in_progress → done (or anything else). */
export const setOrderStatus = mutation({
  args: { orderId: v.id("serviceOrders"), status: v.string() },
  handler: async (ctx, { orderId, status }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    const order = await ctx.db.get(orderId);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(orderId, { status });
  },
});

/** Delete a processed/junk order record. */
export const adminDeleteOrder = mutation({
  args: { orderId: v.id("serviceOrders") },
  handler: async (ctx, { orderId }) => {
    const owner = await getOwner(ctx);
    if (!owner) throw new Error("Admin only");
    await ctx.db.delete(orderId);
  },
});

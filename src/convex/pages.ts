import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])$/;

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-");
}

export function validateUsername(raw: string): { ok: boolean; value?: string; error?: string } {
  const value = normalizeUsername(raw);
  if (value.length < 3) return { ok: false, error: "At least 3 characters" };
  if (value.length > 24) return { ok: false, error: "At most 24 characters" };
  if (!USERNAME_RE.test(value)) {
    return { ok: false, error: "Lowercase letters, numbers and dashes only" };
  }
  return { ok: true, value };
}

/** The signed-in business's own page (or null before onboarding). */
export const getMyPage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db
      .query("elioPages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

/** Check username availability (used live during onboarding). */
export const checkUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const check = validateUsername(username);
    if (!check.ok || !check.value) return { available: false, error: check.error };
    const taken = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", check.value!))
      .first();
    return { available: !taken, error: taken ? "Already taken" : undefined };
  },
});

/** Public shape of a page (no userId leakage). */
function publicPage(page: {
  username: string;
  displayName: string;
  trade?: string;
  headline?: string;
  bio?: string;
  story?: string;
  location?: string;
  since?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  logoUrl?: string;
  coverUrl?: string;
  accent?: string;
  style?: string;
  template?: string;
  items: {
    id: string;
    kind: string;
    title: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    tags?: string[];
    date?: string;
    status?: string;
  }[];
}) {
  return {
    username: page.username,
    displayName: page.displayName,
    trade: page.trade,
    headline: page.headline,
    bio: page.bio,
    story: page.story,
    location: page.location,
    since: page.since,
    email: page.email,
    whatsapp: page.whatsapp,
    instagram: page.instagram,
    linkedin: page.linkedin,
    logoUrl: page.logoUrl,
    coverUrl: page.coverUrl,
    accent: page.accent,
    style: page.style,
    template: page.template,
    items: page.items,
  };
}

/** All published pages — the directory catalog. */
export const listPublishedPages = query({
  args: {},
  handler: async (ctx) => {
    const pages = await ctx.db
      .query("elioPages")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();
    return pages
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
      .map((p) => ({
        username: p.username,
        displayName: p.displayName,
        trade: p.trade,
        headline: p.headline,
        bio: p.bio,
        location: p.location,
        logoUrl: p.logoUrl,
        coverUrl: p.coverUrl,
        accent: p.accent,
        style: p.style,
        itemCount: p.items.length,
        coverKind: p.items.find((it) => it.imageUrl)?.imageUrl,
      }));
  },
});

/** Public page data by username. */
export const getPublicPage = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const value = normalizeUsername(username);
    const page = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", value))
      .first();
    if (!page || page.isPublished !== true) return null;
    return publicPage(page);
  },
});

/** One catalog item from a published page — the detail view. */
export const getPublicItem = query({
  args: { username: v.string(), itemId: v.string() },
  handler: async (ctx, { username, itemId }) => {
    const value = normalizeUsername(username);
    const page = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", value))
      .first();
    if (!page || page.isPublished !== true) return null;
    const item = page.items.find((it) => it.id === itemId);
    if (!item) return null;
    return {
      item,
      business: {
        username: page.username,
        displayName: page.displayName,
        trade: page.trade,
        location: page.location,
        logoUrl: page.logoUrl,
        accent: page.accent,
        style: page.style,
        email: page.email,
        whatsapp: page.whatsapp,
        instagram: page.instagram,
        linkedin: page.linkedin,
      },
    };
  },
});

/** Comments on a page (visitor messages). */
export const listComments = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const value = normalizeUsername(username);
    const page = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", value))
      .first();
    if (!page) return [];
    const comments = await ctx.db
      .query("pageComments")
      .withIndex("by_page", (q) => q.eq("pageId", page._id))
      .collect();
    return comments
      .sort((a, b) => b._creationTime - a._creationTime)
      .map((c) => ({ _id: c._id, authorName: c.authorName, body: c.body, at: c._creationTime }));
  },
});

/** Post a visitor comment. */
export const addComment = mutation({
  args: {
    username: v.string(),
    authorName: v.string(),
    body: v.string(),
  },
  handler: async (ctx, { username, authorName, body }) => {
    const value = normalizeUsername(username);
    const page = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", value))
      .first();
    if (!page || page.isPublished !== true) throw new Error("Page not found");
    const name = authorName.trim().slice(0, 60);
    const text = body.trim().slice(0, 800);
    if (!name || !text) throw new Error("Name and message are required");
    await ctx.db.insert("pageComments", { pageId: page._id, authorName: name, body: text });
  },
});

/** Create the signed-in business's page (one per user). */
export const createPage = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, { username, displayName }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");

    const check = validateUsername(username);
    if (!check.ok || !check.value) throw new Error(check.error ?? "Invalid username");

    const existing = await ctx.db
      .query("elioPages")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) throw new Error("You already have an Elio page");

    const taken = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", check.value!))
      .first();
    if (taken) throw new Error("That username is already taken");

    return await ctx.db.insert("elioPages", {
      userId,
      username: check.value,
      displayName: displayName.trim() || check.value,
      accent: "#1e4fd8",
      style: "noir",
      isPublished: false,
      items: [],
      updatedAt: Date.now(),
    });
  },
});

/** Update any subset of the business profile. */
export const updatePage = mutation({
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
    template: v.optional(v.string()), // standard | pro
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, { pageId, isPublished, ...patch }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (page.userId !== userId) throw new Error("Not your page");

    const now = Date.now();
    await ctx.db.patch(pageId, {
      ...patch,
      ...(isPublished === undefined ? {} : { isPublished, publishedAt: isPublished ? now : undefined }),
      updatedAt: now,
    });
  },
});

/** Add a catalog item. */
export const addItem = mutation({
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (page.userId !== userId) throw new Error("Not your page");

    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await ctx.db.patch(pageId, {
      items: [...page.items, { id, ...item }],
      updatedAt: Date.now(),
    });
  },
});

/** Update one catalog item by id. */
export const updateItem = mutation({
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (page.userId !== userId) throw new Error("Not your page");

    const items = page.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it));
    await ctx.db.patch(pageId, { items, updatedAt: Date.now() });
  },
});

/** Remove one catalog item by id. */
export const removeItem = mutation({
  args: { pageId: v.id("elioPages"), itemId: v.string() },
  handler: async (ctx, { pageId, itemId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (page.userId !== userId) throw new Error("Not your page");

    await ctx.db.patch(pageId, {
      items: page.items.filter((it) => it.id !== itemId),
      updatedAt: Date.now(),
    });
  },
});

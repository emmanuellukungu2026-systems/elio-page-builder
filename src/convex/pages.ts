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

/** Return the signed-in user's Elio page (or null if none yet). */
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

/** Check username availability. */
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

/** Public page data by username. */
export const getPublicPage = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const value = normalizeUsername(username);
    const page = await ctx.db
      .query("elioPages")
      .withIndex("by_username", (q) => q.eq("username", value))
      .first();
    if (!page || page.isPublished === false) return null;
    // Only public fields
    return {
      username: page.username,
      displayName: page.displayName,
      headline: page.headline,
      bio: page.bio,
      story: page.story,
      location: page.location,
      avatarUrl: page.avatarUrl,
      accent: page.accent,
      email: page.email,
      whatsapp: page.whatsapp,
      instagram: page.instagram,
      linkedin: page.linkedin,
      items: page.items,
    };
  },
});

/** Create the signed-in user's Elio page (one per user). */
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

    const now = Date.now();
    const pageId = await ctx.db.insert("elioPages", {
      userId,
      username: check.value,
      displayName: displayName.trim() || check.value,
      headline: "",
      bio: "",
      story: "",
      location: "",
      accent: "#f0b03f",
      isPublished: false,
      items: [],
      updatedAt: now,
    });
    return pageId;
  },
});

/** Update any subset of page fields. */
export const updatePage = mutation({
  args: {
    pageId: v.id("elioPages"),
    displayName: v.optional(v.string()),
    headline: v.optional(v.string()),
    bio: v.optional(v.string()),
    story: v.optional(v.string()),
    location: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    accent: v.optional(v.string()),
    email: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, { pageId, ...patch }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (page.userId !== userId) throw new Error("Not your page");

    await ctx.db.patch(pageId, { ...patch, updatedAt: Date.now() });
  },
});

/** Change username (validated + uniqueness enforced). */
export const setUsername = mutation({
  args: { pageId: v.id("elioPages"), username: v.string() },
  handler: async (ctx, { pageId, username }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const page = await ctx.db.get(pageId);
    if (!page) throw new Error("Page not found");
    if (page.userId !== userId) throw new Error("Not your page");

    const check = validateUsername(username);
    if (!check.ok || !check.value) throw new Error(check.error ?? "Invalid username");
    if (check.value !== page.username) {
      const taken = await ctx.db
        .query("elioPages")
        .withIndex("by_username", (q) => q.eq("username", check.value!))
        .first();
      if (taken) throw new Error("That username is already taken");
    }
    await ctx.db.patch(pageId, { username: check.value, updatedAt: Date.now() });
  },
});

/** Add an item (project / portfolio / idea / service / price). */
export const addItem = mutation({
  args: {
    pageId: v.id("elioPages"),
    kind: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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

/** Update one item by id. */
export const updateItem = mutation({
  args: {
    pageId: v.id("elioPages"),
    itemId: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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

/** Remove one item by id. */
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

import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

/** Generate a unique 5-digit ID (10000–99999) not used by any other user. */
async function generateUniqueLoginId(ctx: { db: any }): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = String(Math.floor(10000 + Math.random() * 90000));
    const existing = await ctx.db
      .query("users")
      .withIndex("by_login_id", (q: any) => q.eq("loginId", candidate))
      .first();
    if (!existing) return candidate;
  }
  // Practically unreachable; fall back to a timestamp-derived ID.
  return String(10000 + (Date.now() % 90000));
}

/**
 * Enrich the signed-in user with the fundamental identity fields captured at
 * sign-up (name, phone, email) and make sure they have a 5-digit login ID.
 * Called right after the credentials signUp flow completes.
 */
export const completeRegistration = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, { name, phone, email }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in.");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found.");

    const patch: Record<string, unknown> = {};
    if (name?.trim() && !user.name) patch.name = name.trim();
    if (phone?.trim() && user.phone !== phone.trim()) patch.phone = phone.trim();
    if (email?.trim() && !user.email) patch.email = email.trim().toLowerCase();

    let loginId = user.loginId;
    if (!loginId) {
      loginId = await generateUniqueLoginId(ctx);
      patch.loginId = loginId;
    }
    if (Object.keys(patch).length > 0) await ctx.db.patch(userId, patch);
    return loginId;
  },
});

/** Ensure the signed-in user has a 5-digit login ID and returns it. */
export const ensureLoginId = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in.");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found.");

    if (user.loginId) return user.loginId;
    const loginId = await generateUniqueLoginId(ctx);
    await ctx.db.patch(userId, { loginId });
    return loginId;
  },
});

/** Check whether a name is already used (for sign-up UX hints). */
export const nameExists = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const found = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", name.trim().toLowerCase()))
      .first();
    return found !== null;
  },
});

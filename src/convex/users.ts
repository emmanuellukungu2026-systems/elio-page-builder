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
 * Ensure the signed-in user has a 5-digit login ID and returns it.
 * Called by the client right after sign-in/sign-up; safe to call repeatedly.
 */
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

/** Look up whether a login ID is already taken (used for UX hints). */
export const loginIdExists = query({
  args: { loginId: v.string() },
  handler: async (ctx, { loginId }) => {
    const found = await ctx.db
      .query("users")
      .withIndex("by_login_id", (q) => q.eq("loginId", loginId))
      .first();
    return found !== null;
  },
});

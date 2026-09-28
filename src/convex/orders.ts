import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Record a concierge brief. The brief itself is delivered to the team via
 * WhatsApp; this row is a lightweight trace so nothing gets lost.
 *
 * Only signed-in members can place an order — anonymous visitors are refused
 * and invited to create their account first.
 */
export const createOrder = mutation({
  args: {
    pack: v.string(),
    name: v.string(),
    email: v.string(),
    details: v.string(),
    cardTier: v.optional(
      v.union(v.literal("standard"), v.literal("pro"), v.literal("independent")),
    ),
  },
  handler: async (ctx, { pack, name, email, details, cardTier }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Please sign in (or create your free 5-digit-ID account) before ordering.");
    }
    const user = await ctx.db.get(userId);
    return await ctx.db.insert("serviceOrders", {
      userId,
      pack: pack || "whatsapp",
      name: name.trim(),
      email: email.trim() || user?.email || "-",
      details: details.trim(),
      cardTier,
      status: "new",
    });
  },
});

/**
 * The signed-in client's own orders, newest first — powers the dashboard
 * card preview (the NFC card model chosen at order time).
 */
export const myOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("serviceOrders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(5);
  },
});

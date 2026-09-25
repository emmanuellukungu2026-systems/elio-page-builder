import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Record a concierge brief. The brief itself is delivered to the team via
 * WhatsApp; this row is a lightweight trace so nothing gets lost.
 *
 * Only signed-in members can place an order — anonymous visitors are refused
 * and invited to create their 5-digit-ID account first.
 */
export const createOrder = mutation({
  args: {
    pack: v.string(),
    name: v.string(),
    email: v.string(),
    details: v.string(),
  },
  handler: async (ctx, { pack, name, email, details }) => {
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
      status: "new",
    });
  },
});

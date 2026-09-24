import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    // One personal Elio page per user
    elioPages: defineTable({
      userId: v.id("users"),
      username: v.string(), // unique, 3-24 chars, lowercase
      displayName: v.string(),
      headline: v.optional(v.string()), // e.g. "Developer • Creator"
      bio: v.optional(v.string()),
      story: v.optional(v.string()),
      location: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      accent: v.optional(v.string()), // accent color hex for the public page
      email: v.optional(v.string()), // contact: email
      whatsapp: v.optional(v.string()), // contact: whatsapp number
      instagram: v.optional(v.string()), // contact: instagram handle or url
      linkedin: v.optional(v.string()), // contact: linkedin handle or url
      isPublished: v.optional(v.boolean()),
      updatedAt: v.optional(v.number()),
      items: v.array(
        v.object({
          id: v.string(),
          kind: v.string(), // project | portfolio | idea | service | price
          title: v.string(),
          description: v.optional(v.string()),
          imageUrl: v.optional(v.string()),
          linkUrl: v.optional(v.string()),
          tags: v.optional(v.array(v.string())),
        }),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_username", ["username"]),

    // Orders for the concierge service ("commander une page personnalisée et pro")
    serviceOrders: defineTable({
      userId: v.optional(v.id("users")),
      pack: v.string(), // essentiel | signature | prestige
      name: v.string(),
      email: v.string(),
      details: v.string(), // brief / links / notes
      status: v.optional(v.string()), // new | in_progress | done | cancelled
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;

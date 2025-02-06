import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { populateUser } from "./helper";

const getCommunityUserCount = async (
   ctx: QueryCtx,
   communityId: Id<"communities">
) => {
   const count = await ctx.db
      .query("userCommunities")
      .filter((q) => q.eq(q.field("communityId"), communityId))
      .collect();

   if (Array.isArray(count)) {
      return count.length;
   }

   return 0;
};

export const getCommunities = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const communities = await ctx.db.query("communities").collect();

      const userCommunities = await ctx.db
         .query("userCommunities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const joinedCommunityIds = new Set(
         userCommunities.map((uc) => uc.communityId.toString())
      );

      const refactoredCommunities = await Promise.all(
         communities
            .filter(
               (community) => !joinedCommunityIds.has(community._id.toString())
            )
            .map(async (community) => ({
               ...community,
               userCount: await getCommunityUserCount(ctx, community._id),
            }))
      );

      return refactoredCommunities;
   },
});

export const getCommunity = query({
   args: {
      communityId: v.id("communities"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const community = await ctx.db.get(args.communityId);

      if (!community) {
         throw new Error("Community not found");
      }

      return {
         ...community,
         userCount: await getCommunityUserCount(ctx, community._id),
         user: await populateUser(ctx, community.userId),
         isFollowing: !!await ctx.db
           .query("userCommunities")
           .filter((q) =>
               q.and(
                  q.eq(q.field("userId"), userId),
                  q.eq(q.field("communityId"), community._id)
               )
           )
           .first(),
      };
   },
});

const populateCommunities = async (
   ctx: QueryCtx,
   communityId: Id<"communities">
) => {
   const communities = await ctx.db
      .query("communities")
      .filter((q) => q.eq(q.field("_id"), communityId))
      .first();

   return {
      ...communities,
   };
};

export const getMyCommunities = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const communities = await ctx.db
         .query("userCommunities")
         .filter((q) => q.eq(q.field("userId"), userId))
         .collect();

      const refactoredCommunities = await Promise.all(
         communities.map(async (community) => ({
            ...community,
            community: await populateCommunities(ctx, community.communityId),
            userCount: await getCommunityUserCount(ctx, community.communityId),
         }))
      );

      return refactoredCommunities;
   },
});

export const createCommunity = mutation({
   args: {
      name: v.string(),
      description: v.optional(v.string()),
      image: v.string(),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const community = await ctx.db.insert("communities", {
         name: args.name,
         image: args.image,
         description: args.description,
         createdAt: new Date().toISOString(),
         userId,
      });

      await ctx.db.insert("userCommunities", {
         userId,
         communityId: community,
      });

      return community;
   },
});

export const joinCommunity = mutation({
   args: {
      communityId: v.id("communities"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const existingMembership = await ctx.db
         .query("userCommunities")
         .filter((q) =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("communityId"), args.communityId)
            )
         )
         .first();

      if (existingMembership) {
         await ctx.db.delete(existingMembership._id);
         return { success: true };
      }

      await ctx.db.insert("userCommunities", {
         userId,
         communityId: args.communityId,
      });
      return { success: true };
   },
});

export const leaveCommunity = mutation({
   args: {
      communityId: v.id("communities"),
   },
   handler: async (ctx, args) => {
      const userId = await getAuthUserId(ctx);

      if (!userId) {
         throw new Error("Unauthorized");
      }

      const community = await ctx.db
         .query("communities")
         .filter((q) => q.eq(q.field("_id"), args.communityId))
         .first();

      if (community?.userId === userId) {
         throw new Error("Community owner cannot leave their own community");
      }

      const membershipToDelete = await ctx.db
         .query("userCommunities")
         .filter((q) =>
            q.and(
               q.eq(q.field("userId"), userId),
               q.eq(q.field("communityId"), args.communityId)
            )
         )
         .first();

      if (!membershipToDelete) {
         throw new Error("You are not a member of this community");
      }

      await ctx.db.delete(membershipToDelete._id);

      return { success: true };
   },
});

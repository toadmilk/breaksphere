import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getById: publicProcedure.input(z.object({ id: z.string()})).query(async ({
        input: { id }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        const profile = await ctx.prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                id: true,
                image: true,
                bio: true,
                location: true,
                website: true,
                _count: { select: { followers: true, following: true, posts: true } },
                followers: currentUserId == null ? undefined : { where: { id: currentUserId } },
            },
        });

        if (profile == null) return;

        return {
            name: profile.name ?? "",
            image: profile.image ?? "",
            id: profile.id,
            bio: profile.bio ?? "",
            location: profile.location ?? "",
            website: profile.website ?? "",
            followersCount: profile._count.followers,
            followsCount: profile._count.following,
            postsCount: profile._count.posts,
            isFollowing: profile.followers.length > 0,
        }
    }),
    toggleFollow: protectedProcedure.input(z.object({ userId: z.string()}))
    .mutation(async ({ input: { userId }, ctx }) => {
        const currentUserId = ctx.session.user.id;
        const existingFollow = await ctx.prisma.user.findFirst({
            where: { id: userId, followers: { some: { id: currentUserId } } }, });

        let addedFollow;
        if (existingFollow == null) {
            await ctx.prisma.user.update({
                where: { id: userId },
                data: { followers: { connect: { id: currentUserId } } },
            })
            addedFollow = true;
        } else {
            await ctx.prisma.user.update({
                where: { id: userId },
                data: { followers: { disconnect: { id: currentUserId } } },
            })
            addedFollow = false;
        }

        void ctx.revalidateSSG?.(`/profiles/${userId}`);
        void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);
        return { addedFollow };
    }),
    getFollowers: publicProcedure.input(z.object({ id: z.string(), title: z.string() }))
      .query(async ({ input: { id, title }, ctx }) => {
          const currentUserId = ctx.session?.user.id;

          if (title === "Followers") {
              const followers = await ctx.prisma.user.findMany({
                  where: { following: { some: { id } } },
                  select: { id: true, name: true, image: true },
              });

              return followers ?? null;
          }

          if (title === "Following") {
              const following = await ctx.prisma.user.findMany({
                  where: { followers: { some: { id } } },
                  select: { id: true, name: true, image: true },
              });

              return following ?? null;
          }

          if (title === "Who to follow" && currentUserId) {
              const suggestedUsers = await ctx.prisma.user.findMany({
                  where: {
                      following: { some: { id: currentUserId } },
                      followers: { none: { id: currentUserId } }
                  },
                  select: { id: true, name: true, image: true }
              });

              if (suggestedUsers) { return suggestedUsers; }
          }

          return null;
      }),
    editProfile: protectedProcedure.input(z.object({
          name: z.string(),
          bio: z.string(),
          location: z.string(),
          website: z.string(),
      }))
      .mutation(async ({ input: { name, bio, location, website }, ctx }) => {
        const currentUserId = ctx.session.user.id;
        const user = await ctx.prisma.user.update({
          where: { id: currentUserId },
          data: { name, bio, location, website },
        });
        void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);
        return user;

    }),
})
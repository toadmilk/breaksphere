import { z } from "zod";
import {
    type createTRPCContext,
    createTRPCRouter,
    protectedProcedure, publicProcedure
} from "~/server/api/trpc";
import { type inferAsyncReturnType } from "@trpc/server";
import { type Prisma } from ".prisma/client";

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
                _count: { select: { followers: true, following: true, posts: true } },
                followers: currentUserId == null ? undefined : { where: { id: currentUserId } },
            },
        });

        if (profile == null) return;

        return {
            name: profile.name,
            image: profile.image,
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

        void ctx.revalidateSSG?.(`/profile/${userId}`);
        void ctx.revalidateSSG?.(`/profile/${currentUserId}`);

        return { addedFollow };
    }),
})
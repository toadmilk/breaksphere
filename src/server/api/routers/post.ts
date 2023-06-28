import { z } from "zod";
import {
    type createTRPCContext,
    createTRPCRouter,
    protectedProcedure, publicProcedure
} from "~/server/api/trpc";
import { type inferAsyncReturnType } from "@trpc/server";
import { type Prisma } from ".prisma/client";

export const postRouter = createTRPCRouter({
    infiniteProfileFeed: publicProcedure.input(
      z.object({
          userId: z.string(),
          limit: z.number().optional(),
          cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    ).query(async ({ input: { limit = 25, userId, cursor }, ctx }) => {
        return await getInfinitePosts({
            limit,
            ctx,
            cursor,
            whereClause: { userId },
        })
    }),
    infiniteFeed: publicProcedure.input(
        z.object({
            onlyFollowing: z.boolean().optional(),
            limit: z.number().optional(),
            cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        })
    ).query(async ({ input: { limit = 25, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfinitePosts({
            limit, ctx, cursor, whereClause: currentUserId == null || !onlyFollowing ? undefined : {
                user: {
                    followers: {
                        some: { id: currentUserId },
                    }
                }
            },
        })
    }),
    create: protectedProcedure
        .input(z.object({ content: z.string() }))
        .mutation(async ({ input: { content }, ctx }) => {
        const post = await ctx.prisma.post.create({ data: { content, userId: ctx.session.user.id } });
        void ctx.revalidateSSG?.(`/profile/${ctx.session.user.id}`);
        return post;
    }),
    toggleLike: protectedProcedure.input(z.object({ id: z.string() }))
        .mutation(async ({ input: { id }, ctx }) => {
            const data = { postId: id, userId: ctx.session.user.id };
            const existingLike = await ctx.prisma.like.findUnique({
                where: { userId_postId: data }
            })

            if (existingLike == null) {
                await ctx.prisma.like.create({data})
                return { addedLike: true }
            } else {
                await ctx.prisma.like.delete({where: {userId_postId: data}})
                return { addedLike: false }
            }
        }),
});

async function getInfinitePosts({
  whereClause,
  ctx,
    limit,
    cursor,
}: {
    whereClause?: Prisma.PostWhereInput,
    limit: number,
    cursor: { id: string, createdAt: Date} | undefined;
    ctx: inferAsyncReturnType<typeof createTRPCContext>
}) {
    const currentUserId = ctx.session?.user.id;

    const data = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        where: whereClause,
        select: {
            id: true,
            content: true,
            createdAt: true,
            _count: { select: { likes: true } },
            likes:
              currentUserId == null ? false
                : { where: { userId: currentUserId }},
            user: {
                select: { id: true, name: true, image: true }
            },
        }
    });
    let nextCursor: typeof cursor | undefined;
    if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem) {
            nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
    }
    return { posts: data.map(post => {
            return {
                id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                likeCount: post._count.likes,
                user: post.user,
                likedByMe: post.likes?.length > 0,
            }
        }), nextCursor };
}
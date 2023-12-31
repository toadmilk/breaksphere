import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "~/components/ProfileImage";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { ConfirmModal } from "~/components/ConfirmModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { HeartButton, DeleteButton, ShareButton } from "~/components/PostButtons";

type Post = {
    id: string,
    content: string,
    createdAt: Date,
    likeCount: number,
    likedByMe: boolean,
    user: {
        id: string;
        image: string | null;
        name: string | null;
    },
}

type InfinitePostListProps = {
    isLoading: boolean;
    isError: boolean;
    hasMore: boolean | undefined;
    fetchNewPosts: () => Promise<unknown>;
    posts?: Post[];
}

export function InfinitePostList({
    posts,
    isError,
    isLoading,
    fetchNewPosts,
    hasMore = false,
}: InfinitePostListProps) {
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <h1>Error...</h1>

    if (posts == null || posts.length === 0) {
        return <h2 className="my-4 text-center text-2x1 text-neutral-500">No Posts</h2>
    }

    return (
        <ul>
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchNewPosts}
                hasMore={hasMore}
                loader={<LoadingSpinner />}
                className="hide-scrollbar"
                >
                {posts.map((post) => {
                    return <PostCard key={post.id} {...post} />;
                })}
            </InfiniteScroll>
        </ul>
    )
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
});

function PostCard({
    id,
    user,
    content,
    createdAt,
    likeCount,
    likedByMe,
}: Post) {
    const trpcUtils = api.useContext();
    const toggleLike = api.post.toggleLike.useMutation({ onSuccess: ({
        addedLike}) => {
        const updateData: Parameters<typeof trpcUtils.post.infiniteFeed.setInfiniteData>[1] = (oldData) => {
            if (oldData == null) return;

            const countModifier = addedLike ? 1 : -1;

            return {
                ...oldData,
                pages: oldData.pages.map(page => {
                    return {
                        ...page,
                        posts: page.posts.map(post => {
                            if (post.id === id) {
                                return {
                                    ...post,
                                    likedByMe: addedLike,
                                    likeCount: post.likeCount + countModifier,
                                }
                            }
                            return post;
                        })
                    }
                })
            }
        }
            trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
            trpcUtils.post.infiniteFeed.setInfiniteData({ onlyFollowing: true }, updateData);
            trpcUtils.post.infiniteProfileFeed.setInfiniteData({ userId: user.id }, updateData);
        },
        onError: (error) => {
            toast.error(error.message + " 💀");
        }
      },
    );

    function handleToggleLike() {
        toggleLike.mutate({id});
    }

    const deletePost = api.post.delete.useMutation({
        onSuccess: () => {
            const updateData: Parameters<typeof trpcUtils.post.infiniteFeed.setInfiniteData>[1] = (oldData) => {
                if (oldData == null) return;

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => {
                        return {
                            ...page,
                            posts: page.posts.filter(post => post.id !== id),
                        }
                    })
                }
            }
            toast.success('Post deleted! 😄');
            trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
            trpcUtils.post.infiniteFeed.setInfiniteData({ onlyFollowing: true }, updateData);
            trpcUtils.post.infiniteProfileFeed.setInfiniteData({ userId: user.id }, updateData);
        },
        onError: (error) => {
            toast.error(error.message + " 💀");
        },
    });

    const session = useSession();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    function openDeleteModal() {
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setIsDeleteModalOpen(false);
    }

    function handleDeletePost() {
        if (session.data?.user.id != user.id) {
            return;
        }
        deletePost.mutate({id});
    }

    // href={`/posts/${id}`}
    return (
        <li className="flex gap-4 border-b dark:border-neutral-700 px-4 py-4 relative">
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                content="Are you sure you want to delete this post?"
                onCancel={closeDeleteModal}
                onConfirm={handleDeletePost}
            />
            <a href={`/profiles/${user.id}`} className="z-1">
                <ProfileImage src={user.image} />
            </a>
            <div className="flex min-w-0 flex-grow flex-col">
                <div className="flex min-w-0 break-words gap-1">
                    <a
                        href={`/profiles/${user.id}`}
                        className="font-bold min-w-0 break-words z-1 hover:underline focus-visible:underline dark:text-white"
                    >
                        <p className="truncate">{user.name}</p>
                    </a>
                    <span className="text-neutral-500">{dateTimeFormatter.format(createdAt)}</span>
                </div>
                <p className="min-w-0 break-words py-1 dark:text-white">{content}</p>
                <div className="flex z-1">
                    <HeartButton onClick={handleToggleLike} isLoading={toggleLike.isLoading} likedByMe={likedByMe} likeCount={likeCount} id={id} />
                    <DeleteButton onClick={openDeleteModal} postOwnerId={user.id} />
                    {/*<ShareButton postId={id}/> TODO: Reenable*/}
                </div>
            </div>
        </li>
    );
}
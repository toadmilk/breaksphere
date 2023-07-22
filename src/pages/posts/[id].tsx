import { type GetStaticPaths, type GetStaticPropsContext, type InferGetStaticPropsType, type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { ssgHelper } from "~/server/api/ssgHelper";
import { toast } from "react-toastify";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { useState } from "react";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeartButton, DeleteButton, ShareButton } from "~/components/PostButtons";
import { ConfirmModal } from "~/components/ConfirmModal";
import { ProfileImage } from "~/components/ProfileImage";

const PostPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  { id }
) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const { data: post } = api.post.getById.useQuery({ id });

  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: (data, postId) => {
      const { addedLike } = data;
      if (addedLike) {
        toast.success('Like added! 🥺');
      } else {
        toast.success('Like removed! 😢');
      }
    },
    onError: (error) => {
      toast.error(error.message + ' 💀');
    },
  });

  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      toast.success('Post deleted! 😄');
      await (async () => {
        await router.push('/');
      })();
    },
    onError: (error) => {
      toast.error(error.message + ' 💀');
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function handleDeletePost() {
    if (!user || session.data?.user.id != user.id) {
      return;
    }
    deletePost.mutate({ id });
  }

  if (!post) {
    return <LoadingSpinner />;
  }

  const postCreatedAt = post ? dateTimeFormatter.format(post.createdAt) : "";

  return (
    <div className="dark:bg-black">
      <header className="dark:text-white flex items-center">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6 dark:fill-white" />
          </IconHoverEffect>
        </Link>
        <h1 className="text-2xl font-bold">Post</h1>
      </header>
      <main>
        <li className="flex gap-4 border-b dark:border-neutral-700 px-4 py-4">
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            content="Are you sure you want to delete this post?"
            onCancel={closeDeleteModal}
            onConfirm={handleDeletePost}
          />
          <Link href={`/profiles/${post.user.id}`}>
            <ProfileImage src={post.user.image} />
          </Link>
          <div className="flex flex-grow flex-col min-w-0">
            <div className="flex gap-1">
              <Link
                href={`/profiles/${post.user.id}`}
                className="font-bold text-lg hover:underline focus-visible:underline dark:text-white"
              >
                {post.user.name}
              </Link>
              {/*<span className="text-neutral-500">@{user.id} · </span> TODO: add this back when users can change their ids*/}
            </div>
            <span className="text-neutral-500">@{post.user.id}</span>
            <p className="min-w-0 break-words py-1 dark:text-white">{post.content}</p>
            <span className="text-neutral-500" suppressHydrationWarning={true}>{postCreatedAt}</span>
            <div className="flex">
              <HeartButton
                onClick={handleToggleLike}
                isLoading={toggleLike.isLoading}
                likedByMe={post.likedByMe}
                likeCount={post.likeCount}
                id={post.id}
              />
              <DeleteButton onClick={openDeleteModal} postOwnerId={post.user.id} />
              <ShareButton postId={post.id}/>
            </div>
          </div>
        </li>
      </main>
    </div>
  );
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  month: "short",
  year: "numeric",
  day: "numeric",
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export async function getStaticProps(context: GetStaticPropsContext<{id: string}>) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/"
      }
    }
  }

  const ssg = ssgHelper();
  await ssg.post.getById.prefetch({id});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    }
  }
}

export default PostPage;
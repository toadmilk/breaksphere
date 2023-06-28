import { type GetStaticPaths, type GetStaticPropsContext, type InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import { ProfileImage } from "~/components/ProfileImage";
import { InfinitePostList } from "~/components/InfinitePostList";
import { Button } from "~/components/Button";
import { useSession } from "next-auth/react";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  {
    id,
  }
) => {
  const { data: profile } = api.profile.getById.useQuery({id});
  const posts = api.post.infiniteProfileFeed.useInfiniteQuery({ userId: id},
    { getNextPageParam: (lastPage) => lastPage.nextCursor });

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id}, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        }
      })
    }
  })

  return (
    <>
      <Head>
        <title>{`BreakSphere - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.postsCount}{" "}
            {getPlural(profile.postsCount, "Post", "Posts")} -{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
            {profile.followsCount}{" "}
            {getPlural(profile.followsCount, "Follow", "Followers")}
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          isLoading={toggleFollow.isLoading}
          userId={id}
          onClick={() => toggleFollow.mutate({userId: id})} />
      </header>
      <main>
        <InfinitePostList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage}
          fetchNewPosts={posts.fetchNextPage}
        />
      </main>
    </>
  )
}

function FollowButton( {
userId,
isFollowing,
isLoading,
onClick }: {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }
  return <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
    {isFollowing ? "Unfollow" : "Follow"}
  </Button>
}

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

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
  await ssg.profile.getById.prefetch({id});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    }
  }

}

export default ProfilePage;
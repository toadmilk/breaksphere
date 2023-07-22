import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import { ProfileImage } from "~/components/ProfileImage";
import { InfinitePostList } from "~/components/InfinitePostList";
//import { FollowBar } from "~/components/FollowBar";
import FollowButton from "~/components/FollowButton";
import { toggleFollowFunc } from "~/utils/toggleFollowFunc";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { useSession } from "next-auth/react";
import { FiMapPin } from "react-icons/fi";
import { AiOutlineLink } from "react-icons/ai";
import { EditProfileModal } from "~/components/EditProfileModal";
import { FollowBarModal } from "~/components/FollowBar";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const session = useSession();
  const userId = session.data?.user.id;
  const profile = api.profile.getById.useQuery({ id });
  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const [isEditProfileModalOpen, setEditProfileModalState] = useState(false);
  const toggleEditProfileModal = () =>
    setEditProfileModalState(!isEditProfileModalOpen);
  const [isFollowersModalOpen, setFollowersModalState] = useState(false);
  const toggleFollowersModal = () =>
    setFollowersModalState(!isFollowersModalOpen);
  const [isFollowingModalOpen, setFollowingModalState] = useState(false);
  const toggleFollowingModal = () =>
    setFollowingModalState(!isFollowingModalOpen);

  // Reset modals when navigating to a different profile
  useEffect(() => {
    setEditProfileModalState(false);
    setFollowersModalState(false);
    setFollowingModalState(false);
  }, [id]);

  if (profile == null || profile.data?.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  const toggleFollow = toggleFollowFunc(id);

  //hidden sm:block
  return (
    <>
      {isFollowersModalOpen && (
        <FollowBarModal
          title={"Followers"}
          isOpen={isFollowersModalOpen}
          onClose={toggleFollowersModal}
          id={id}
        />
      )}
      {isFollowingModalOpen && (
        <FollowBarModal
          title={"Following"}
          isOpen={isFollowingModalOpen}
          onClose={toggleFollowingModal}
          id={id}
        />
      )}
      {isEditProfileModalOpen && (
        <EditProfileModal
          title={"Edit Profile"}
          isOpen={isEditProfileModalOpen}
          onClose={toggleEditProfileModal}
          profile={profile.data ?? undefined}
        />
      )}
      <Head>
        <title>{`BreakSphere - ${profile.data?.name}`}</title>
      </Head>
      {profile.isLoading ? (
        <div>Loading...</div>
      ) : (
        <header className="sticky top-0 z-20 grid min-w-0 grid-cols-[repeat(3,auto)] items-center gap-2 border-b bg-white px-4 py-2 dark:border-neutral-700 dark:bg-black md:grid-cols-[repeat(2,auto)_1fr_auto]">
          <Link href="..">
            <IconHoverEffect>
              <VscArrowLeft className="h-6 w-6 dark:fill-white" />
            </IconHoverEffect>
          </Link>
          <ProfileImage src={profile.data?.image} className="flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="min-w-0 break-words text-lg font-semibold dark:text-white">
              {profile.data?.name}
            </h1>
            <span className="min-w-0 break-words text-neutral-500">
              @{profile.data?.id}
            </span>
          </div>
          <div className="hidden sm:block">
            {profile.data?.id === userId && (
              <Button onClick={toggleEditProfileModal}>Edit Profile</Button>
            )}
            <FollowButton
              isFollowing={profile.data?.isFollowing}
              isLoading={toggleFollow.isLoading}
              userId={id}
              onClick={() => toggleFollow.mutate({ userId: id })}
            />
          </div>
          <div className="col-start-1 min-w-0 md:col-start-3">
            <div className="pb-1 sm:hidden">
              {profile.data?.id === userId && (
                <Button onClick={toggleEditProfileModal}>Edit Profile</Button>
              )}
              <FollowButton
                isFollowing={profile.data?.isFollowing}
                isLoading={toggleFollow.isLoading}
                userId={id}
                onClick={() => toggleFollow.mutate({ userId: id })}
              />
            </div>
            <div className="flex flex-col items-start">
              {profile.data?.bio ? (
                <span className="min-w-0 max-w-full break-words pb-2 dark:text-white">
                  {profile.data?.bio}
                </span>
              ) : null}
              {profile.data?.location ? (
                <div className="flex items-center">
                  <FiMapPin
                    className="h-5 w-5 flex-shrink-0 stroke-current text-neutral-600 dark:text-neutral-300"
                    style={{ transform: "translateY(0.25px)" }}
                  />
                  <span className="ml-1 truncate text-neutral-600 dark:text-neutral-300">
                    {profile.data?.location}
                  </span>
                </div>
              ) : null}
              {profile.data?.website ? (
                <div className="flex items-center">
                  <AiOutlineLink className="h-5 w-5 flex-shrink-0 fill-neutral-600 dark:fill-neutral-300" />
                  {profile.data?.website && (
                    <Link
                      className="ml-1 truncate text-blue-600 hover:underline dark:text-blue-500"
                      href={profile.data?.website}
                      title={profile.data?.website}
                    >
                      {profile.data?.website}
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
            <div className="pt-1 text-neutral-500">
              <span className="font-semibold text-black dark:text-white">
                {profile.data?.postsCount}
              </span>
              {" "}
              {getPlural(profile.data?.postsCount, "Post", "Posts")}
              {/*-{" "}*/}
              <div>
                <button onClick={toggleFollowersModal} className="hover:underline">
                  <span className="font-semibold text-black dark:text-white">
                    {profile.data?.followersCount}
                  </span>{" "}
                  {getPlural(profile.data?.followersCount, "Follower", "Followers")}
                </button>{" "}
                -{" "}
                <button onClick={toggleFollowingModal} className="hover:underline">
                  <span className="font-semibold text-black dark:text-white">
                    {profile.data?.followsCount}
                  </span>{" "}
                  {getPlural(profile.data?.followsCount, "Follow", "Following")}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
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
  );
};

const pluralRules = new Intl.PluralRules();

function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;

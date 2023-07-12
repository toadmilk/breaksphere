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
//import { FollowBar } from "~/components/FollowBar";
import FollowButton from "~/components/FollowButton";
import { toggleFollowFunc } from "~/utils/toggleFollowFunc";
import { useEffect, useState } from "react";
import { EditProfileModal } from "~/components/EditProfileModal";
import { Button } from "~/components/Button";
import { useSession } from "next-auth/react";
import { FaLocationDot } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";
import { FollowBarModal } from "~/components/FollowBar";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  {
    id,
  }
) => {
  const session = useSession();
  const userId = session.data?.user.id;
  const { data: profile } = api.profile.getById.useQuery({id});
  const posts = api.post.infiniteProfileFeed.useInfiniteQuery({ userId: id},
    { getNextPageParam: (lastPage) => lastPage.nextCursor });

  const [isEditProfileModalOpen, setEditProfileModalState] = useState(false);
  const toggleEditProfileModal = () => setEditProfileModalState(!isEditProfileModalOpen);
  const [isFollowersModalOpen, setFollowersModalState] = useState(false);
  const toggleFollowersModal = () => setFollowersModalState(!isFollowersModalOpen);
  const [isFollowingModalOpen, setFollowingModalState] = useState(false);
  const toggleFollowingModal = () => setFollowingModalState(!isFollowingModalOpen);

  // Reset modals when navigating to a different profile
  useEffect(() => {
    setEditProfileModalState(false);
    setFollowersModalState(false);
    setFollowingModalState(false);
  }, [id]);

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  const toggleFollow = toggleFollowFunc(id);

  //hidden sm:block
  return (
    <>
      <FollowBarModal title={'Followers'} isOpen={isFollowersModalOpen} onClose={toggleFollowersModal} id={id} />
      <FollowBarModal title={'Following'} isOpen={isFollowingModalOpen} onClose={toggleFollowingModal} id={id} />
      <EditProfileModal title={'Edit Profile'} isOpen={isEditProfileModalOpen} onClose={toggleEditProfileModal} profile={profile} />
      <Head>
        <title>{`BreakSphere - ${profile.name}`}</title>
      </Head>
      <header className="min-w-0 sticky top-0 z-20 grid grid-cols-[repeat(2,auto)_1fr_auto] items-center gap-2 border-b bg-white px-4 py-2 dark:border-neutral-700 dark:bg-black">
        <Link href=".." className="">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6 dark:fill-white" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="min-w-0 break-words">
          <h1 className="text-lg font-bold dark:text-white">{profile.name}</h1>
          <span className="text-neutral-500">@{profile.id}</span>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          isLoading={toggleFollow.isLoading}
          userId={id}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
        {profile.id === userId && (
          <Button className="hidden sm:block" onClick={toggleEditProfileModal}>
            Edit Profile
          </Button>
        )}
        <div className="col-start-3 min-w-0 break-words">
          {profile.id === userId && (
            <Button className="sm:hidden my-1" onClick={toggleEditProfileModal}>
              Edit Profile
            </Button>
          )}
          <div className="flex flex-col items-start">
            {profile.bio ? (
              <p className="break-words dark:text-white pb-2">{profile.bio}</p>
            ) : null}
            {profile.website ? (
              <div className="flex">
                <BsGlobe className="w-5 h-5 fill-neutral-500 dark:fill-neutral-300" />
                <Link
                  className="break-all text-blue-600 dark:text-blue-500 hover:underline ml-1"
                  href={profile.website}
                >
                  {profile.website}
                </Link>
              </div>
            ) : null}
            {profile.location ? (
              <div className="flex">
                <FaLocationDot className="w-5 h-5 fill-neutral-500 dark:fill-neutral-300" />
                <span className="text-neutral-500 dark:text-neutral-300 ml-1">{profile.location}</span>
              </div>
            ) : null}
          </div>
          <div className="text-neutral-500">
            <span className="font-semibold text-black dark:text-white">{profile.postsCount}</span>{" "}
            {getPlural(profile.postsCount, "Post", "Posts")} -{" "}
            <button onClick={toggleFollowersModal} className="hover:underline">
              <span className="font-semibold text-black dark:text-white">{profile.followersCount}</span>{" "}
              {getPlural(profile.followersCount, "Follower", "Followers")}
            </button>{" "}
            -{" "}
            <button onClick={toggleFollowingModal} className="hover:underline">
              <span className="font-semibold text-black dark:text-white">{profile.followsCount}</span>{" "}
              {getPlural(profile.followsCount, "Follow", "Following")}
            </button>
          </div>
        </div>
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
  );
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
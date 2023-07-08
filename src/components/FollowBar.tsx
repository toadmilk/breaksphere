import { api } from "~/utils/api";
import { ProfileImage } from "~/components/ProfileImage";
import FollowButton from "~/components/FollowButton";
import { toggleFollowFunc } from "~/utils/toggleFollowFunc";
import Link from "next/link";

function userCard(
  user: {
    id: string;
    name: string | null;
    image: string | null;
  },
  id: string,
) {

  // const toggleFollow = toggleFollowFunc(user.id);

  return (
    <div className="flex items-center gap-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} className="w-12 h-12 rounded-full" />
      </Link>
      <div className="flex flex-col">
        <Link
          href={`/profiles/${user.id}`}
          className="font-bold hover:underline focus-visible:underline dark:text-white">
          {user.name}
        </Link>
        <span className="text-neutral-500">@{user.id}</span>
      </div>
      {/*<FollowButton*/}
      {/*  isFollowing={true} //TODO: Fix this*/}
      {/*  isLoading={toggleFollow.isLoading}*/}
      {/*  userId={id}*/}
      {/*  onClick={() => toggleFollow.mutate({userId: id})}*/}
      {/*/>*/}
    </div>
  );
}

type FollowBarProps = {
  id: string;
  title: string;
  modal?: boolean;
}

export function FollowBar({ id, title, modal = false }: FollowBarProps) {
  const profiles = api.profile.getFollowers.useQuery({ id, title });

  return (
    <div className="px-6 py-4 hidden lg:block">
      {profiles.data && profiles.data.length > 0 ? (
        <div className="bg-neutral-300 dark:bg-neutral-800 rounded-xl p-4">
          <h2 className="dark:text-white text-xl font-semibold">{title}</h2>
          <div className="flex flex-col gap-6 mt-4">
            {profiles.data.map((user) => {
              return userCard(user, id);
            })}
          </div>
        </div>
      ) : (
        modal && (
          <h1 className="text-2xl font-bold dark:text-white mt-4">
            {title === "Followers"
              ? "No Followers :("
              : "You aren't following anyone"}
          </h1>
        )
      )}
    </div>
  );
}
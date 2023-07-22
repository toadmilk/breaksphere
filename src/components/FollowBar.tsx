import { api } from "~/utils/api";
import { ProfileImage } from "~/components/ProfileImage";
import FollowButton from "~/components/FollowButton";
import { toggleFollowFunc } from "~/utils/toggleFollowFunc";
import Link from "next/link";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { LoadingSpinner } from "~/components/LoadingSpinner";

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
    <div key={id} className="flex items-center gap-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} className="w-12 h-12 rounded-full" />
      </Link>
      <div className="flex flex-col min-w-0 break-words max-w-full">
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
}

export function FollowBar({ id, title, }: FollowBarProps) {
  if (id == null) return null;
  const profiles = api.profile.getFollowers.useQuery({ id, title });

  return (
    <>
      {profiles.isLoading ? (
        <LoadingSpinner />
      ) : profiles.data && profiles.data.length > 0 ? (
      <div className="px-6 py-4 hidden lg:block">
          <div className="bg-neutral-300 dark:bg-neutral-800 rounded-xl p-4">
            <h2 className="dark:text-white text-xl font-semibold">{title}</h2>
            <div className="flex flex-col gap-6 mt-4">
              {profiles.data.map((user) => {
                return userCard(user, id);
              })}
            </div>
          </div>
      </div>
      ) : null }
    </>
  );
}

interface ModalProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FollowBarModal: React.FC<ModalProps> = ({ id, title, isOpen, onClose }) => {
  const outsideRef = React.useRef(null);
  const profiles = api.profile.getFollowers.useQuery({ id, title });

  const handleCloseOnOverlay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  }

  return isOpen ? (
    <div className={'fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 dark:text-white py-2'}>
      <div ref={outsideRef} className={'modal__overlay dark:bg-black'} onClick={handleCloseOnOverlay} />
      <div
        className="max-w-md rounded-lg shadow-xl w-full overflow-y-auto"
        style={{ maxHeight: profiles.data ? 2 * 48 + 600 : 600 }} //Totally non scuffed dynamic rendering
      >
      <div className="px-6 py-4 bg-neutral-300 dark:bg-neutral-800 rounded-xl hidden lg:block">
        <div className="flex items-center justify-end">
          <button onClick={onClose}>
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>
          {profiles.isLoading ? (
            <LoadingSpinner />
          ) : profiles.data && profiles.data.length > 0 ? (
            <div>
              <h2 className="dark:text-white text-xl font-semibold">{title}</h2>
              <div className="flex flex-col gap-6 mt-4">
                {profiles.data.map((user) => {
                  return userCard(user, id);
                })}
              </div>
            </div>
          ) : (
            <h1 className="dark:text-white text-xl font-semibold">
              {title === "Followers"
                ? "No Followers :("
                : "You aren't following anyone. Check out Who to Follow!"}
            </h1>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

type LikedByModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export const LikedByModal: React.FC<LikedByModalProps> = ({ isOpen, onClose, id }) => {
  const outsideRef = React.useRef(null);
  const likedBy = api.post.getLikedBy.useQuery({ id });

  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  };

  return isOpen ? (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 py-2 backdrop-blur-sm dark:text-white"
      }
    >
      <div
        ref={outsideRef}
        className={"modal__overlay dark:bg-black"}
        onClick={handleCloseOnOverlay}
      />
      <div
        className="w-full max-w-md overflow-y-auto rounded-lg shadow-xl"
        style={{ maxHeight: likedBy.data ? 2 * 48 + 600 : 600 }} //Totally non scuffed dynamic rendering
      >
        <div className="hidden rounded-xl bg-neutral-300 px-6 py-4 dark:bg-neutral-800 lg:block">
          <div className="flex items-center justify-end">
            <button onClick={onClose}>
              <AiOutlineClose className="h-6 w-6" />
            </button>
          </div>
          {likedBy.isLoading ? (
            <LoadingSpinner />
          ) : likedBy.data && likedBy.data.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold dark:text-white">
                Liked By
              </h2>
              <div className="mt-4 flex flex-col gap-6">
                {likedBy.data.map((user) => {
                  return userCard(user, id);
                })}
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-semibold dark:text-white">
              No likes yet. Be the first!
            </h1>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
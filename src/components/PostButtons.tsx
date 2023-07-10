import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { BsTrashFill } from "react-icons/bs";

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
  isLoading: boolean;
  onClick: () => void;
}

export function HeartButton({
                       onClick,
                       isLoading,
                       likedByMe,
                       likeCount,
                     }: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if(session.status !== "authenticated") {
    return (<div className="mb-1 mt-1 flex items-center gap-3 self-start text-neutral-500">
      <HeartIcon />
      <span>{likeCount}</span>
    </div>)
  }
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 items-center gap-1 self-start flex transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-neutral-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <HeartIcon className={`w-5 h-5 transition-colors duration-200 ${
          likedByMe
            ? "fill-red-500"
            : "fill-neutral-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
        }`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  )
}

type DeleteButtonProps = {
  onClick: () => void;
  postOwnerId: string;
}

export function DeleteButton({
                        onClick,
                        postOwnerId,
                      }: DeleteButtonProps) {
  const session = useSession();

  if(session.status !== "authenticated" || session.data.user.id !== postOwnerId) {
    return null;
  }

  return (
    <button onClick={onClick} className="ml-3">
      <IconHoverEffect red>
        <BsTrashFill className="self-center w-5 h-5 transition-colors duration-100 fill-neutral-500 hover:fill-red-500 focus-visible:fill-red-500" />
      </IconHoverEffect>
    </button>
  )
}
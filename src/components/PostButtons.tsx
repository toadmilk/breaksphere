import { signIn, useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { BsTrashFill } from "react-icons/bs";
import Link from "next/link";
import { BiLogIn } from "react-icons/bi";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { LikedByModal } from "~/components/FollowBar";

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
  isLoading: boolean;
  onClick: () => void;
  id: string;
}

export function HeartButton({
  onClick,
  isLoading,
  likedByMe,
  likeCount,
  id,
}: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  const outsideRef = useRef(null);

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

  useEffect(() => {
    setIsLikesModalOpen(false);
  }, [id]);

  const openLikesModal = () => {
    setIsLikesModalOpen(true);
  }

  const closeLikesModal = () => {
    setIsLikesModalOpen(false);
  }

  if(session.status !== "authenticated") {
    return (<div className="mb-1 mt-1 flex items-center gap-3 self-start text-neutral-500">
      <button onClick={() => void signIn()}>
        <HeartIcon />
        <span>{likeCount}</span>
      </button>
    </div>)
  }
  return (
    <>
      {isLikesModalOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <LikedByModal isOpen={isLikesModalOpen} onClose={closeLikesModal} id={id} />
        </Suspense>
      )}
      <div className={`group -ml-2 items-center gap-1 self-start flex transition-colors duration-0   ${
        likedByMe
          ? "text-red-500"
          : "text-neutral-500 hover:text-red-500 focus-visible:text-red-500"
      }`}>
        <button
          disabled={isLoading}
          onClick={onClick}
        >
          <IconHoverEffect>
            <HeartIcon className={`w-5 h-5 transition-colors duration-0 ${
              likedByMe
                ? "fill-red-500"
                : "fill-neutral-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
            }`}
            />
          </IconHoverEffect>
        </button>
        <button onClick={openLikesModal}>
          <span>{likeCount}</span>
        </button>
      </div>
    </>
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
      <IconHoverEffect>
        <BsTrashFill className="self-center w-5 h-5 transition-colors duration-0 fill-neutral-500 hover:fill-red-500 focus-visible:fill-red-500" />
      </IconHoverEffect>
    </button>
  )
}

import React from 'react';
import { toast } from "react-toastify";
import { AiOutlineShareAlt } from "react-icons/ai";
import { LoadingSpinner } from "~/components/LoadingSpinner";

type ShareButtonProps = {
  postId: string;
}

export function ShareButton({ postId }: ShareButtonProps) {
  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        toast.success('Link copied to clipboard:' + postUrl + " 😄");
      })
      .catch((error) => {
        toast.error('Failed to copy link: ' + String(error) + ' 💀');
      });
  };

  return (
    <button className="" onClick={handleCopyLink}>
      <IconHoverEffect>
        <AiOutlineShareAlt className="self-center w-5 h-5 fill-neutral-500 hover:fill-neutral-500 focus-visible:fill-neutral-500" />
      </IconHoverEffect>
    </button>
  );
}

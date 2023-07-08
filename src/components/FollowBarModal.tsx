import React from "react";
import { FollowBar } from "~/components/FollowBar";
import { api } from "~/utils/api";
import { AiOutlineClose } from "react-icons/ai";
import { ProfileImage } from "~/components/ProfileImage";
import Uploader from "~/components/Uploader";
import { Button } from "~/components/Button";

interface ModalProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FollowBarModal: React.FC<ModalProps> = ({ id, title, isOpen, onClose }) => {
  const outsideRef = React.useRef(null);

  const handleCloseOnOverlay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  }

  return isOpen ? (
    <div className={'modal fixed inset-0 flex justify-center z-50 dark:text-white py-2'}>
      <div ref={outsideRef} className={'modal__overlay dark:bg-black'} onClick={handleCloseOnOverlay} />
      <div className="max-w-md bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full overflow-y-auto">
        <div className="px-6 py-4">
          <div className="flex items-center justify-end p-4">
            <button className="modal__close" onClick={onClose}>
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>
          <FollowBar id={id} title={title} />
        </div>
      </div>
    </div>
  ) : null;
};
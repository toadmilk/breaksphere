import React from "react";
import { Button } from "~/components/Button";

interface ConfirmModalProps {
  isOpen: boolean;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, content, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal__overlay dark:bg-black opacity-50" onClick={onCancel} />
      <div className="max-w-md bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-xl w-full">
        <div className="px-6 py-4">
          <h3 className="text-xl font-semibold dark:text-white">Confirm Deletion</h3>
          <p className="text-gray-700 dark:text-gray-300">{content}</p>
          <div className="flex justify-end mt-4">
            <Button gray className="mr-2" onClick={onCancel}>Cancel</Button>
            <Button red onClick={onConfirm}>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
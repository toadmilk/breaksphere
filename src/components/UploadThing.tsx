import { UploadButton } from "~/utils/uploadthing";
import { toast } from "react-toastify";
import React from "react";
import "@uploadthing/react/styles.css";
import { BsImage } from "react-icons/bs";

export const UploadFile = () => {
  return (
    <div className="flex flex-col items-center justify-between p-4">
      <BsImage />
      <UploadButton
        endpoint="postFile"
        onClientUploadComplete={(res) => {
          toast.success('Image uploaded successfully! 😄');
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message + " 😭");
        }}
      />
    </div>
  )
};

export const UploadProfileImage = () => {
  return (
    <div className="flex flex-col items-center justify-between p-4">
      <UploadButton
        endpoint="profilePicture"
        onClientUploadComplete={(res) => {
          toast.success('Profile picture updated successfully! 😄');
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message + " 😭");
        }}
      />
    </div>
  )
}
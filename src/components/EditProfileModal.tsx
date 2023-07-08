import React, { useEffect } from "react";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import { api } from "~/utils/api";
import Uploader from "~/components/Uploader";
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Profile {
  name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  image: string;
}

interface ModalProps {
  title: string;
  isOpen: boolean;
  profile: Profile;
  onClose: () => void;
}

export const EditProfileModal: React.FC<ModalProps> = ({ title, isOpen, onClose, profile }) => {
  const outsideRef = React.useRef(null);
  const [formValues, setFormValues] = React.useState<Profile>({
    name: profile.name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '',
    image: '',
  });

  const handleCloseOnOverlay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const editProfile = api.profile.editProfile.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValues.name !== profile.name || formValues.bio !== profile.bio || formValues.location !== profile.location || formValues.website !== profile.website) {
      editProfile.mutate(formValues);
      toast.success('Profile updated successfully! 😄', {
        position: 'bottom-right',
      });
    } else {
      toast.info('No changes made to profile. 💀', {
        position: 'bottom-right',
      });
    }
    onClose();
  }

  return isOpen ? (
    <div className={'modal fixed inset-0 flex justify-center z-50 dark:text-white py-2 '}>
      <div ref={outsideRef} className={'modal__overlay dark:bg-black'} onClick={handleCloseOnOverlay} />
      <div className="max-w-md bg-white dark:bg-black rounded-lg shadow-xl w-full overflow-y-auto">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold dark:text-white">{title}</h3>
            <button className="modal__close" onClick={onClose}>
              <AiOutlineClose className="w-6 h-6" />
            </button>
          </div>
          <div className="pt-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Change Profile Picture</label>
            <ProfileImage src={profile.image} className="w-36 h-36 mx-auto" />
            <Uploader />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Name</label>
              <input
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-black"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formValues.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Bio</label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-black"
                name="bio"
                placeholder="Enter your bio"
                rows={4}
                value={formValues.bio !== null ? formValues.bio : ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Location</label>
              <input
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-black"
                type="text"
                name="location"
                placeholder="Enter your location"
                value={formValues.location !== null ? formValues.location : ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Website</label>
              <input
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-black"
                type="text"
                name="website"
                placeholder="Enter your website"
                value={formValues.website !== null ? formValues.website : ''}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};
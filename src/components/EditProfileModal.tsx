import React from "react";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import { api } from "~/utils/api";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UploadProfileImage } from "~/components/UploadThing";

interface Profile {
  name: string;
  bio: string;
  location: string;
  website: string;
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
    image: profile.image || '',
  });

  const [varCounts, setVarCounts] = React.useState({
    name: formValues.name.length,
    bio: formValues.bio.length,
    location: formValues.location.length,
    website: formValues.website.length,
    image: 0,
  });

  const handleCloseOnOverlay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setVarCounts((prevCounts) => ({
      ...prevCounts,
      [name]: value.length,
    }));
  };

  React.useEffect(() => {
    setVarCounts({
      name: formValues.name.length,
      bio: formValues.bio.length,
      location: formValues.location.length,
      website: formValues.website.length,
      image: 0,
    });
  }, [formValues]);

  const renderCharCount = (fieldName: keyof Profile, max: number) => {
    const charCount = varCounts[fieldName];
    return (
      <p className={`text-neutral-500 dark:text-neutral-300 mt-1`}>
        {charCount}/{max}
      </p>
    );
  };

  const editProfile = api.profile.editProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully! 😄');
    },
    onError: (error) => {
      toast.error(error.message + " 💀");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValues.name !== profile.name || formValues.bio !== profile.bio || formValues.location !== profile.location || formValues.website !== profile.website) {
      editProfile.mutate(formValues);
    } else {
      toast.info('No changes made to profile 💀');
    }
    onClose();
  }

  const MaxValues = {
    NAME: 50,
    BIO: 150,
    LOCATION: 50,
    WEBSITE: 60,
  };

  return isOpen ? (
    <div className={'fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 dark:text-white py-2'}>
      <div ref={outsideRef} className="fixed inset-0 z-40" onClick={handleCloseOnOverlay} />
      <div className="max-w-md bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full h-[700px] overflow-y-auto hide-scrollbar">
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
            <UploadProfileImage />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Name</label>
              <input
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-neutral-900"
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                maxLength={MaxValues.NAME}
                value={formValues.name}
                onChange={handleChange}
              />
              {renderCharCount("name", MaxValues.NAME)}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Bio</label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-neutral-900"
                name="bio"
                placeholder="Enter your bio"
                maxLength={MaxValues.BIO}
                rows={4}
                value={formValues.bio}
                onChange={handleChange}
              ></textarea>
              {renderCharCount("bio", MaxValues.BIO)}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Location</label>
              <input
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-neutral-900"
                type="text"
                name="location"
                maxLength={MaxValues.LOCATION}
                placeholder="Enter your location"
                value={formValues.location}
                onChange={handleChange}
              />
              {renderCharCount("location", MaxValues.LOCATION)}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-white">Website</label>
              <input
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 dark:bg-neutral-900"
                type="text"
                name="website"
                placeholder="Enter your website"
                maxLength={MaxValues.WEBSITE}
                value={formValues.website}
                onChange={handleChange}
              />
              {renderCharCount("website", MaxValues.WEBSITE)}
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
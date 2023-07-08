import { UploadButton } from "~/utils/uploadthing";
// You need to import our styles for the button to look right. Best to import in the root /_app.tsx but this is fine
import "@uploadthing/react/styles.css";
import { toast } from "react-toastify";


//flex min-h-screen flex-col items-center justify-between p-24
export default function Uploader() {
  return (
    <main className="flex flex-col items-center justify-between p-4">
      <UploadButton
        endpoint="profilePicture"
        onClientUploadComplete={(res) => {
          toast.success('Profile picture updated successfully! 😄', {
            position: 'bottom-right',
          });
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message + " 😭", {
            position: 'bottom-right',
          });
        }}
      />
    </main>
  );
}
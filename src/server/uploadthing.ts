import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { utapi } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: "16MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      const session = await getServerAuthSession({ req, res });

      // If the session or user is not available, throw an error
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }

      // Retrieve the user ID from the session
      const userId = session.user.id;

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      const oldImageId = await prisma.user.findUnique({
        where: { id: metadata.userId },
        select: { image: true },
      })
      .then((user) => user?.image);

      let oldImageName;
      if (oldImageId) {
        const regex = /^https:\/\/uploadthing\.com\/f\/(.+)$/;
        const match = oldImageId.match(regex);

        if (match) {
          oldImageName = match[1];
          console.log("oldImageName: ", oldImageName);
        }
      }

      try {
        const user = await prisma.user.update({
          where: { id: metadata.userId },
          data: { image: file.url },
        });

        console.log("User updated:", user);

        if (oldImageName) {
          await utapi.deleteFiles(decodeURIComponent(oldImageName))
        }

      } catch (error) {
        console.error("Error updating user:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
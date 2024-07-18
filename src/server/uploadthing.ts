import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

import { UTApi } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

const f = createUploadthing();

export const utapi = new UTApi();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: "16MB" } })
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession({ req, res });

      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }

      const userId = session.user.id;

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
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
          await utapi.deleteFiles(oldImageName)
        }

      } catch (error) {
        console.error("Error updating user:", error);
      }
    }),
  postFile: f({ image: { maxFileSize: "16MB" } })
    .middleware(async ({ req, res }) => {
      const session = await getServerAuthSession({ req, res });

      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }

      const postId = req.query.postId as string;

      return { postId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for postId:", metadata.postId);
      console.log("file url", file.url);

      try {
        const post = await prisma.post.update({
          where: { id: metadata.postId },
          data: { file: file.url },
        });

        console.log("Post updated:", post);

      } catch (error) {
        console.error("Error updating user:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
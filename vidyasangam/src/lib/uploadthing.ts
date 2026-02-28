import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  videoUploader: f({
    video: {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Auth can be added here via auth() from @/lib/auth
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

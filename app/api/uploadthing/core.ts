import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await auth();
  console.log("Authenticated user:", user);
  const id = user?.user.id;
  
  if (!id) throw new Error("Unauthorized: User ID is missing");
  return { id };
};

export const ourFileRouter = {
  courseBanner: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(handleAuth)
  .onUploadComplete(() => {}),
  classImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(handleAuth)
  .onUploadComplete(() => {}),
  sectionVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
  .middleware(handleAuth)
  .onUploadComplete(() => {}),
  sectionResource: f(["text", "image", "video", "audio", "pdf"])
  .middleware(handleAuth)
  .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
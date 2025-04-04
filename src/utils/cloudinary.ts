import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadToCloudinary = async (
  fileUri: string,
  folderName: string
) => {
  const res = await cloudinary.uploader.upload(fileUri, {
    invalidate: true,
    resource_type: "image",
    folder: "note-keeper/" + folderName,
    use_filename: true,
  });

  return res;
};

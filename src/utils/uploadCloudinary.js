import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, folder) => {
  return await cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: "auto"
    },
    (error, result) => {
      if (error) throw new Error("Cloudinary upload failed: " + error);
      return result;
    }
  );
};

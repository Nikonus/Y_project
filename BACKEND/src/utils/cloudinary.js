import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary ONCE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ Upload to Cloudinary
export const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto", // image or video
    });

    fs.unlinkSync(localPath); // remove local file after upload
    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    throw error;
  }
};


// ✅ Delete from Cloudinary
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, // "image" or "video"
    });

    return result;

  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

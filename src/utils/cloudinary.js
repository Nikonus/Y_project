import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary ONCE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Upload function
// const uploadOnCloudinary = async (localPath) => {
//     try {
//         if (!localPath) return null;


//         const response = await cloudinary.uploader.upload(localPath, {
//             resource_type: "auto" // supports images & videos
//         });

//         // Remove local file after successful upload
//         fs.unlinkSync(localPath);

//         return response;

//     } catch (error) {
//         // Remove corrupted local file
//         fs.unlinkSync(localPath);
//         return null;
//     }
// };

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto"
    });

    fs.unlinkSync(localPath);
    return response;

  } catch (error) {
    console.error("Cloudinary error:", error.message);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    throw error;
  }
};

// cloudinary se file delete krta hai 👇
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    throw error;
  }
};

// Cloudinary URL se public ID nikalne ke liye helper function
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

export default uploadOnCloudinary;

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


export default uploadOnCloudinary;

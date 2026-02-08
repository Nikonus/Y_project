import multer from "multer";
import path from "path";

// Configure disk storage
const storage = multer.diskStorage({
 

  // Where files will be stored temporarily
  destination: function (req, file, cb) {
    // __dirname cannot be used directly in ES modules
    // So we use process.cwd() to get project root
    cb(null, path.join(process.cwd(), "public/temp"));
  },

  // How file will be named
  filename: function (req, file, cb) {

    // Generate unique file name to avoid overwriting
    const uniqueName = `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  }
});




// Export multer middleware
export const upload = multer({ storage });

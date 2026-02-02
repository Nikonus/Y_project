import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({
  storage,
});

// Conditional multer middleware - only applies if Content-Type is multipart/form-data
export const optionalUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    const contentType = req.headers['content-type'] || '';

    // If it's multipart/form-data, use multer
    if (contentType.includes('multipart/form-data')) {
      return uploadMiddleware(req, res, next);
    }

    // Otherwise, skip multer and continue
    next();
  };
};

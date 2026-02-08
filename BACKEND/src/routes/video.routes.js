import { Router } from "express";
import { 
    publishAVideo, 
    getVideobyId, 
    updateVideo, 
    deleteVideo, 
    getAllVideos, 
    toggleVideoPublishStatus 
} from "../controlers/video.controler.js"; // Teri spelling 'controler' hi rakhi hai
import { veryfyJWT } from "../middilewares/Auth.middileware.js"; // Teri spelling 'middilewares' aur 'veryfyJWT'
import { upload } from "../middilewares/multer.middileware.js";

const router = Router();

// Saare routes ko protect kar dete hain
router.use(veryfyJWT); 

// http://localhost:8000/api/v1/videos/
router.route("/")
    .get(getAllVideos) // Saari videos fetch karne ke liye
    .post(
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]),
        publishAVideo
    );

// http://localhost:8000/api/v1/videos/:video_id
router.route("/v/:video_id")
    .get(getVideobyId)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo); // Sirf thumbnail update ke liye multer single

// http://localhost:8000/api/v1/videos/toggle/v/:video_id
router.route("/toggle/v/:video_id").patch(toggleVideoPublishStatus);

export default router;
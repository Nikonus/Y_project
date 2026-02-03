import { Router } from "express";
import { toggleVideoLike, VideoLikeStats, getLikedVideos, toggleCommentLike, toggleTweetLike } from "../controlers/like.controler.js";
import { verifyJWT } from "../middilewares/Auth.middileware.js"; 
const router = Router();


router.use(verifyJWT); 

// Route: /api/v1/likes/toggle/v/:video_id
router.route("/toggle/v/:video_id").post(toggleVideoLike); //

// Route: /api/v1/likes/toggle/c/:comment_id
router.route("/toggle/c/:comment_id").post(toggleCommentLike); //

// Route: /api/v1/likes/toggle/t/:tweet_id
router.route("/toggle/t/:tweet_id").post(toggleTweetLike); //

// Route: /api/v1/likes/videos (User ki liked playlist)
router.route("/videos").get(getLikedVideos); //

export default router;
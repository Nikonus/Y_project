// routes/dashboard.routes.js
import { Router } from "express";
import { getChannelStats, getChannelVideos, getChannelTweets } from "../controlers/Dashboard.controler.js";
import { veryfyJWT } from "../middilewares/Auth.middileware.js";

const router = Router();
router.use(veryfyJWT); 

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);
router.route("/tweets").get(getChannelTweets);

export default router;
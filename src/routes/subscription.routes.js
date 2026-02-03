import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controlers/subscription.controler.js";
import { veryfyJWT } from "../middilewares/Auth.middileware.js"; 
const router = Router();
router.use(veryfyJWT); 

router.route("/c/:channel_id")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router.route("/u/:subscriber_id").get(getSubscribedChannels);

export default router;
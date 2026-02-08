import { Router } from "express";
import { createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets} from "../controlers/tweet.controler.js";
import { veryfyJWT } from "../middilewares/Auth.middileware.js"; 
const router = Router();

router.use(veryfyJWT); // Pehle login verify karo

router.route("/")
    .post(createTweet);
router.route("/:tweet_id")
    .patch(updateTweet)
    .delete(deleteTweet);
router.route("/user/:user_id")
    .get(getUserTweets);
export default router;
    
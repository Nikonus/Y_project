import { Router } from "express";
import registerUser from "../controlers/user.controler.js";
import { upload } from "../middilewares/multer.middileware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

export default router;

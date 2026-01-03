import { Router } from "express";
import registerUser from "../controlers/user.controler.js";
import { upload } from "../middilewares/multer.middileware.js";
import { loginUser,logoutUser } from "../controlers/user.controler.js";
import { veryfyJWT } from "../middilewares/Auth.middileware.js";


const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout",veryfyJWT ,logoutUser);


export default router;

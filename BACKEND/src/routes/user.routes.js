import { Router } from "express";
import {
  getUserChannalProfile,
  registerUser,
  updateUserAvatar,
  updatrAccountDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changecurrentuserpassword,
  getCurrentuser,
  updateUserCoverImage,
  userWatchHistory
} from "../controlers/user.controler.js";

import { upload } from "../middilewares/multer.middileware.js";
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
router.post("/logout", veryfyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/change-password", veryfyJWT, changecurrentuserpassword);
router.post("/current-user", veryfyJWT, getCurrentuser);

router.patch("/update-profile", veryfyJWT, updatrAccountDetails);
router.patch("/avatar", veryfyJWT, upload.single("avatar"), updateUserAvatar);
router.patch("/cover-image", veryfyJWT, upload.single("coverImage"), updateUserCoverImage);

router.get("/c/:username", veryfyJWT, getUserChannalProfile);
router.get("/watch-history", veryfyJWT, userWatchHistory);

export default router;

import { Router } from "express";
import {
  getUserChannalProfile,
  registerUser,
  updateUserAvatar,
  updateAccountDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changecurrentuserPassword,
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
router.post("/refresh-token", refreshAccessToken);

router.use(veryfyJWT);



router.post("/logout", logoutUser);
router.post("/change-password", changecurrentuserPassword);

router.get("/me", getCurrentuser);
router.get("/c/:username", getUserChannalProfile);
router.get("/watch-history", userWatchHistory);

router.patch("/update-profile", updateAccountDetails);
router.patch("/avatar", upload.single("avatar"), updateUserAvatar);
router.patch("/cover-image", upload.single("coverImage"), updateUserCoverImage);

export default router;
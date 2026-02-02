import { Router } from "express";
import {
  getUserChannalProfile,
  registerUser,
  updateUserAvatar,
  updateAccountDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changecurrentuserpassword,
  getCurrentuser,
  updateUserCoverImage,
  userWatchHistory
} from "../controllers/user.controller.js";

import { upload, optionalUpload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router();

router.post(
  "/register",
  optionalUpload(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 }
    ])
  ),
  registerUser
);

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/change-password", verifyJWT, changecurrentuserpassword);
router.post("/current-user", verifyJWT, getCurrentuser);

router.patch("/update-profile", verifyJWT, updateAccountDetails);
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.patch("/cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.get("/c/:username", verifyJWT, getUserChannalProfile);
router.get("/watch-history", verifyJWT, userWatchHistory);

export default router;

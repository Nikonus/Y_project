import { Router } from "express";
import {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getUserplaylists,
    getPlayListById,
    updatePlaylist,
    deletePlaylist
} from "../controlers/playlist.controler.js";
import { veryfyJWT } from "../middilewares/Auth.middileware.js"; 
const router = Router();
router.use(veryfyJWT); // Pehle login verify karo
// http://localhost:8000/api/v1/playlists/
router.route("/")
    .post(createPlaylist)
    .get(getUserplaylists);

router.route("/:playlist_id")
    .get(getPlayListById)
    .put(updatePlaylist)
    .delete(deletePlaylist);

router.route("/:playlist_id/videos/:video_id")
    .post(addVideoToPlaylist)
    .delete(removeVideoFromPlaylist);
export default router;
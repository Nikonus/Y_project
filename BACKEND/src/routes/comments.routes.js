import { Router } from "express";
import {
     getVideoComments,
    addComment,
    updateComment,
    deleteComment 
} from "../controlers/comments.controler.js";
import { veryfyJWT } from "../middilewares/Auth.middileware.js";    
const router = Router();

// Saare routes ko protect kar dete hain
router.use(veryfyJWT);
// http://localhost:8000/api/v1/comments/video/:video_id
router.route("/video/:video_id")
    .get( getVideoComments)
    .post( addComment);
// http://localhost:8000/api/v1/comments/:comment_id
router.route("/:comment_id")
    .patch( updateComment)
    .delete( deleteComment);
export default router;
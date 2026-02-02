import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import { Comment } from "../models/comments.model.js";
import Apiresponse from "../utils/apires.js";
import mongoose from "mongoose";



const getVideoComments = asyncHandler(async (req, res, next) => {
    const {video_id} = req.params;

    if(!mongoose.isValidObjectId(video_id)){
        return next(new Apierr("Invalid video ID", 400));
    }  

    const {page=1, limit=10} = req.query;
    const aggregate = Comment.aggregate([
        {
            $match: {video: new mongoose.Types.ObjectId(video_id)}
        },
        {
            $lookup: {
                from: "users",
                localField: "commenter",
                foreignField: "_id",
                as: "commenterDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullname: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$commenterDetails"
        },
        {
            $sort: {createdAt: -1}
        },
    ]);
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };
    const comments = await Comment.aggregatePaginate(aggregate, options);
    return res.status(200).json(new Apiresponse(200, comments, "Comments fetched successfully"));
});


const addComment = asyncHandler(async (req, res, next) => {
    const {video_id} = req.params;
    const {content} = req.body;

    if(!mongoose.isValidObjectId(video_id)){
        return next(new Apierr("Invalid video ID", 400));
    }   
    if (!content || content.trim().length === 0) {
        return next(new Apierr("Comment content cannot be empty", 400));
    }
   const comment = await Comment.create({
        video: video_id,
        commenter: req.user._id,
        content: content.trim()
    });
   


    return res.status(201).json(new Apiresponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res, next) => {
    const { comment_id } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(comment_id)) {
        return next(new Apierr("Invalid comment ID", 400));
    }

    if (!content || !content.trim()) {
        return next(new Apierr("Comment content cannot be empty", 400));
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: comment_id,
            commenter: req.user._id 
        },
        {
            $set: { content: content.trim() }
        },
        {
            new: true
        }
    );

    if (!updatedComment) {
        return next(new Apierr("Comment not found or unauthorized", 404));
    }

    return res
        .status(200)
        .json(new Apiresponse(200, updatedComment, "Comment updated successfully"));
});


const deleteComment = asyncHandler(async (req, res, next) => {
    const { comment_id } = req.params;

    if (!mongoose.isValidObjectId(comment_id)) {
        return next(new Apierr("Invalid comment ID", 400));
    }

   
    const deletedComment = await Comment.findOneAndDelete({
        _id: comment_id,
        commenter: req.user._id 
    });

    if (!deletedComment) {
      
        return next(new Apierr("Comment not found or you're not authorized to delete it", 404));
    }

    return res
        .status(200)
        .json(new Apiresponse(200, {}, "Comment deleted successfully"));
});

export { 
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
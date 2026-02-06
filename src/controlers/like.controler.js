import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import Apiresponse from "../utils/apires.js";
import mongoose, { Aggregate } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;

    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }

    const videoExists = await Video.exists({ _id: video_id });
    if (!videoExists) {
        return next(new Apierr("Video not found", 404));
    }

    const deleted = await Like.findOneAndDelete({
        video: video_id,
        likedBy: req.user._id
    });

    if (deleted) {
        return res.status(200).json(
            new Apiresponse(200, { isLiked: false }, "Video unliked successfully")
        );
    }

    await Like.create({ video: video_id, likedBy: req.user._id });

    return res.status(201).json(
        new Apiresponse(201, { isLiked: true }, "Video liked successfully")
    );
});


// const VideoLikeStats = asyncHandler(async (req, res, next) => {
//     const { video_id } = req.params;

//     if (!mongoose.isValidObjectId(video_id)) {
//         return next(new Apierr("Invalid video ID", 400));
//     }

//     const videoObjectId = new mongoose.Types.ObjectId(video_id);
//     const userObjectId = new mongoose.Types.ObjectId(req.user._id);

//     const likeStats = await Like.aggregate([
//         {
//             $match: { video: videoObjectId }
//         },
//         {
//             $group: {
//                 _id: "$video",
//                 totalLikes: { $sum: 1 },
//                 userLiked: {
//                     $sum: {
//                         $cond: [
//                             { $eq: ["$likedBy", userObjectId] }, 
//                             1,
//                             0
//                         ]
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 totalLikes: 1,
//                 userLiked: { $gt: ["$userLiked", 0] } 
//             }
//         }
//     ]);

//     const stats = likeStats[0] || { totalLikes: 0, userLiked: false };

//     return res.status(200).json(
//         new Apiresponse(200, stats, "Like stats fetched successfully")
//     );
// });
const VideoLikeStats = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;

    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }

    const videoExists = await Video.exists({ _id: video_id });
    if (!videoExists) {
        return next(new Apierr("Video not found", 404));
    }

    const [totalLikes, userLike] = await Promise.all([
        Like.countDocuments({ video: video_id }),
        Like.exists({ video: video_id, likedBy: req.user._id })
    ]);

    return res.status(200).json(
        new Apiresponse(200, { totalLikes, userLiked: !!userLike }, "Like stats fetched successfully")
    );
});



const getLikedVideos = asyncHandler(async (req, res, next) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true, $ne: null }
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }]
                        }
                    },
                    { $unwind: "$ownerDetails" }
                ]
            }
        },
        { $unwind: "$videoDetails" }, // removes deleted videos automatically
        { $replaceRoot: { newRoot: "$videoDetails" } }
    ]);

    return res.status(200).json(
        new Apiresponse(200, likedVideos, likedVideos.length ? "Liked videos fetched successfully" : "No liked videos found")
    );
});

//


const toggleCommentLike = asyncHandler(async (req, res, next) => {
    const { comment_id } = req.params;

    if (!mongoose.isValidObjectId(comment_id)) {
        return next(new Apierr("Invalid comment ID", 400));
    }

    const exists = await Comment.exists({ _id: comment_id });
    if (!exists) return next(new Apierr("Comment not found", 404));

    const deleted = await Like.findOneAndDelete({
        comment: comment_id,
        likedBy: req.user._id
    });

    if (deleted) {
        return res.status(200).json(new Apiresponse(200, { isLiked: false }, "Comment unliked"));
    }

    await Like.create({ comment: comment_id, likedBy: req.user._id });

    return res.status(200).json(new Apiresponse(200, { isLiked: true }, "Comment liked"));
});


//
const toggleTweetLike = asyncHandler(async (req, res, next) => {
    const { tweet_id } = req.params;

    if (!mongoose.isValidObjectId(tweet_id)) {
        return next(new Apierr("Invalid tweet ID", 400));
    }

    const deleted = await Like.findOneAndDelete({
        tweet: tweet_id,
        likedBy: req.user._id
    });

    if (deleted) {
        return res.status(200).json(new Apiresponse(200, { isLiked: false }, "Tweet unliked"));
    }

    await Like.create({
        tweet: tweet_id,
        likedBy: req.user._id
    });

    return res.status(200).json(new Apiresponse(200, { isLiked: true }, "Tweet liked"));
});


export {
    toggleVideoLike,
    VideoLikeStats,
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike

};
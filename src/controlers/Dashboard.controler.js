import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";

import { Video } from "../models/video.model.js";

import { Like } from "../models/like.model.js";

import { Subscription } from "../models/subscription.model.js";
import { Tweet } from "../models/tweet.model.js";
import Apiresponse from "../utils/apires.js";
import mongoose from "mongoose";

// const getChannalStats = asyncHandler(async (req, res, next) => {
//     const {channel_id} = req.params;
//     if(!mongoose.isValidObjectId(channel_id)){  
//         return next(new Apierr("Invalid channel ID", 400));
//     }
//     const video = await Video.aggregate([
//         {
//             $match: {owner: new mongoose.Types.ObjectId(channel_id)}
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalVideos: { $sum: 1 },
//                 totalViews: { $sum: "$views" }
//             }
//         }
//     ]);

//     const like = await Like.aggregate([
//         {
//             $lookup: {
//                 from: "videos",
//                 localField: "video",
//                 foreignField: "_id",
//                 as: "videoDetails"
//             }
//         },
//         { $unwind: "$videoDetails" },
//         {
//             $match: { "videoDetails.owner": new mongoose.Types.ObjectId(channel_id) }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalLikes: { $sum: 1 }
//             }
//         }
//     ]);

//     const subscription = await Subscription.aggregate([
//         {
//             $match: { channel: new mongoose.Types.ObjectId(channel_id) }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalSubscribers: { $sum: 1 }
//             }
//         }
//     ]);
    

//     const tweet = await Tweet.aggregate([
//         {
//             $match: { channel: new mongoose.Types.ObjectId(channel_id) }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalTweets: { $sum: 1 }
//             }
//         }
//     ]);

//     const stats = {
//         totalVideos: video[0]?.totalVideos || 0,
//         totalViews: video[0]?.totalViews || 0,
//         totalLikes: like[0]?.totalLikes || 0,
//         totalSubscribers: subscription[0]?.totalSubscribers || 0,
//         totalTweets: tweet[0]?.totalTweets || 0
//     };
//     return res.status(200).json(
//         new Apiresponse(200, stats, "Channel stats fetched successfully")
//     );

    
// });
const getChannelStats = asyncHandler(async (req, res, next) => {
    const { channel_id } = req.params;

    if (!mongoose.isValidObjectId(channel_id)) {
        return next(new Apierr("Invalid channel ID", 400));
    }

    const channelObjectId = new mongoose.Types.ObjectId(channel_id);

    
    const [videoStats, subscriberStats, tweetStats, videoLikes] = await Promise.all([
        
        Video.aggregate([
            { $match: { owner: channelObjectId } },
            { 
                $group: { 
                    _id: null, 
                    totalVideos: { $sum: 1 }, 
                    totalViews: { $sum: "$views" },
                    videoIds: { $push: "$_id" } 
                } 
            }
        ]),

        
        Subscription.countDocuments({ channel: channelObjectId }),


        Tweet.countDocuments({ owner: channelObjectId }),

        
        Like.aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videoInfo"
                }
            },
            { $match: { "videoInfo.owner": channelObjectId } },
            { $count: "totalLikes" }
        ])
    ]);

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers: subscriberStats || 0,
        totalTweets: tweetStats || 0,
        totalLikes: videoLikes[0]?.totalLikes || 0
    };

    return res.status(200).json(
        new Apiresponse(200, stats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res, next) => {
    
    const userId = req.user._id;

    
    const videos = await Video.aggregate([
        {
            
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
           
            $addFields: {
                likesCount: { $size: "$likes" }, 
                createdAtDate: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
                }
            }
        },
        {
            
            $project: {
                _id: 1,
                thumbnail: 1,
                title: 1,
                isPublished: 1, 
                createdAtDate: 1,
                likesCount: 1,
                views: 1
            }
        },
        {
            
            $sort: { createdAt: -1 }
        }
    ]);

    if (!videos) {
        return next(new Apierr("No videos found for this channel", 404));
    }

    return res
        .status(200)
        .json(new Apiresponse(200, videos, "Channel videos fetched successfully"));
});

const getChannelTweets = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    // Aggregation: Tweet + total likes on each tweet
    const tweets = await Tweet.aggregate([
        {
            // 1. Apne saare tweets filter karo
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            // 2. Likes collection se join karo (Sirf wahi likes jo tweets par hain)
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "tweetLikes"
            }
        },
        {
            // 3. Like count calculate karo
            $addFields: {
                likesCount: { $size: "$tweetLikes" }
            }
        },
        {
            // 4. Data sanitize karo
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);

    return res
        .status(200)
        .json(new Apiresponse(200, tweets, "Channel tweets fetched successfully"));
});


export {
    getChannelStats,
    getChannelVideos,
    getChannelTweets
};


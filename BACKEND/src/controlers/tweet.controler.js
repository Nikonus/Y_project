import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import { Comment } from "../models/comments.model.js";
import Apiresponse from "../utils/apires.js";
import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";




const createTweet = asyncHandler(async (req, res, next) => {
    const {content} = req.body;
    if(!content || content.trim() === ""){
        return next(new Apierr("Tweet content cannot be empty", 400));
    }
    const newTweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id
    });
    return res.status(201).json(new Apiresponse(201, newTweet, "Tweet created successfully"));


}); 


const updateTweet = asyncHandler(async (req, res, next) => {
    const { tweet_id } = req.params;
    const { content } = req.body; 

    if (!mongoose.isValidObjectId(tweet_id)) {
        return next(new Apierr("Invalid tweet ID", 400));
    }

    if(!content || content.trim() === ""){
        return next(new Apierr("Tweet content cannot be empty", 400));
    }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        {
            id : tweet_id,
            owner: req.user._id
        },
        {
            $set: {
                content:content.trim(),
                isEdited: true
            }
        },
        { new: true }
    );

    if(!updatedTweet){
        return next(new Apierr("Failed to update tweet", 404));
    }

    return res.status(200).json(new Apiresponse(200, updatedTweet, "Tweet updated successfully"));
});


const deleteTweet = asyncHandler(async (req, res, next) => {
    const { tweet_id } = req.params;
    if (!mongoose.isValidObjectId(tweet_id)) {
        return next(new Apierr("Invalid tweet ID", 400));
    }
    const deletedTweet = await Tweet.findOneAndDelete({
        _id: tweet_id,
        owner: req.user._id
    }); 
    if(!deletedTweet){
        return next(new Apierr("Tweet not found or unauthorized", 404));
    }
    return res.status(200).json(new Apiresponse(200, null, "Tweet deleted successfully"));
});


const getUserTweets = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    if (!mongoose.isValidObjectId(user_id)) {
        return next(new Apierr("Invalid user ID", 400));
    }
    const tweets = await Tweet.aggregate([
        {
            $match: {   
                owner: new mongoose.Types.ObjectId(user_id)
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        { $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,

                        }
                    
        }]   
                }
        },
        {
            $unwind: "$ownerDetails"
        },
        { $project: {
             ownerDetails: 0 ,
             createdAt: 1,
             content: 1,
             isEdited: 1
            } }
    ]);
    return res.status(200).json(new Apiresponse(200, tweets, "User tweets fetched successfully"));
});

export {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets
};
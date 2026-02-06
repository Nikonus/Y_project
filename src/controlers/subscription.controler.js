
import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import Apiresponse from "../utils/apires.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";



const toggleSubscription = asyncHandler(async (req, res, next) => {
    const { channel_id } = req.params;

    if (!mongoose.isValidObjectId(channel_id)) {
        return next(new Apierr("Invalid channel ID", 400));
    }

    if (channel_id === req.user._id.toString()) {
        return next(new Apierr("You cannot subscribe to yourself", 400));
    }

    const channelExists = await User.exists({ _id: channel_id });
    if (!channelExists) {
        return next(new Apierr("Channel not found", 404));
    }

    const existingSubscription = await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: channel_id
    });

    if (existingSubscription) {
        return res.status(200).json(
            new Apiresponse(200, { isSubscribed: false }, "Unsubscribed successfully")
        );
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channel_id
    });

    return res.status(201).json(
        new Apiresponse(201, { isSubscribed: true }, "Subscribed successfully")
    );
});



const getUserChannelSubscribers = asyncHandler(async (req, res, next) => {
    const { channel_id } = req.params;

    if (!mongoose.isValidObjectId(channel_id)) {
        return next(new Apierr("Invalid channel ID", 400));
    }

    const subscribers = await Subscription.aggregate([
        { $match: { channel: new mongoose.Types.ObjectId(channel_id) } },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
                pipeline: [{ $project: { username: 1, fullname: 1, avatar: 1 } }]
            }
        },
        { $unwind: "$subscriberDetails" },
        { $project: { _id: 0, subscriberDetails: 1 } }
    ]);

    return res.status(200).json(
        new Apiresponse(200, { count: subscribers.length, subscribers }, "Subscribers fetched successfully")
    );
});


const getSubscribedChannels = asyncHandler(async (req, res, next) => {
    const { subscriber_id } = req.params;

    if (!mongoose.isValidObjectId(subscriber_id)) {
        return next(new Apierr("Invalid subscriber ID", 400));
    }

    // 🔒 Uncomment if subscriptions should be private
    // if (req.user._id.toString() !== subscriber_id) {
    //     return next(new Apierr("Unauthorized", 403));
    // }

    const channels = await Subscription.aggregate([
        { $match: { subscriber: new mongoose.Types.ObjectId(subscriber_id) } },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
                pipeline: [{ $project: { username: 1, fullname: 1, avatar: 1 } }]
            }
        },
        { $unwind: "$channelDetails" },
        { $project: { _id: 0, channelDetails: 1 } }
    ]);

    return res.status(200).json(
        new Apiresponse(200, { count: channels.length, channels }, "Subscribed channels fetched successfully")
    );
});


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};


import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import {User} from "../models/user.model.js"

import Apiresponse from "../utils/apires.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js";
// todo: how user get history of watched videos

const publishAVideo = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        return next(new Apierr("Title is required", 400));
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        return next(new Apierr("Video and thumbnail are required", 400));
    }

    const videoUploadResponse = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailUploadResponse = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUploadResponse || !thumbnailUploadResponse) {
        return next(new Apierr("File upload failed", 500));
    }

    try {
        const newVideo = await Video.create({
            videoFile: videoUploadResponse.secure_url,
            videoPublicId: videoUploadResponse.public_id,
            thumbnail: thumbnailUploadResponse.secure_url,
            thumbnailPublicId: thumbnailUploadResponse.public_id,
            title: title.trim(),
            description: description?.trim() || "",
            duration: videoUploadResponse.duration || 0,
            owner: req.user._id
        });

        return res.status(201).json(
            new Apiresponse(201, newVideo, "Video published successfully")
        );
    } catch (err) {
        // rollback uploads if DB fails
        await deleteFromCloudinary(videoUploadResponse.public_id);
        await deleteFromCloudinary(thumbnailUploadResponse.public_id);
        return next(new Apierr("Failed to save video data", 500));
    }
});





const getVideobyId = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;

    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }

    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(video_id) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [{ $project: { username: 1, avatar: 1 } }]
            }
        },
        { $addFields: { owner: { $arrayElemAt: ["$ownerDetails", 0] } } },
        { $project: { ownerDetails: 0 } }
    ]);

    if (!video.length) {
        return next(new Apierr("Video not found", 404));
    }

    return res.status(200).json(
        new Apiresponse(200, video[0], "Video fetched successfully")
    );
});



const updateVideo = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }
    if (title && title.trim() === "") {
    return next(new Apierr("Title cannot be empty", 400));
}


    const video = await Video.findById(video_id);
    if (!video) return next(new Apierr("Video not found", 404));

    if (video.owner.toString() !== req.user._id.toString()) {
        return next(new Apierr("Unauthorized to update", 403));
    }

    const updateFields = {};

    if (title && title.trim() !== "") updateFields.title = title.trim();
    if (description) updateFields.description = description.trim();

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (thumbnailLocalPath) {
        const uploadResponse = await uploadOnCloudinary(thumbnailLocalPath);
        if (!uploadResponse) return next(new Apierr("Thumbnail upload failed", 500));

        await deleteFromCloudinary(video.thumbnailPublicId);

        updateFields.thumbnail = uploadResponse.secure_url;
        updateFields.thumbnailPublicId = uploadResponse.public_id;
    }

    if (Object.keys(updateFields).length === 0) {
        return next(new Apierr("No fields provided to update", 400));
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        video_id,
        { $set: updateFields },
        { new: true }
    );

    return res.status(200).json(
        new Apiresponse(200, updatedVideo, "Video updated successfully")
    );
});


const deleteVideo = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;

    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }

    const video = await Video.findById(video_id);
    if (!video) return next(new Apierr("Video not found", 404));

    if (video.owner.toString() !== req.user._id.toString()) {
        return next(new Apierr("Unauthorized to delete", 403));
    }

    await deleteFromCloudinary(video.videoPublicId);
    await deleteFromCloudinary(video.thumbnailPublicId);

    await Video.findByIdAndDelete(video_id);

    return res.status(200).json(
        new Apiresponse(200, null, "Video deleted successfully")
    );
});



const getAllVideos = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pipeline = [];

    // 1. Search Logic: Agar user ne kuch search kiya hai
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // 2. User Filter: Agar sirf kisi specific user ki videos chahiye
    if (userId) {
        pipeline.push({
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        });
    }

    // 3. Status Filter: Sirf published videos dikhao
    pipeline.push({ $match: { isPublished: true } });

    // 4. Sorting logic
    pipeline.push({
        $sort: { [sortBy || "createdAt"]: sortType === "asc" ? 1 : -1 }
    });

    // 5. Join with User (Jo tune likha tha)
    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [{ $project: { username: 1, avatar: 1 } }]
            }
        },
        { $unwind: "$ownerDetails" } // Array ko object mein badalne ka fast tareeka
    );

    // 6. Pagination Execution
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    return res.status(200).json(
        new Apiresponse(200, videos, "Videos fetched successfully")
    );
});

const toggleVideoPublishStatus = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;
    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }
    const video = await Video.findById(video_id);
    if (!video) {
        return next(new Apierr("Video not found", 404));
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        return next(new Apierr("Unauthorized to update status", 403));
    }
    video.isPublished = !video.isPublished;
    await video.save();
    return res.status(200).json(
        new Apiresponse(200, video, `Video is now ${video.isPublished ? "published" : "unpublished"}`)
    );
});



export {
    publishAVideo,
    getVideobyId,   
    toggleVideoPublishStatus,
    updateVideo,
    deleteVideo,
    getAllVideos



};
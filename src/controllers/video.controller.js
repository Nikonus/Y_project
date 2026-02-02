import { asyncHandler } from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import { User } from "../models/user.model.js"
import uploadOnCloudinary, { deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary.js"
import Apiresponse from "../utils/apires.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";


const publishAVideo = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        return next(new Apierr("Video and thumbnail are required", 400));
    }

    const videoUploadResponse = await uploadOnCloudinary(videoFileLocalPath);
    if (!videoUploadResponse) {
        return next(new Apierr("Video upload failed", 500));
    }

    const thumbnailUploadResponse = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailUploadResponse) {
        return next(new Apierr("Thumbnail upload failed", 500));
    }

    const newVideo = await Video.create({
        videoFile: videoUploadResponse.secure_url,
        thumbnail: thumbnailUploadResponse.secure_url,
        title,
        description,
        duration: videoUploadResponse.duration,
        owner: req.user._id
    });

    return res.status(201).json(
        new Apiresponse(201, newVideo, "Video published successfully")
    );


})



const getVideobyId = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;
    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }

    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(video_id) }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$ownerDetails", 0] }
            }
        },
        { $project: { ownerDetails: 0 } }

    ])

    if (!video || video.length === 0) {
        return next(new Apierr("Video not found", 404));
    }
    return new Apiresponse("Video fetched successfully", 200, video[0]).send(res);
});


const updateVideo = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid video ID", 400));
    }

    const video = await Video.findById(video_id);
    if (!video) return next(new Apierr("Video not found", 404));

    if (video.owner.toString() !== req.user._id.toString()) {
        return next(new Apierr("Unauthorized to update", 403));
    }

    // Multer check (req.file use karo)
    const thumbnailLocalPath = req.file?.path;
    let newThumbnailUrl = video.thumbnail;

    if (thumbnailLocalPath) {
        const uploadResponse = await uploadOnCloudinary(thumbnailLocalPath);
        if (!uploadResponse) return next(new Apierr("Upload failed", 500));

        // Delete old thumbnail from Cloudinary
        const oldPublicId = getPublicIdFromUrl(video.thumbnail);
        if (oldPublicId) {
            await deleteFromCloudinary(oldPublicId);
        }

        newThumbnailUrl = uploadResponse.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        video_id,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: newThumbnailUrl
            }
        },
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
    if (!video) {
        return next(new Apierr("Video not found", 404));
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        return next(new Apierr("Unauthorized to delete", 403));
    }

    // Delete video and thumbnail from Cloudinary
    const videoPublicId = getPublicIdFromUrl(video.videoFile);
    const thumbnailPublicId = getPublicIdFromUrl(video.thumbnail);

    if (videoPublicId) {
        await deleteFromCloudinary(videoPublicId, "video");
    }
    if (thumbnailPublicId) {
        await deleteFromCloudinary(thumbnailPublicId);
    }

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

    const aggregate = Video.aggregate(pipeline);
    const videos = await Video.aggregatePaginate(aggregate, options);

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
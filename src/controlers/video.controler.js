import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import Apiresponse from "../utils/apires.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";


const  publishAVideo= asyncHandler(async (req, res,next) => {
    const {title, description} = req.body;
    console.log("BODY:", req.body);
console.log("FILES:", req.files);

    
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!videoFileLocalPath||!thumbnailLocalPath){ 
        return next(new Apierr("Video and thumbnail are required", 400));
    }

  console.log("Uploading video to Cloudinary...");
const videoUploadResponse = await uploadOnCloudinary(videoFileLocalPath);
console.log("Video upload done");
    if(!videoUploadResponse){
        return next(new Apierr("Video upload failed", 500));
    }   
    console.log("Uploading thumbnail...");
const thumbnailUploadResponse = await uploadOnCloudinary(thumbnailLocalPath);
console.log("Thumbnail upload done");
    if(!thumbnailUploadResponse){
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
    return new Apiresponse("Video published successfully", 201, newVideo);


})



const getVideobyId = asyncHandler(async (req, res, next) => {
    const {video_id} = req.params;
    if(!mongoose.isValidObjectId(video_id)){
        return next(new Apierr("Invalid video ID", 400));
    }

    const video = await Video.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(video_id)}    
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
                    } }
                ]
            }
        },
        { $addFields: {
            owner: { $arrayElemAt: ["$ownerDetails", 0] }
        } },
        { $project: { ownerDetails: 0 } }   

    ])

    if(!video||video.length===0){
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

        // --- ASLI KHEAL: PURANI FILE DELETE KARO ---
        // URL se public_id nikalo (e.g. folder/name)
        const oldPublicId = video.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(oldPublicId); // Ye utility banani padegi
        
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

const deleteVideo= asyncHandler(async (req, res, next) => {
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
 
    // --- ASLI KHEAL: CLOUDINARY SE FILE DELETE KARO ---
    const videoPublicId = video.videoFile.split("/").pop().split(".")[0];
    const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];
    await deleteFromCloudinary(videoPublicId);
    await deleteFromCloudinary(thumbnailPublicId);
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
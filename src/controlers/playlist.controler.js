import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import Apiresponse from "../utils/apires.js";
import mongoose, { Aggregate } from "mongoose";
import { Playlist } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res, next) => {
    const {name, description} = req.body;

    if(!name || name.trim() === ""){
        return next(new Apierr("Playlist name is required", 400));
    }

    if(description && description.trim() === ""){
        return next(new Apierr("Playlist description cannot be empty", 400));
    }
  
    const playlist = await Playlist.create({
        name: name.trim(),
        description: description ? description.trim() : "",
        owner: req.user._id,
        videos: []
        
    });

    return res.status(201).json(new Apiresponse(201, playlist, "Playlist created successfully"));
}); 

const addVideoToPlaylist = asyncHandler(async (req, res, next) => {
    const { playlist_id, video_id } = req.params;

    if (!mongoose.isValidObjectId(playlist_id) || !mongoose.isValidObjectId(video_id)) {
        return next(new Apierr("Invalid IDs provided", 400));
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        { 
            _id: playlist_id, 
            owner: req.user._id 
        },
        {
            $addToSet: { videos: video_id } 
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        
        return next(new Apierr("Playlist not found or you're not authorized", 404));
    }

    return res.status(200).json(
        new Apiresponse(200, updatedPlaylist, "Video added to playlist successfully")
    );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res, next) => {
    const {playlist_id, video_id} = req.params;
    if(!mongoose.isValidObjectId(playlist_id)||!mongoose.isValidObjectId(video_id)){
        return next(new Apierr("Invalid playlist ID or video ID", 400));
    }
    const updatedPlaylist = await Playlist.findOneAndUpdate(
        { 
            _id: playlist_id, 
            owner: req.user._id 
        },
        {
            $pull: {videos: video_id}
        },
        {new: true}
    );
    if(!updatedPlaylist){
        return next(new Apierr("Playlist not found or you're not authorized", 404));
    }

    return res.status(200).json(new Apiresponse(200, updatedPlaylist, "Video removed from playlist successfully"));
});


const getPlayListById = asyncHandler(async (req, res, next) => {
    const {playlist_id} = req.params;
    if(!mongoose.isValidObjectId(playlist_id)){
        return next(new Apierr("Invalid playlist ID", 400));
    }

    const playlistResult = await Playlist.aggregate([
        {
             $match: {_id: new mongoose.Types.ObjectId(playlist_id)}    
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "playlistVideos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views:1,
                        }
                    }
                ]
            }
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
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$ownerDetails", 0] },
                totalVideos: { $size: "$playlistVideos" }

            }
        },
        { $project: { ownerDetails: 0
            }

        }
    ]);

    if(!playlistResult||playlistResult.length===0){
        return next(new Apierr("Playlist not found", 404));
    }
    return res.status(200).json(new Apiresponse(200, playlistResult[0], "Playlist fetched successfully"));
});

const getUserplaylists = asyncHandler(async (req, res, next) => {
    const user_id = req.params.user._id;   
    if(!mongoose.isValidObjectId(user_id)){
        return next(new Apierr("Invalid user ID", 400));
    }
    const playlists = await Playlist.aggregate([
        {
             $match: {owner: new mongoose.Types.ObjectId(user_id)}
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",    
                as: "playlistVideos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views:1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$playlistVideos" }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);
    return res.status(200).json(new Apiresponse(200, playlists, "User playlists fetched successfully"));
});

const updatePlaylist = asyncHandler(async (req, res, next) => {
    const {playlist_id} = req.params;
    const {name, description} = req.body;
    if(!mongoose.isValidObjectId(playlist_id)){
        return next(new Apierr("Invalid playlist ID", 400));
    }
    if(name && name.trim() === ""){
        return next(new Apierr("Playlist name cannot be empty", 400));
    }
    if(description && description.trim() === ""){
        return next(new Apierr("Playlist description cannot be empty", 400));
    }
   const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlist_id, owner: req.user._id },
        { $set: updateFields },
        { new: true }
    );
    if(!updatedPlaylist){
        return next(new Apierr("Playlist not found or you're not authorized", 404));
    }
    return res.status(200).json(new Apiresponse(200, updatedPlaylist, "Playlist updated successfully"));
});


const deletePlaylist = asyncHandler(async (req, res, next) => {
    const {playlist_id} = req.params;
    if(!mongoose.isValidObjectId(playlist_id)){
        return next(new Apierr("Invalid playlist ID", 400));
    }
    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlist_id,
        owner: req.user._id
    });

    if(!deletedPlaylist){
        return next(new Apierr("Playlist not found or you're not authorized", 404));
    }
    return res.status(200).json(new Apiresponse(200, deletedPlaylist, "Playlist deleted successfully"));
});

export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlayListById,
    getUserplaylists,
    updatePlaylist,
    deletePlaylist
}
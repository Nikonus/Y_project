import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true
    },
    description: { 
        type: String, 
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],

    videosCount: {          
        type: Number,
        default: 0
    },

    isPublic: {
        type: Boolean,
        default: true,
        index: true
    }

}, { timestamps: true });


playlistSchema.index({ createdAt: -1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);

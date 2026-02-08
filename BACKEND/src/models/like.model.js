import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    video: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
        index: true
    },
    likedby: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    tweet: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        required: true, 
        index: true
    },
    comment: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", 
        required: true,
        index: true
    },

    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });   
export const Like = mongoose.model("Like", likeSchema);

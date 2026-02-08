import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    video: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Video", 
        required: true, 
        index: true 
    },
    commenter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        index: true 
    },
    content: { 
        type: String, 
        required: true, 
        trim: true 
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);

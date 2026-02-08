import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: { 
        type: String, // Cloudinary URL
        required: [true, "Video file is required"] 
    },
    thumbnail: { 
        type: String, // Cloudinary URL
        required: [true, "Thumbnail is required"] 
    },
    title: { 
        type: String, 
        required: true, 
        trim: true, 
        index: true 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    duration: { 
        type: Number, // Cloudinary se milega
        required: true 
    },
    views: { 
        type: Number, 
        default: 0 
    },
    isPublished: { 
        type: Boolean, 
        default: true 
    },
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        index: true
    }
}, { timestamps: true });

// Pagination plugin for search and feed
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
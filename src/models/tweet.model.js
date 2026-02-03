import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 280
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
        isEdited: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Tweet = mongoose.model("Tweet", tweetSchema);
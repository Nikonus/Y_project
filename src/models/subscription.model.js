import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: { type: Schema.Types.ObjectId, ref: "User" },
    channel: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true })

// Add compound unique index to prevent duplicate subscriptions
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
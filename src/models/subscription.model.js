import mongoose, {Schema} from "mongoose";
const subscriptionSchema = new mongoose.Schema({
    subscrbiber: { type: mongoose.Types.ObjectId, ref: "User"},
    chanal: { type: mongoose.Types.ObjectId, ref: "User"},
    createdAt: { type: Date, default: Date.now } 

}, { timestamps: true })




export const Subscription = mongoose.model("Subscription", subscriptionSchema);

import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videofile: { type: String, required: true },
    title: { type: String, required: true , trim:true, index:true },
    description: { type: String, required: true , trim:true },  
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    views: { type: Number, default: 0 },    
    uploadedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], index:true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: { type: [mongoose.Types.ObjectId], ref: "Comment" },
    createdAt: { type: Date, default: Date.now },
    duration: { type: Number, required: true , index:true }
    ,viewsCount:{type:Number, default:0 , index:true}
    ,ispublished:{type:Boolean, default:true},
    owener:{type:mongoose.Types.ObjectId , ref:"User"   , required:true , index:true}
}, { timestamps: true }); 

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
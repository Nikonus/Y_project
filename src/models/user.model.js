import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username: { type: String, required: true , unique: true , localStorage:true , trim:true , index:true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true  },
    fullname: { type: String, required: true , trim:true, index:true },
    avetar: { type: String , required: false },
    coverImage: { type: String , required: false },
    watchhistory: { type: mongoose.Types.ObjectId, ref: "Video" },
    password: { type: String, required: [true, "Password is required"], unique: true },
    refresToken: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



userSchema.methods.ispasswordmatched = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
};

userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,

        }
       )
}
userSchema.methods.generateRefreshToken= function(){
       return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,

        }
       )
}
export const User = mongoose.model("User", userSchema);
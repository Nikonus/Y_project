
import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import Apiresponse from "../utils/apires.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessTokenandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        

        const accessToken = user.generateAccessToken();
      

        const refreshToken = user.generateRefreshToken();
        

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        

        return { accessToken, refreshToken };

    } catch (error) {
        
        throw new Apierr(500, error.message);
    }
};

    
const registerUser= asyncHandler(async(req, res)=>{
  

// console.log(req.files)


    const{fullname,username,password,email}=req.body
//     console.log("email", email)
//     console.log("password",password)
//     console.log("username",username)
//     console.log("fullname", fullname)


    if(
        [fullname,username,password,email].some((field)=>field?.trim()==="")
    ){
        throw new Apierr(400,"All field must be required")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new Apierr(400,"invalid email formate")
    }

    const userexisted = await User.findOne({
        $or:[{username},{email}]
    })
    if(userexisted){
        throw new Apierr(409,"user with email or username already ecsisted")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path;
    // const coverImageLocalpath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalpath;
    if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
        coverImageLocalpath=req.files.coverImage[0].path;
    }




    if(!avatarLocalpath){
        throw new Apierr(400, "avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

        if(!avatar){
             throw new Apierr(400, "avatar is required")
        }

   const user= await User.create({
        fullname,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        username:username.toLowerCase(),
        password

    })  
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )  
    if(!createUser){
        throw new Apierr(500,"something went wrong while registering user")
    }

    return res.status(201).json(
        new Apiresponse(200, createUser, "User sccussfully registerd ")
    )

    // console.log(req.files)
    // console.log(req.body)
    })




const loginUser = asyncHandler(async (req, res) => {

    // Extract password, email, and username from request body
    const { password, email, username } = req.body
    
    // Validate required fields:
    // password must exist and either email or username must be provided
   if (
    !password?.trim() ||
    (!email?.trim() && !username?.trim())
) {
    throw new Apierr(400, "All field must be required")
}


    // Find user by either email or username
    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    // If user does not exist, throw error
    if (!user) {
        throw new Apierr(404, "user not found")
    }

    // Compare entered password with hashed password stored in DB
    const isPasswordMatched = await user.ispasswordmatched(password)


    // If password is incorrect, throw error
    if (!isPasswordMatched) {
        throw new Apierr(401, "invalid credentials")
    }

    // Generate access token and refresh token for this user
    const tokens = await generateAccessTokenandRefreshToken(user._id)

    // If token generation fails, throw error
    if (!tokens) {
        throw new Apierr(500, "something went wrong while generating token")
    }

    // Fetch logged-in user data again without password and refresh token
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Cookie options for security
    const options = {
        secure: true,     // cookie will be sent only over HTTPS
        httpOnly: true,  // cookie cannot be accessed via JavaScript
    }

    // Send response with cookies and user data
    return res
        .status(200)
        .cookie("refreshToken", tokens.refreshToken, options) // set refresh token in cookie
        .cookie("accessToken", tokens.accessToken, options)   // set access token in cookie
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedInUser,          // user data without sensitive fields
                    accessToken: tokens.accessToken,   // access token in response
                    refreshToken: tokens.refreshToken, // refresh token in response
                },
                "User successfully logged in"
            )
        )
        

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
             $set: { 
                refreshToken: undefined
            } 
            },
            { new: true }
        );
    // Clear the refreshToken and accessToken cookies
             const options = {
        secure: true,     // cookie will be sent only over HTTPS
        httpOnly: true,  // cookie cannot be accessed via JavaScript
    }
    return res
        .status(200)
        .cookie("refreshToken", "", { ...options, maxAge: 0 }) // clear refresh token cookie
        .cookie("accessToken", "", { ...options, maxAge: 0 })   // clear access token cookie
        .json(
            new Apiresponse(
                200,
                null,
                "User successfully logged out"
            )
        )   });


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshAccessToken

    if(!incomingRefreshToken){
        throw new Apierr(401,"unauthorized request, no token found")
    }
    try {
        const decodedToken=  jwt.verify(
            incomingRefreshToken,
             process.env.REFRESH_TOKEN_SECRET
            )
    
    
    const user = await User.findById(decodedToken?._id).select("-password");
    
    if(!user){
        throw new Apierr(401,"invalid refresh token")   
    }
    
    if(user.refreshToken!==incomingRefreshToken){
        throw new Apierr(401,"token mismatch, please login again")  
    }
    
    
    const options={
        httpOnly:true,
        secure:true,
            
    
    }
   const { accessToken, refreshToken } =
    await generateAccessTokenandRefreshToken(user._id)

    
     return res
     .status(200)
     .cookie("refreshToken", refreshToken, options) // set refresh token in cookie
     .cookie("accessToken", accessToken, options)   // set access token in cookie
     .json(
         new Apiresponse(
             200,
                {accessToken, refreshToken : refreshToken},
             "Access token successfully refreshed"
         )
     )
          
    
 } catch (error) {
      throw new Apierr(500, error.message|| "Internal server error during token refresh");  
    }


})

const changecurrentuserpassword = asyncHandler(async (req, res) => {

    const { oldpassword, newpassword } = req.body

    const user = await User.findById(req.user._id)
    const isPasswordMatched = await user.ispasswordmatched(oldpassword)

    if (!isPasswordMatched) {
        throw new Apierr(400, "old password is incorrect")
    }

    user.password = newpassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new Apiresponse(
                200,
                null,
                "Password successfully changed"
            )
        )
});

const getCurrentuser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new Apiresponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
});

const updatrAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;
    if(!fullname||!email){
        throw new Apierr(400,"fullname and email are required") 
    }


const user = await User.findByIdAndUpdate(req.user._id,{
    $set:{
        fullname,
        email  
     }
},{ new:true}).select("-password -refreshToken")

if(!user){
    throw new Apierr(500,"something went wrong while updating user profile")
};
return res.status(200).json(
    new Apiresponse(200,user,"user profile successfully updated")
);
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalpath = req.file?.path; 
    if (!avatarLocalpath) { 
        throw new Apierr(400, "avatar is required");
    }   
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    if (!avatar.url) {
        throw new Apierr(500, "something went wrong while uploading avatar");
    } 
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true }
    ).select("-password -refreshToken");
    return res.status(200).json(
        new Apiresponse(200, user, "avatar successfully updated")
    );  


            
}
)

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalpath = req.file?.path; 
    if (!coverImageLocalpath) { 
        throw new Apierr(400, "cover image is required");
    }   
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);
    if (!coverImage.url) {
        throw new Apierr(500, "something went wrong while uploading cover image");
    } 
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new Apiresponse(200, user, "cover image successfully updated")
    );


            
}
)
const getUserChannalProfile = asyncHandler(async(req,res)=>{
    if (!req.user?._id) {
    throw new Apierr(401, "Unauthorized")
}


    const {username}= req.params;
    if(!username?.trim()){
        throw new Apierr(400,"username is missing")
    }

    const channal = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        }
        ,{
            $lookup:{
                from:"subscriptions",
                foreignField:"channal",
                localField:"_id",
                as:"subscribers"
            }
        },
        {
           $lookup:{
                from:"subscriptions",
                foreignField:"channal",
                localField:"_id",
                as:"subscribersTo"
            }  
        },

        {
           $addFields:{
            subscribersCount:{$size:"$subscribers"}
           },
           channalsubscribedtoCount:{
             $size:"$subscribersTo"
        },
        isSubscribed:{
            $cond:{
               if:{$in:[new mongoose.Types.ObjectId(req.user._id),
    "$subscribers.subscriber"]},
               then:true,
               else:false
            }
        }
        },
        {
            $project:{
                fullname:1, 
                username:1,
                email:1,
                avatar:1,
                subscribersCount:1,
                channalsubscribedtoCount:1,
                isSubscribed:1,
            }
        }
    ])

    if(!channal||channal.length===0){
        throw new Apierr(404,"channal not found")
    }
console.log("channal", channal)

    return res.status(200).json(
        new Apiresponse(200,channal[0],"channal profile fetched successfully")
    )
})


const userWatchHistory= asyncHandler(async(req,res)=>{   
    if (!req.user?._id) {
    throw new Apierr(401, "Unauthorized")
}

    const user = await User.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(req.user._id)}
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",  
                foreignField:"_id",
                as:"watchHistoryVideos",
                pipeline:[
                    {
                        $lookup:{
                           from:"users",
                           localField:"owner",
                           foreignField:"_id",
                           as:"owner" ,
                           pipeline:[
                            {
                                $project:{
                                fullname:1,
                                username:1,
                                avatar:1
                            }}
                           ]

                        },
                    },{
                       $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                       } 
                    }
                ]
            }
    }
    ])
    return res.status(200).json(
        new Apiresponse(200,user[0]?.watchHistoryVideos||[],"user watch history fetched successfully")
    )
})






    



export { registerUser
        ,loginUser
        ,logoutUser
        ,refreshAccessToken
        ,changecurrentuserpassword
        ,updatrAccountDetails
        ,updateUserAvatar
        ,updateUserCoverImage
        ,getUserChannalProfile
        ,getCurrentuser
        ,userWatchHistory
        ,
        
    }    
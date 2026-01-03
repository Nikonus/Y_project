import { json } from "express";
import {asyncHandler} from "../utils/asynchandler.js";
import { Apierr } from "../utils/apierr.js";
import {User} from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import Apiresponse from "../utils/apires.js";


const generateAccessTokenandRefreshToken= async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refresToken = refreshToken;
        await user.save({validateBeforeSave: false});  
        
        return {accessToken, refreshToken};
    } catch (error) {
      throw new Apierr(500,"something went wrong while generating token");  
    }
}
    
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
        "-password -refresToken"
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
    if ([password, (email || username)].some((field) => field?.trim() === "")) {
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
    const isPasswordMatched = await user.comparePassword(password)

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
        "-password -refresToken"
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
    User.findByIdAndUpdate(
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



export { registerUser
        ,loginUser,
        logoutUser
    }    
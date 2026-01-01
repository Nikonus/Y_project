import { json } from "express";
import asyncHandler from "../utils/asynchandler.js";


const registerUser= asyncHandler(async(req, res)=>{
    res.status(404).json({
        message:"ok"
    })
})

export default registerUser
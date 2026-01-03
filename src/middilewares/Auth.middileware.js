import { asyncHandler } from "../utils/asynchandler";
import { Apierr } from "../utils/apierr.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const veryfyJWT = asyncHandler(async (req, _, next) => {

    const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        throw new Apierr(401, "you are not authorized, no token found");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new Apierr(401, "your session is expired, please login again");
    }

    const user = await User.findById(decoded._id).select("-refreshToken -password");

    if (!user) {
        throw new Apierr(401, "Invalid access token");
    }

    req.user = user;
    next();
});

    

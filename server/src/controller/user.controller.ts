import { HttpStatusCode } from "../constants/HttpStatusCodes"
import ApiResponse from "../utils/ApiResponse"
import { Request, Response, NextFunction } from "express";
import { Schema } from "mongoose";
import { IUser } from "../models/user.model";
import { createUser, findUserByEmailOrUsername, findUserById } from "../services/user.service";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const generateAccessAndRefreshTokens = async (userId:Schema.Types.ObjectId , res: Response) => {
    try {
        const user = await findUserById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        return new ApiResponse(
            HttpStatusCode.INTERNAL_SERVER_ERROR, 
            "INTERNAL_SERVER_ERROR", 
            "Something went wrong while generating refresh and access token"
        ).sendResponse(res);
    }
}

interface UserRequest extends Request {
    files: {
        avatar: any;
        coverImage?: any;
    }
}

const register = asyncHandler(
    async (req: UserRequest, res: Response, next: NextFunction) => {
        const {fullName, email, username, password}  = req.body;
        const avatarImage = req.files?.avatar
        const coverImage = req.files?.coverImage
        
        if(!fullName || !email || !username || !password || !avatarImage) {
            return new ApiResponse(
                HttpStatusCode.BAD_REQUEST, 
                "INVALID_INPUTS",  
                "Please provide all the required fields"
            ).sendResponse(res);
        }

        const existingUser = await findUserByEmailOrUsername(email, username);
        if(existingUser) {
            return new ApiResponse(
                HttpStatusCode.BAD_REQUEST, 
                "USER_EXIST", 
                "Email or username already exists"
            ).sendResponse(res);
        }

        const avatarImageLocalPath = avatarImage[0].path;
        let caverImageLocalPath = null;
        let cover = null;
        if(coverImage) {
            caverImageLocalPath = coverImage[0].path;
            cover = await uploadOnCloudinary(caverImageLocalPath)
        }

        const avatar = await uploadOnCloudinary(avatarImageLocalPath)
        if(!avatar) {
            return new ApiResponse(
                HttpStatusCode.BAD_REQUEST, 
                "AVATAR_NOT_FOUND", 
                "Email or username already exists"
            ).sendResponse(res);
        }

        console.log("avatarImageLocalPath : ", avatarImageLocalPath)
        console.log("caverImageLocalPath : ", caverImageLocalPath)        

        const createdUser = await createUser(fullName, email, username, password, avatar.url, cover.url)

        if(!createUser) {
            return new ApiResponse(
                HttpStatusCode.INTERNAL_SERVER_ERROR, 
                "USER_NOT_CREATED", 
                "user not created on server"
            ).sendResponse(res);
        }

        return new ApiResponse(
            HttpStatusCode.OK, 
            "SUCCESS", 
            "user created successfully"
        ).sendResponse(res);
    }
)

export { register }


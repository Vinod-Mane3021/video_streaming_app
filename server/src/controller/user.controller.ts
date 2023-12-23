import { HttpStatusCode } from "../constants/HttpStatusCodes"
import ApiResponse from "../utils/ApiResponse"
import { Request, Response, NextFunction } from "express";
import { Schema } from "mongoose";
import { IUser } from "../models/user.model";
import { findUserByEmailOrUsername, findUserById } from "../services/user.service";
import asyncHandler from "../utils/asyncHandler";

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

const register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {fullName, email, username, password}  = req.body;
        
        if(!fullName || !email || !username || !password) {
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

        
        
    }
)

export { register }




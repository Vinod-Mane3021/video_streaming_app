import mongoose, { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { NextFunction, Response } from "express";
import { Keys } from "../config/keys";
import ApiResponse from "../utils/ApiResponse";
import { HttpStatusCode } from '../constants/HttpStatusCodes'

export interface IUser extends Document {
    fullName: string;
    email: string;
    username: string;
    password: string;
    avatar: string;
    coverImage: string;
    watchHistory: Schema.Types.ObjectId;    
    refreshToken: string;
    isPasswordCorrect: (password: string) => Promise<boolean>
    generateAccessToken: () => Promise<string>
    generateRefreshToken: () => Promise<string>
}

// user schemas
const userSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        password: { type: String, require: [true, 'Password is required'] },
        avatar: { type: String, required: true },  // cloudinary url 
        coverImage: { type: String }, // cloudinary url 
        watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
        refreshToken: { type: String },
    },
    {
        timestamps: true
    }
)

/**
 * encrypt user password before saving into database
 * @param next - next function
 */
userSchema.pre("save", async function(next: NextFunction) {
    try {
        if(!this.isModified("password")) {
            return next();
        }
        // hash the password
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error(`Failed to hash password: ${error.message}`);
        // Throw an ApiResponse if password hashing fails
        throw new ApiResponse(
            HttpStatusCode.INTERNAL_SERVER_ERROR, 
            "INTERNAL_SERVER_ERROR", 
            `Failed to hash password : ${error.message}`
        )
    }
})

/**
 * method tocompare the user request password with encrypted password
 * @param {string} password - user passed from request
 * @returns {Promise<boolean>} - true if request password is equals to encrypted password
 */
userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password)
}

/**
 * method to generates an access token for the user
 * @returns {string} - A promise that resolves to the generated access token.
 * @throws {ApiResponse} - If token generation fails.
 */
userSchema.methods.generateAccessToken = async function() {
    try {
        const token = jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullName: this.fullName,
            },
            Keys.JWT.ACCESS_TOKEN_SECRET,
            {
                expiresIn: Keys.JWT.ACCESS_TOKEN_EXPIRY
            }
        )
        return token;
    } catch (error) {
        // Throw an ApiResponse if token generation fails
    return new ApiResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", `Failed to generate access token : ${error.message}`)
    }
}

/**
 * method to generate refresh token
 * @returns {Promise<string>} A promise that resolves to the generated refresh token.
 * @throws {ApiResponse} - If token generation fails.
 */
userSchema.methods.generateRefreshToken = async function() {
    try {
        const token = await jwt.sign(
            {
                _id: this._id,
            },
            Keys.JWT.REFRESH_TOKEN_SECRET,
            {
                expiresIn: Keys.JWT.REFRESH_TOKEN_EXPIRY
            }
        )
        return token;
    } catch (error) {
        console.error(`Failed to generate refresh token: ${error.message}`)
    // Throw an ApiResponse if token generation fails
    return new ApiResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", `Failed to generate refresh token : ${error.message}`)
    }
}

export const UserModel = model("User", userSchema);

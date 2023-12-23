import mongoose, { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { NextFunction } from "express";
import { Keys } from "../config/keys";

interface IUser extends Document {
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    watchHistory: Schema.Types.ObjectId;    
    password: string;
    refreshToken: string;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        fullName: { type: String, required: true, trim: true },
        avatar: { type: String, required: true },  // cloudinary url 
        coverImage: { type: String }, // cloudinary url 
        watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
        password: { type: String, require: [true, 'Password is required'] },
        refreshToken: { type: String },
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next: NextFunction) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function() {
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
}

userSchema.methods.generateRefreshToken = async function() {
    const token = jwt.sign(
        {
            _id: this._id,
        },
        Keys.JWT.REFRESH_TOKEN_SECRET,
        {
            expiresIn: Keys.JWT.REFRESH_TOKEN_EXPIRY
        }
    )
    return token;
}

export const UserModel = model("User", userSchema);

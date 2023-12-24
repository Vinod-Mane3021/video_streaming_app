import { UserModel } from "../models/user.model"
import { Schema } from "mongoose"

const findUserById = (userId: Schema.Types.ObjectId) => {
    return UserModel.findById(userId)
}

const findUserByEmailOrUsername = (
    email: string,
    username: string
) => {
    return UserModel.findOne({
        $or: [{ email: email}, {username: username }]
    })
}

const createUser = (
    fullName: string,
    email: string,
    username: string,
    password: string,
    avatar: string,
    coverImage: string
) => {
    return UserModel.create({
        fullName: fullName,
        email: email,
        username: username.toLowerCase(),
        password: password,
        avatar: avatar,
        coverImage: coverImage
    })
}

export { findUserById, findUserByEmailOrUsername, createUser }
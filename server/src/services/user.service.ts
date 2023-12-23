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

export { findUserById, findUserByEmailOrUsername }
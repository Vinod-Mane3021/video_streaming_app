import { Schema, model } from 'mongoose'

// video schema
const videoSchema = new Schema(
    {
        videoFile: { type: String, require: true }, //cloudinary url
        thumbnail: { type: String, require: true }, //cloudinary url
        title: { type: String, require: true },
        description: { type: String, require: true },
        duration: { type: Number, require: true },
        views: { type: Number, default: 0 }, 
        isPublished: { type: Boolean, default: true },
        owner: { type: Schema.Types.ObjectId, ref: "User"}
    },
    {
        timestamps: true
    }
)

export const VideoModel = model("Video", videoSchema);
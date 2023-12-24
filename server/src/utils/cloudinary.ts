import { v2 as cloudinary} from 'cloudinary'
import { Keys } from '../config/keys'
import fs from 'fs'

cloudinary.config({
    cloud_name: Keys.CLOUDINARY.CLOUD_NAME,
    api_key: Keys.CLOUDINARY.API_KEY,
    api_secret: Keys.CLOUDINARY.API_SECRET,
})

const uploadOnCloudinary  = async (localFilePath: string) => {
    try {
        if(!localFilePath) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "MyProjects/video_streaming_app",
        })
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error("Something went wrong while uploading on cloudinary : ", error)
        throw error;
    }
}

export { uploadOnCloudinary }
import { Router } from "express";
import { register } from "../controller/user.controller";
import { upload } from "../middlewares/multer.middleware"

const userRouter = Router();

userRouter.post(
    "/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), 
    register);




export default userRouter;
import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { verify } from "jsonwebtoken";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();



router.route("/register").post(
    //it will upload my file diskstorage
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)
// router.route("/login").post(login)


router.route("/login").post(loginUser)


//secured routes 
// here verifyJWT is middleware before running logoutUser 
// middleware are fucntion which runs before something 
// middle mai infunctionality add kr daite hain 
router.route("/logout").post(  verifyJWT ,logoutUser);

router.route("/refresh-token").post(refreshAccessToken)



export default router
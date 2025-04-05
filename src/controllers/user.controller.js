import { asyncHanler } from "../utils/asyncHanler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser= asyncHanler(async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username ,email
    // check for images ,check for avatar
    // upload them to cloudinary, check wheater avatar is uploaded
    // create user object- create entry in db 
    // remove passwor and  refresh token field from response 
    // check for user creation 
    // return response (res)

    //yha par data form sai ayega esilye body use kr rhe hain
    // url sai hb ayega usko alg trh sai handle krenge 

    const {fullName , email , username ,password}=req.body;
    console.log("email:",email)


    if(
        [fullName,email,username,password].some((field)=>
        field?.trim()=="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    // you can also write the validation of email fromat 

    // use this syntax for checking wheater email or username exist 
    //User - is in database models
    const existedUser = User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username alreay exist")
    }

    const avatarLocalPath =req.files?.avatar[0]?.path;
    const coverImageLocalPath =req.files?.coverImage[0]?.path;

    //now we are checking wheather avatar uploads to local disstorage
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required ")
    }

    const user=  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
    })

    //mongodb apne hr ek field kai sth ek "_id" add kr deta hai 
    const createdUser =await User.findById(user._id).select(
        "-password - refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }


    return res.status(201 .json(
        new ApiResponse(200,createdUser,"User register Successfully")
    ))



    // if(fullName===""){
    //     throw new ApiError(400,"Fullname is required")
    // }


})

export {registerUser} 

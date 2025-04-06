import { asyncHanler } from "../utils/asyncHanler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {jwt} from "jsonwebtoken"


const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken= user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()


        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken ,refreshToken}

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating refresh and access token ")
    }
}



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


    //checking whether someone hasnot pass empty string 

    if(
        [fullName,email,username,password].some((field)=>
        field?.trim()=="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    // you can also write the validation of email fromat 

    // use this syntax for checking wheater email or username exist 
    //User - is in database models
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username alreay exist")
    }
    
    
    // console.log(req.files)
    const avatarLocalPath = await req.files?.avatar[0]?.path;


    //this will throw error if we didnot upload coverimage file 
    // const coverImageLocalPath =await req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && 
      req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path

    }






    //now we are checking wheather avatar uploads to local disstorage
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    //agr yha pr cover image nhi milta hai to cloudnary ek emmpty string return kr deta hai 

    if(!avatar){
        console.log(avatarLocalPath);
        throw new ApiError(400,"Avatar file is requireddd ")
    }

    //here we are creatinf User object  
    const user=  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
    })

    //mongodb apne hr ek field kai sth ek "_id" add kr deta hai 
    // const createdUser =await User.findById(user._id).select(
    //     "-password - refreshToken"
    // )
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }


    // return res.status(201 .json(
    //     new ApiResponse(200,createdUser,"User register Successfully")  this is a wrong way `
    // ))
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register Successfully")
    )



    // if(fullName===""){
    //     throw new ApiError(400,"Fullname is required")
    // }


})


const loginUser =asyncHanler(async (req,res)=>{
    // req body  -> sai data lai avo 
    // username or email 
    // find the user 
    // password check
    // access and refresh token 
    // send them in cookies 


    const {email , username , password} =req.body

    if(!username && !email){
        throw new ApiError(4000,"username or email is required")
    }

    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(!user){
        throw new ApiError(400, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

   const{accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

   const  loggedInUser = await User.findById(user._id).select("-password -refreshToken");


   const options = {
      httpOnly : true,  //ab meri cokkies sserver sai hi modify hongi
      secure : true 
   }

   return res
   .status(200)
   .cookie("accessToken" ,accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,
        {
            //this is the data 
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged in successfully"
    )
   )
})

const logoutUser = asyncHanler(async (req,res)=>{
    //
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken:undefined
            }
        },
        {
            new:true
        }
     )

    const options = {
        httpOnly : true,  //ab meri cokkies sserver sai hi modify hongi
        secure : true 
     }

     return res.status(200)
     .clearCookie("accessToken" ,options)
     .clearCookie("refreshToken",options)
     .json(
        new ApiResponse(200,{},"User logged out ")
     )
   
})

 // access token aur refresh token esilye hota hai tki user ko baar baar password na dena pde ...refresh token database mai save rhta hai 
    // jb access token expire ho jata hai tb frontend wala ek aur request bhej kai apna token refresh krwa laita hai 

const refreshAccessToken=asyncHanler(async (req,res) => {
        //we need a refresh token we can access it from cookies 
       const incomingRefreshToken = req.cookies.refreshToken|| req.body.refreshToken

       if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
       }

       try {
        const decodedToken= jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
          )
 
         //now we have the _id of user from refreshtoken 
         //ab hum mongob sai ek query krke kai user ki info nikaal skta hun 
         const user = await User.findById(decodedToken?._id)
 
         if(!user){
             throw new ApiError(401,"Invalid refresh token")
         }
 
         if(incomingRefreshToken !== user?.refreshToken){
             throw new ApiError(401,"Refresh token is expired or used")
         }
 
          const options= {
             httpOnly:true,
             secure:true
          }
 
         const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens((user._id))
 
          return res
          .status(200)
          .cookie("accessToken", accessToken , options)
          .cookie("refreshToken",newRefreshToken,options)
          .json(
             new ApiResponse (
                 200,
                 {accessToken,refreshToken:newRefreshToken},
                 "Access token refreshed"
             )
          )
       } catch (error) {
          throw new ApiError((401,error?.message||"Invalid refresh token"))
       }
    }
)


export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} 

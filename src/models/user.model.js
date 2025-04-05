
import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
         username : {
            type : String,
            required : true,
            unique : true,
            lowercase:true,
            trim :true,
            index:true //for searching we are making inddex true 
         },
         email : {
            type : String,
            required : true,
            unique : true,
            lowercase:true,
            trim :true,
         },
         fullName : {
            type : String,
            required : true,
            lowercase:true,
            trim :true,
            index:true,
         },
         avatar:{
            type : String, //cloudinary url
            required:true,
         },
         coverImage:{
            type:string
         },
         watchHistory : [
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
         ],
         password:{
            type:String,
            required:[true , 'Password is required']
         },
         refreshToken :{
            type:String,

         }


    },{timestamps:true}
)


//we are writting async because this encryptoin takes time 
//yha hum callback fucntion nhi use kr skte hain 
//kyuki use this kai baare mai koi idea nhi hota hai 
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))return next();
     this.password = bcrypt.hash(this.password,10) //can be use await here 
     next()
     // 10 -> means 10 round 
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            //refresh token mai hum kam data send krte hain 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema)
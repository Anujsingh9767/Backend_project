import { asyncHanler } from "../utils/asyncHanler.js";

const registerUser= asyncHanler(async (req,res)=>{
    res.status(200).json({
        message:"here we done with registor"
    })
})

export {registerUser} 

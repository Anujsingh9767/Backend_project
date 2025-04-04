const asyncHanler =(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}




export {asyncHanler}




// const asyncHandler =()=>{}
// const asyncHandler =(func)=>{}
// const asyncHandler =(func)=>{()=>{}}

// this is try catch 
// const asyncHanler = (fn)=>async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message : error.message
//         })
//     }
// }
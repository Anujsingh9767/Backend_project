const asyncHanler =(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}


// It’s a wrapper function that simplifies error handling in async
//It wraps your async function.
//If it throws an error, it catches it and sends it to next().
//Express sees the error and handles it using your custom error middleware (or default one).
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
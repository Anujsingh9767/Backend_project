import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"


const connectDB = async ()=>{
    try {
      const connectionInstance=  await mongoose.connect(`${process.env.MONGOB_URI}/${DB_NAME}`)
      console.log(`\n MongoB connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGOOSE connection FAILED " , error)
        process.exit(1)
        // The process.exit() method instructs Node.js to terminate the process 
        // synchronously with an exit status of code. 
        // If code is omitted, exit uses either the 'success' 
        // code 0 or the value of process.exitCode if it has
        //  been set. Node.js will not terminate until all the 
        // 'exit' event listeners are called.
    }
}

export default connectDB 
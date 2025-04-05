import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app =express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials : true
}))

/*
Middleware functions in Express.js are functions that execute 
during the request-response cycle. They modify the request or response 
object before passing control to the next middleware or route handler.

This is a basic Express.js setup where middleware functions are used to handle
 different aspects of an HTTP request. Let's break it down:
*/

//This middleware parses incoming JSON requests.
//The limit: "16kb" restricts the maximum request body size to 16 KB.
app.use(express.json({limit: "16kb"}))

/*
This middleware is used to parse URL-encoded form data.
extended: true allows nested objects in URL-encoded data.
The request body size is limited to 16 KB.
*/

//parse To read and convert raw data into a structured format that your code can understand and work with.
app.use(express.urlencoded({extended: true , limit :"16kb"}))

/*
Serves static files (like images, CSS, JS files)
 from the public directory.
Example: If you place logo.png inside public/, 
it will be accessible at http://yourdomain.com/logo.png.
 */
app.use(express.static("public"))

/*
Middleware for parsing cookies from incoming HTTP requests.
Helps read cookies easily in req.cookies.
*/
app.use(cookieParser())


// middleware usse krte time most of the time aap.use(cors()) aese krte hain 


//routes import 
import userRouter from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1/users" , userRouter)
//  http://localhost:8000/api/v1/users/register
//  http://localhost:8000/api/v1/users/login     this is how our url will be formed 

export {app}
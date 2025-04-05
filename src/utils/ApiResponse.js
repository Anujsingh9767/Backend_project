class ApiResponse{
    constructor(statusCode, data,message ="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}
/*
In the ApiResponse class, the statusCode refers to the HTTP
status code, which indicates the result of an HTTP request.
It helps determine whether a request was successful or encountered an error


data to show content(image , video , file etc...)
success to check if the request went fine
message to show toasts or alerts
statusCode if needed for logging or extra logic
*/

export {ApiResponse}
class ApiError extends Error {
    constructor(
        statusCode,                             // HTTP error status (e.g. 404, 500)
        message = "Something went wrong",       // Default error message
        errors = [],                            // Optional: detailed array of errors
        stack = ""                              // Optional: stack trace override
    ) {
        super(message)                          // Call parent Error constructor

        this.statusCode = statusCode
        this.data = null                        // (To match ApiResponse structure)
        this.message = message
        this.success = false                    // Since it’s an error
        this.errors = errors                    // Store additional error info

        if (stack) {
            this.stack = stack                  // If provided, use custom stack trace
        } else {
            Error.captureStackTrace(this, this.constructor)  // Auto generate stack trace
        }
    }
}


export {ApiError}


/* 
APIERROR a custom error class that extends the built-in JavaScript Error
 class and is used to throw structured errors in your backend.
*/
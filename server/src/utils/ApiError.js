class ApiError extends Error{
    constructor(message,statusCode,errors=[],stack=''){
        super(message);
        this.message = message;
        this.statusCode = statusCode || 500;
        this.errors = errors || []
        this.success = false; 

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
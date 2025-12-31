// Apierr is a custom error class for API error
// It extends the built-in JavaScript Error class
class Apierr extends Error {

    // Constructor is called when we create a new Apierr()
    constructor(
        statusCode,                     // HTTP status code (400, 401, 500, etc)
        message = "something went wrong",// Default error message
        error = [],                     // Additional error details
        stack = ""                      // Optional custom stack trace
    ) {
        // Call parent Error constructor with message
        super(message);

        // Store HTTP status code
        this.statusCode = statusCode;

        // Data is null because this is an error response
        this.data = null;

        // success is false because request failed
        this.success = false;

        // Save the error message
        this.message = message;

        // Save error details array
        this.error = error;

        // If custom stack is provided, use it
        if (stack) {
            this.stack = stack;
        } 
        // Otherwise let Node.js generate the stack trace
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export so it can be used in controllers and middleware
export default Apierr;

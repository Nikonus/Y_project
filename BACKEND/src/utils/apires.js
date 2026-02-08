// Apiresponse is used for all successful API responses
class Apiresponse {

    constructor(
        statusCode,                 // HTTP status code
        data,                       // Actual response data
        message = "request successful"
    ) {
        // Save HTTP status code
        this.statusCode = statusCode;

        // Attach response data
        this.data = data;

        // success is true for 2xx responses
        this.success = statusCode >= 200 && statusCode < 300;

        // Message for the client
        this.message = message;
    }
}

export default Apiresponse;

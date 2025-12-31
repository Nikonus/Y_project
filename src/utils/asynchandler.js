// asyncHandler wraps async route handlers
// so that try/catch is not required in every controller
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        // Execute the controller function
        await fn(req, res, next);
    } catch (error) {
        // Send structured error response
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export default asyncHandler;

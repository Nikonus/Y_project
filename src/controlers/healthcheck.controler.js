import { asyncHandler } from "../utils/asynchandler.js";
import Apiresponse from "../utils/apires.js";

const healthcheck = asyncHandler(async (req, res) => {
    // Simple response to signal service availability
    return res
        .status(200)
        .json(new Apiresponse(200, { status: "OK" }, "System is up and running"));
});

export { healthcheck };
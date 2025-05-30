import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "OK",
        timestamp: new Date().toISOString(),
      },
      "🚀 Server is running smoother than a fresh npm install!"
    )
  );
});

export { healthCheck };

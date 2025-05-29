import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Healthcheck Route
import healthcheckRouter from "./routes/healthCheck.route.js";

// User Routes
import userRouter from "./routes/userRoutes.js";

const app = express();

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN environment variable is not set");
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.jsonj({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Healthcheck Route
app.use("/api/v1/healthcheck", healthcheckRouter);

// User Routes
app.use("/api/v1/users", userRouter);

export { app };

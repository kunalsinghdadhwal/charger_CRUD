import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Healthcheck Route
import healthcheckRouter from "./routes/healthCheck.routes.js";

// User Routes
import userRouter from "./routes/user.routes.js";

// Station Routes
import stationRouter from "./routes/station.routes.js";

const app = express();

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN environment variable is not set");
}


app.use(
  cors({
    origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Healthcheck Route
app.use("/api/v1/healthcheck", healthcheckRouter);

// User Routes
app.use("/api/v1/users", userRouter);

// Station Routes
app.use("/api/v1/stations", stationRouter);

export { app };

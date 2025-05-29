import { Router } from "express";
import {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
  getStationsByStatus,
  getStationStats,
} from "../controllers/station.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Station routes
router.route("/").get(verifyJWT, getStations).post(verifyJWT, createStation);

router
  .route("/:id")
  .get(verifyJWT, getStationById)
  .put(verifyJWT, updateStation)
  .patch(verifyJWT, updateStation)
  .delete(verifyJWT, deleteStation);

// Additional Routes
router.route("/status/:status").get(verifyJWT, getStationsByStatus);

router.route("/statistics").get(verifyJWT, getStationStats);

export default router;

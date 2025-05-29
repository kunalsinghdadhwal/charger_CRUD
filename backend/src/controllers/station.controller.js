import { Station } from "../models/station.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new station
const createStation = asyncHandler(async (req, res) => {
  const { name, location, status, powerOutput, connectorType } = req.body;

  // Validate required fields
  if (
    !name ||
    !location?.latitude ||
    !location?.longitude ||
    !powerOutput ||
    !connectorType
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate latitude and longitude ranges
  if (location.latitude < -90 || location.latitude > 90) {
    throw new ApiError(400, "Latitude must be between -90 and 90");
  }
  if (location.longitude < -180 || location.longitude > 180) {
    throw new ApiError(400, "Longitude must be between -180 and 180");
  }

  // Check if station with same name already exists
  const existingStation = await Station.findOne({ name: name.trim() });
  if (existingStation) {
    throw new ApiError(409, "Station with this name already exists");
  }

  const station = await Station.create({
    name: name.trim(),
    location,
    status: status || "Active",
    powerOutput,
    connectorType,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, station, "Station created successfully"));
});

const getStations = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    connectorType,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (connectorType) filter.connectorType = connectorType;
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Execute query with pagination
  const [stations, totalStations] = await Promise.all([
    Station.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
    Station.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalStations / parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalStations,
          hasNextPage: parseInt(page) < totalPages,
          hasPreviousPage: parseInt(page) > 1,
        },
      },
      "Stations retrieved successfully"
    )
  );
});

// Get a single station by ID
const getStationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const station = await Station.findById(id);
  if (!station) {
    throw new ApiError(404, "Station not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, station, "Station retrieved successfully"));
});

// Update station by ID
const updateStation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Remove empty fields
  Object.keys(updateData).forEach((key) => {
    if (
      updateData[key] === undefined ||
      updateData[key] === null ||
      updateData[key] === ""
    ) {
      delete updateData[key];
    }
  });

  // Validate location if provided
  if (updateData.location) {
    const { latitude, longitude } = updateData.location;
    if (latitude && (latitude < -90 || latitude > 90)) {
      throw new ApiError(400, "Latitude must be between -90 and 90");
    }
    if (longitude && (longitude < -180 || longitude > 180)) {
      throw new ApiError(400, "Longitude must be between -180 and 180");
    }
  }

  // Check if name already exists (excluding current station)
  if (updateData.name) {
    const existingStation = await Station.findOne({
      name: updateData.name.trim(),
      _id: { $ne: id },
    });
    if (existingStation) {
      throw new ApiError(409, "Station with this name already exists");
    }
    updateData.name = updateData.name.trim();
  }

  const station = await Station.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!station) {
    throw new ApiError(404, "Station not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, station, "Station updated successfully"));
});

// Delete station by ID
const deleteStation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const station = await Station.findByIdAndDelete(id);
  if (!station) {
    throw new ApiError(404, "Station not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedStation: station },
        "Station deleted successfully"
      )
    );
});

// Get stations by status
const getStationsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  if (!["Active", "Inactive"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'Active' or 'Inactive'");
  }

  const stations = await Station.find({ status }).lean();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stations,
        `${status} stations retrieved successfully`
      )
    );
});

// Get station statistics
const getStationStats = asyncHandler(async (req, res) => {
  const stats = await Station.aggregate([
    {
      $group: {
        _id: null,
        totalStations: { $sum: 1 },
        activeStations: {
          $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
        },
        inactiveStations: {
          $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] },
        },
        averagePowerOutput: { $avg: "$powerOutput" },
        maxPowerOutput: { $max: "$powerOutput" },
        minPowerOutput: { $min: "$powerOutput" },
      },
    },
    {
      $project: {
        _id: 0,
        totalStations: 1,
        activeStations: 1,
        inactiveStations: 1,
        averagePowerOutput: { $round: ["$averagePowerOutput", 2] },
        maxPowerOutput: 1,
        minPowerOutput: 1,
      },
    },
  ]);

  // Get connector type distribution
  const connectorStats = await Station.aggregate([
    {
      $group: {
        _id: "$connectorType",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const result = {
    overview: stats[0] || {
      totalStations: 0,
      activeStations: 0,
      inactiveStations: 0,
      averagePowerOutput: 0,
      maxPowerOutput: 0,
      minPowerOutput: 0,
    },
    connectorTypeDistribution: connectorStats,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Station statistics retrieved successfully")
    );
});

export {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
  getStationsByStatus,
  getStationStats,
};

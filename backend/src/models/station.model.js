import mongoose, { Schema } from "mongoose";

const stationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
    powerOutput: {
      type: Number,
      required: true,
    },
    connectorType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Station = mongoose.model("Station", stationSchema);

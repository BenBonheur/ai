import mongoose, { type Document, Schema } from "mongoose"

export interface IParkingLot extends Document {
  name: string
  description?: string
  location: string
  address: string
  latitude: number
  longitude: number
  totalSlots: number
  availableSlots: number
  pricePerHour: number
  pricePerDay: number
  operatingHours: {
    open: string
    close: string
  }
  amenities: string[]
  features: string[]
  images: string[]
  rating: number
  totalReviews: number
  isActive: boolean
  isApproved: boolean
  ownerId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ParkingLotSchema = new Schema<IParkingLot>(
  {
    name: {
      type: String,
      required: [true, "Parking lot name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
    totalSlots: {
      type: Number,
      required: [true, "Total slots is required"],
      min: [1, "Total slots must be at least 1"],
    },
    availableSlots: {
      type: Number,
      required: [true, "Available slots is required"],
      min: [0, "Available slots cannot be negative"],
    },
    pricePerHour: {
      type: Number,
      required: [true, "Price per hour is required"],
      min: [0, "Price cannot be negative"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [0, "Price cannot be negative"],
    },
    operatingHours: {
      open: {
        type: String,
        required: [true, "Opening time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time format (HH:MM)"],
      },
      close: {
        type: String,
        required: [true, "Closing time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time format (HH:MM)"],
      },
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be more than 5"],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, "Total reviews cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for geospatial queries
ParkingLotSchema.index({ latitude: 1, longitude: 1 })
ParkingLotSchema.index({ location: "text", address: "text", name: "text" })

export default mongoose.models.ParkingLot || mongoose.model<IParkingLot>("ParkingLot", ParkingLotSchema)

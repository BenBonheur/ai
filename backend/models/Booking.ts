import mongoose, { type Document, Schema } from "mongoose"

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId
  parkingLotId: mongoose.Types.ObjectId
  vehicleNumber: string
  vehicleType: "car" | "motorcycle" | "truck" | "bus"
  startTime: Date
  endTime: Date
  durationHours: number
  totalCost: number
  paymentMethod: "mobile_money" | "credit_card" | "cash" | "bank_transfer"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  status: "booked" | "in_use" | "completed" | "cancelled" | "no_show"
  qrCodeData?: string
  checkInTime?: Date
  checkOutTime?: Date
  checkedInBy?: mongoose.Types.ObjectId
  checkedOutBy?: mongoose.Types.ObjectId
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    parkingLotId: {
      type: Schema.Types.ObjectId,
      ref: "ParkingLot",
      required: [true, "Parking lot ID is required"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "motorcycle", "truck", "bus"],
      required: [true, "Vehicle type is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    durationHours: {
      type: Number,
      required: [true, "Duration is required"],
      min: [0.5, "Minimum duration is 30 minutes"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: ["mobile_money", "credit_card", "cash", "bank_transfer"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["booked", "in_use", "completed", "cancelled", "no_show"],
      default: "booked",
    },
    qrCodeData: {
      type: String,
      trim: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    checkedInBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    checkedOutBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
BookingSchema.index({ userId: 1, createdAt: -1 })
BookingSchema.index({ parkingLotId: 1, status: 1 })
BookingSchema.index({ startTime: 1, endTime: 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)

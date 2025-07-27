import mongoose, { Schema, type Document } from "mongoose";

export interface IOrder extends Document {
  vendorId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  item: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  orderDate: Date;
  pickupDate?: Date;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  progress: number;
  originCoords: number[];
  destinationCoords: number[];
  currentLocationCoords?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    pickupDate: { type: Date },
    status: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
    progress: { type: Number, default: 0 },
    originCoords: { type: [Number], required: true },
    destinationCoords: { type: [Number], required: true },
    currentLocationCoords: { type: [Number] },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
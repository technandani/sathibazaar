import mongoose, { Schema, type Document } from "mongoose";

export interface IProduct extends Document {
  supplierId: mongoose.Types.ObjectId;
  name: string;
  unitPrice: number;
  unit: string;
  availability: "In Stock" | "Out of Stock" | "Limited";
  locationServed: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    unit: { type: String, required: true },
    availability: { type: String, enum: ["In Stock", "Out of Stock", "Limited"], default: "In Stock" },
    locationServed: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supplier: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  product: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
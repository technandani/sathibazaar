import mongoose, { Schema } from 'mongoose';

const DeliverySchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pickupLocation: { type: String, required: true },
  pickupTime: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Ready for Pickup', 'Picked Up', 'Delayed'], default: 'Scheduled' },
  deliveryLead: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema);
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true, index: true },
  available: { type: Boolean, required: true, default: true, index: true }
}, {
  timestamps: true,
  versionKey: false
});

export const ServiceModel = mongoose.models.Service
  ?? mongoose.model('Service', serviceSchema);

export default ServiceModel;

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const MessageModel = mongoose.models.Message ?? mongoose.model('Message', messageSchema);

export default MessageModel;

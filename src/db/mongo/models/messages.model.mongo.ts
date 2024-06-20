import mongoose, { Schema } from "mongoose";


const MessageSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },

  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  answer: {
    type: String,
  },
});


export const essageModel = mongoose.model('Message', MessageSchema);
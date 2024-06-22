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

  content: {
    type: String,
    required: true,
  }
});


export const MessageModel = mongoose.model('Message', MessageSchema);
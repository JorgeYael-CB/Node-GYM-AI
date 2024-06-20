import mongoose, { Schema } from "mongoose";


const ComentSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },

  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


export const ComentModel = mongoose.model('Coment', ComentSchema);
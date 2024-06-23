import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  available: {
    type: Boolean,
    default: true,
  },

  img: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    default: 0,
  },

  role: {
    type: String,
    required: true,
  }
});

export const ProductModel = mongoose.model('Product', ProductSchema);

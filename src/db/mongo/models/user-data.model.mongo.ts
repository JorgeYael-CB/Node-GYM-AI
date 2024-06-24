import mongoose, { Schema } from "mongoose";


const UserDataSchema = new Schema({
  lastDate: {
    type: Date,
    default: new Date(),
  },

  user: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },

  year: {
    type: Number,
    required: true,
  },

  height: {
    type: Number,
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },

  aim: {
    type: String,
    required: false,
  },

  deport: {
    type: String,
    required: true,
  },

  medicalHistory: {
    type: String,
    required: true,
  },

  injuries: {
    type: String,
  },

  foodRestrictions: {
    type: String,
  },

  availableDays: {
    type: String,
  },

  availableTime: {
    type: String,
  },

  equipment: {
    type: String,
  }
});


export const UserDataModel = mongoose.model('UserData', UserDataSchema);
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

  availableDaysForWeek: {
    type: String,
  },

  availableTimeForDay: {
    type: String,
  },

  equipment: {
    type: String,
  },

  sexo: {
    type: String,
    required: true,
  },

  experience: {
    type: String,
    required: true,
  }
});


export const UserDataModel = mongoose.model('UserData', UserDataSchema);
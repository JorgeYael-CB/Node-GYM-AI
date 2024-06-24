import mongoose, { Schema } from "mongoose";


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isVerify: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  roles: {
    type: [String],
    default: ['USER'],
  },

  date: {
    type: Date,
    default: new Date(),
  },

  totalAmountPaid: {
    type: Number,
    default: 0
  },

  messages: {
    type: [{
      ref: 'Message',
      type: Schema.Types.ObjectId,
    }]
  },

  limitMessage: {
    type: Number,
    default: 5,
  },

  lastDateMessages: {
    type: [Date],
    default: [],
  },

  coments: {
    type: [{
      ref: 'Coment',
      type: Schema.Types.ObjectId,
    }]
  },

  data: {
    type: [{
      ref: 'UserData',
      type: Schema.Types.ObjectId,
    }]
  },

});


export const userModel = mongoose.model('User', UserSchema);
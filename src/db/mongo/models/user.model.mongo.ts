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
    default: false,
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

  coments: {
    type: [{
      ref: 'Coment',
      type: Schema.Types.ObjectId,
    }]
  },

});


export const userModel = mongoose.model('User', UserSchema);
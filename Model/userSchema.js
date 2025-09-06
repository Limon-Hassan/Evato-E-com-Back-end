const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: v => (typeof v === 'string' ? v.replace(/\s+/g, '') : v),
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    Phone: {
      type: Number,
    },
    Address: {
      type: String,
    },
    Roll: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

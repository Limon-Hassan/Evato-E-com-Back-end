const mongoose = require('mongoose');

let NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ['order', 'system', 'promotion'],
      default: 'order',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notifaction', NotificationSchema);

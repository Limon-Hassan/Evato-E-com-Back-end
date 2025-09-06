let mongoose = require('mongoose');

let PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Checkout',
      required: true,
    },
    stripeId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('payments', PaymentSchema);

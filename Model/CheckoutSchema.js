const mongoose = require('mongoose');

let ChekoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    additionalFees: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    cartitem: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      set: v => (typeof v === 'string' ? v.replace(/\s+/g, '') : v),
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash on delivery', 'debit card', 'bkash', 'nogod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pending', 'failed', 'canceled'],
      default: 'unpaid',
    },
    uniqueOrderID: {
      type: String,
    },
    delivery: {
      type: String,
      enum: [
        'pending',
        'shipped',
        'delivered',
        'canceled',
        'return_requested',
        'returned',
        'return_rejected',
        'cancelation_requested',
        'cancelation_rejected',
      ],
      default: 'pending',
    },
    estimatedDelivery: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Checkout', ChekoutSchema);

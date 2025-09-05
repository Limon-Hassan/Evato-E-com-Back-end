const mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
      text: true,
    },
    discription: {
      type: String,
      require: true,
      text: true,
    },
    photo: [String],
    sold: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    Totoalreviews: {
      type: Number,
      default: 0,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
    },
    discountPrice: {
      type: Number,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
ProductSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Products', ProductSchema);

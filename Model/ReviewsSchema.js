let mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },

    comment: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('review', reviewSchema);

const mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    discription: {
      type: String,
      require: true,
    },
    Product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
      },
    ],
    image: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('category', CategorySchema);

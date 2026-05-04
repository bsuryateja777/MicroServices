const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
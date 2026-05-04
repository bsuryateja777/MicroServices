const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  parentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParentOrder"
  },

  consumerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, required: true },

  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      price: Number,
    }
  ],

  subtotal: Number,

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
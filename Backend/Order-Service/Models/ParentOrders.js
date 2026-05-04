const mongoose = require("mongoose");

const parentOrderSchema = new mongoose.Schema({
  consumerId: { type: mongoose.Schema.Types.ObjectId, required: true },

  childOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
  ],

  totalAmount: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  }

}, { timestamps: true });

module.exports = mongoose.model("ParentOrders", parentOrderSchema);

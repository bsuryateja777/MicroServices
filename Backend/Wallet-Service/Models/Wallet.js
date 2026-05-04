// models/Wallet.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  orderId: String,
}, { timestamps: true });

const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 5000,
  },
  transactions: [transactionSchema],
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
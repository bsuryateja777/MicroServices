const { mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // 👈 REQUIRED for populate
      required: true,
    },
    consumerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);

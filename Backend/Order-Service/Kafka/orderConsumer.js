const { createConsumer } = require("./Consumer");
const Order = require("../Models/Orders");
const ParentOrders = require("../Models/ParentOrders");

const orderHandler = async ({ type, data }) => {
  if (!data?.orderId) return;

  console.log("📩 Order Event:", type, data.orderId);

  if (type === "PAYMENT_SUCCESS") {
    await ParentOrders.findByIdAndUpdate(data.orderId, {
      paymentStatus: "completed",
    });

    await Order.updateMany(
      { parentOrderId: data.orderId },
      { status: "Confirmed" }
    );

    console.log("✅ Order Confirmed");
  }

  if (type === "PAYMENT_FAILED") {
    await ParentOrders.findByIdAndUpdate(data.orderId, {
      paymentStatus: "failed",
    });

    await Order.updateMany(
      { parentOrderId: data.orderId },
      { status: "Cancelled" }
    );

    console.log("❌ Order Cancelled");
  }
};

const runOrderConsumer = async () => {
  const consumer = createConsumer("order-group");

  await consumer.run({
    topics: ["wallet-events"],
    handler: orderHandler,
  });
};

module.exports = runOrderConsumer;
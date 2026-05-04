const { createConsumer, runConsumer } = require("./Consumer");
const { sendEvent } = require("./Producer");
const { debitWallet, creditWallet } = require("../Services/walletServices");


const walletHandler = async ({ type, data }) => {
  if (type !== "ORDER_CREATED") return;

  console.log("💰 Processing payment for:", data.orderId);

  try {
    // ✅ 1. Debit buyer (THIS adds transaction automatically)
    await debitWallet({
      userId: data.consumerId,
      amount: data.totalAmount,
      description: "Order payment",
      orderId: data.orderId,
    });

    // ✅ 2. Group seller earnings
    const sellerMap = {};

    data.items.forEach((item) => {
      const amount = item.price * item.quantity;

      if (!sellerMap[item.sellerId]) {
        sellerMap[item.sellerId] = 0;
      }

      sellerMap[item.sellerId] += amount;
    });

    // ✅ 3. Credit each seller (THIS adds transaction automatically)
    for (const sellerId in sellerMap) {
      await creditWallet({
        userId: sellerId,
        amount: sellerMap[sellerId],
        description: "Product sold",
        orderId: data.orderId,
      });
    }

    console.log("✅ Payment + transactions complete");

    await sendEvent("wallet-events", {
      type: "PAYMENT_SUCCESS",
      data,
    });

  } catch (err) {
    console.error("❌ Wallet error:", err.message);

    await sendEvent("wallet-events", {
      type: "PAYMENT_FAILED",
      data,
    });
  }
};


const runWalletConsumer = async () => {
  const consumer = createConsumer("wallet-group");

  await runConsumer(
    consumer,
    "order-events", // 🔥 IMPORTANT
    walletHandler
  );
};

module.exports = runWalletConsumer;

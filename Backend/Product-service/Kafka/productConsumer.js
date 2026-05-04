const { createConsumer, runConsumer } = require("./Consumer");
const Product = require("../Models/Products");
// optional
// const { sendEvent } = require("./Producer");

const productHandler = async ({ type, data }) => {
  if (type !== "PAYMENT_SUCCESS") return;

  console.log("📦 Processing stock for:", data.orderId);

  try {
    // ✅ reduce stock safely
    for (const item of data.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        console.log("❌ Product not found:", item.productId);
        continue;
      }

      if (product.stock < item.quantity) {
        console.log("❌ Not enough stock:", product._id);

        // OPTIONAL (advanced)
        /*
        await sendEvent("product-events", {
          type: "STOCK_FAILED",
          data,
        });
        */

        return;
      }

      product.stock -= item.quantity;
      await product.save();
    }

    console.log("✅ Stock updated successfully");

    // OPTIONAL (advanced)
    /*
    await sendEvent("product-events", {
      type: "STOCK_CONFIRMED",
      data,
    });
    */

  } catch (err) {
    console.error("❌ Stock update error:", err.message);
  }
};

const runProductConsumer = async () => {
  const consumer = createConsumer("product-group");

  await runConsumer(
    consumer,
    "wallet-events", // 🔥 IMPORTANT
    productHandler
  );
};

module.exports = runProductConsumer;
const Order = require("../Models/Orders.js");
const mongoose = require("mongoose");
const ParentOrders = require("../Models/ParentOrders.js");
const { sendEvent } = require("../Kafka/Producer");

exports.placeOrder = async (req, res) => {
  try {
    let { cartItems } = req.body;
    const consumerId = req.user.id;

    if (!Array.isArray(cartItems)) {
      cartItems = [cartItems];
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 🧠 Group by seller
    const grouped = cartItems.reduce((acc, item) => {
      if (!acc[item.sellerId]) acc[item.sellerId] = [];
      acc[item.sellerId].push(item);
      return acc;
    }, {});

    let childOrders = [];
    let kafkaItems = [];
    let finalTotal = 0;

    // 🧠 Create child orders
    for (const sellerId in grouped) {
      const items = grouped[sellerId];

      const subtotal = items.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

      const order = await Order.create({
        consumerId,
        sellerId,
        products: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        status: "Pending",
      });

      finalTotal += subtotal;
      childOrders.push(order._id);

      // ✅ prepare kafka payload
      items.forEach((i) => {
        kafkaItems.push({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
          sellerId: i.sellerId,
        });
      });
    }

    // 🧠 Create parent order
    const parentOrder = await ParentOrders.create({
      consumerId,
      childOrders,
      totalAmount: finalTotal,
      paymentStatus: "pending",
    });

    // 🧠 Link child → parent
    await Order.updateMany(
      { _id: { $in: childOrders } },
      { parentOrderId: parentOrder._id }
    );

    // 🚀 SEND EVENT (CLEAN FORMAT)
    await sendEvent("order-events", {
      type: "ORDER_CREATED",
      data: {
        orderId: parentOrder._id,
        consumerId,
        items: kafkaItems,
        totalAmount: finalTotal,
      },
    });

    console.log("📤 ORDER_CREATED sent:", parentOrder._id);

    res.json({
      message: "Order placed successfully",
      parentOrder,
    });

  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.aggregate([
      {
        $match: { consumerId: userId }
      },
      {
        $group: {
          _id: "$parentOrderId",
          orders: { $push: "$$ROOT" },
          totalAmount: { $sum: "$subtotal" },
          createdAt: { $first: "$createdAt" },
          status: { $first: "$status" }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    console.log("Grouped Orders:", orders);

    res.json({ success: true, orders });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
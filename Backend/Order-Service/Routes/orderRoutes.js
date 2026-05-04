const express = require("express");
const router = express.Router();
const { placeOrder, getUserOrders } = require("../Controllers/orderControllers");
const { verifyToken } = require("../Middleware/verifyToken");

router.post("/place-order", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getUserOrders);

module.exports = router;
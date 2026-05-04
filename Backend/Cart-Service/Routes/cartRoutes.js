const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart
} = require("../Controllers/cartControllers");

const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.put("/:id", verifyToken, updateQuantity);
router.delete("/clear", verifyToken, clearCart);
router.delete("/:id", verifyToken, removeItem);


module.exports = router;
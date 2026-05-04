const express = require("express");
const { createProduct, getProducts, getBulkProducts, getMyProducts, updateProduct, updateStock } = require("../Controllers/productController");
const { verifyToken } = require("../Middleware/VerifyToken");

const router = express.Router();

router.post("/new", createProduct);
router.get("/allProducts", getProducts);
router.post("/bulk", getBulkProducts);
router.get("/my-products", verifyToken, getMyProducts);
router.patch("/:id/stock", verifyToken, updateStock);

module.exports = router;
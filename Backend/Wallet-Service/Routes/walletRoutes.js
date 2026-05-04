// routes/walletRoutes.js
const express = require("express");
const router = express.Router();
const walletController = require("../Controllers/walletController");
const verifyToken = require("../Middleware/verifyToken").verifyToken;

router.get("/",verifyToken, walletController.getWallet);
router.post("/create", walletController.createWallet);
router.post("/credit", walletController.credit);
router.post("/debit", walletController.debit);
router.post("/check", walletController.checkBalance);
router.post("/add-money", verifyToken, walletController.addMoney);

module.exports = router;
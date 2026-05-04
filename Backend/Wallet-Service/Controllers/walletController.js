// controllers/walletController.js
const walletService = require("../Services/walletServices");
const Wallet = require("../Models/Wallet.js");

exports.createWallet = async (req, res) => {
  try {
    const { userId } = req.body;

    const existing = await Wallet.findOne({ userId });
    if (existing) {
      return res.json({ success: true, message: "Wallet already exists" });
    }

    const wallet = await Wallet.create({
      userId,
      balance: 5000, // initial balance (you can change)
    });

    res.json({ success: true, wallet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};


// Get wallet
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await walletService.getWallet(userId);

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Credit (internal use mostly)
exports.credit = async (req, res) => {
  try {
    const { userId, amount, description, orderId } = req.body;

    const wallet = await walletService.creditWallet({
      userId,
      amount,
      description,
      orderId,
    });

    res.json(wallet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Debit (used during checkout)
exports.debit = async (req, res) => {
  try {
    const { userId, amount, description, orderId } = req.body;

    const wallet = await walletService.debitWallet({
      userId,
      amount,
      description,
      orderId,
    });

    res.json(wallet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.checkBalance = async (req, res) => {
  const { userId, amount } = req.body;

  const wallet = await Wallet.findOne({ userId });

  if (!wallet || wallet.balance < amount) {
    return res.json({ success: false });
  }

  res.json({ success: true });
};

// Add Money (User action)
exports.addMoney = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ secure
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const wallet = await walletService.creditWallet({
      userId,
      amount,
      description: "Added money to wallet",
    });

    res.json(wallet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
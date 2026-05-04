// services/walletService.js
const Wallet = require("../Models/Wallet");
const { getWallet } = require("../Controllers/walletController");

// Get or create wallet
exports.getWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    const wallet = await getWallet(userId);
  }

  return wallet;
};
4
// Credit wallet
exports.creditWallet = async ({ userId, amount, description, orderId }) => {
  const wallet = await this.getWallet(userId);
  const amt = Number(amount);

  wallet.balance += amt;

  wallet.transactions.push({
    type: "CREDIT",
    amount: amt,
    description,
    orderId,
  });

  await wallet.save();

  return wallet;
};

// Debit wallet
exports.debitWallet = async ({ userId, amount, description, orderId }) => {
  const wallet = await this.getWallet(userId);

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  const amt = Number(amount);
  wallet.balance -= amt;

  wallet.transactions.push({
    type: "DEBIT",
    amount: amt,
    description,
    orderId,
  });

  await wallet.save();

  return wallet;
};
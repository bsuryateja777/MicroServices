require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const runWalletConsumer = require("./Kafka/walletConsumer");

const walletRoutes = require("./Routes/walletRoutes");

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());



// Routes
app.use("/", walletRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB Connected");
    await runWalletConsumer(); // ✅ start consumer

    app.listen(process.env.PORT, () => {
      console.log(`Wallet Service running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));  
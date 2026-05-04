require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const runOrderConsumer = require("./Kafka/orderConsumer");


const orderRoutes = require("./Routes/orderRoutes");

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

runOrderConsumer();

// Routes
app.use("/", orderRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB Connected");

    await runOrderConsumer();

    app.listen(process.env.PORT, () => {
      console.log(`Order Service running on port ${process.env.PORT}`);
    });
  });
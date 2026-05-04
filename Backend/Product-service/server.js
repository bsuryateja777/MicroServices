const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const runProductConsumer = require("./Kafka/productConsumer");

const productRoutes = require("./Routes/productRoutes");

dotenv.config();

const app = express();

/* Middleware */
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// }));

app.use(cookieParser());
app.use(express.json());

/* Routes */
app.use("/", productRoutes);


/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB Connected");

    await runProductConsumer(); // ✅ start consumer

    app.listen(process.env.PORT, () => {
      console.log(`Product Service running on port ${process.env.PORT}`);
    });
  });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./Routes/cartRoutes");

const app = express();

app.use(cors({
  origin: [process.env.GATEWAY_URL],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());



// Routes
app.use("/", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Cart Service running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));  
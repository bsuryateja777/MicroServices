const Products = require("../Models/Products");

const createProduct = async (req, res) => {
  try {
    const { title, description, price, images, stock, sellerId } = req.body;

    const product = await Products.create({
      title,
      description,
      price,
      images,
      stock,
      sellerId
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Create product error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  const products = await Products.find();
  res.json(products);
};

const getBulkProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    const products = await Products.find({
      _id: { $in: ids }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/productController.js

const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const products = await Products.find({ sellerId: sellerId });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// controller
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Products.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Stock update failed" });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getBulkProducts,
  getMyProducts,
  updateStock
};
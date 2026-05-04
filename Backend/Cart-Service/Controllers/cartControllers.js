const Cart = require("../models/Cart");
const { getProductsByIds } = require("../Services/productService");

//Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const consumerId = req.user.id;

    //Fetch product
    const products = await getProductsByIds([productId]);
    const product = products[0];

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 🚨 STOCK CHECK
    if (!product.stock || product.stock <= 0) {
      return res.status(400).json({
        error: "Product is out of stock",
      });
    }

    const sellerId = product.sellerId;

    let item = await Cart.findOne({ productId, consumerId });

    if (item) {
      // 🚨 IMPORTANT FIX
      if (item.quantity >= product.stock) {
        return res.status(400).json({
          error: `Only ${product.stock} items available`,
        });
      }

      item.quantity += 1;
      await item.save();
    } else {
      item = await Cart.create({
        productId,
        sellerId,
        consumerId,
        quantity: 1,
      });
    }

    res.json(item);
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

//Get Cart (MAIN API)
exports.getCart = async (req, res) => {
  try {
    const consumerId = req.user.id;

    const cartItems = await Cart.find({ consumerId });

    if (!cartItems.length) {
      return res.json([]);
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await getProductsByIds(productIds);

    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    const formattedCart = cartItems.map((item) => {
      const product = productMap[item.productId.toString()];

      const stock = product?.stock || 0;
      const isOutOfStock = item.quantity > stock || stock === 0;

      return {
        _id: item._id,
        quantity: item.quantity,
        productId: item.productId,
        sellerId: item.sellerId,
        title: product?.title || "Product removed",
        description: product?.description || "",
        price: product?.price || 0,
        image: product?.images?.[0]?.url || "",
        stock,
        isOutOfStock,
      };
    });

    res.json(formattedCart);
  } catch (err) {
    console.error("CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

//UPDATE QUANTITY (returns FULL CART)
exports.updateQuantity = async (req, res) => {
  try {
    const { type } = req.body;
    const itemId = req.params.id;
    const consumerId = req.user.id;

    const item = await Cart.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🔥 Fetch product for stock check
    const products = await getProductsByIds([item.productId]);
    const product = products[0];

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 🔹 HANDLE INCREASE
    if (type === "increase") {
      if (item.quantity >= product.stock) {
        return res.status(400).json({
          error: `Only ${product.stock} items available`,
        });
      }

      item.quantity += 1;
      await item.save();
    }

    // 🔹 HANDLE DECREASE
    else if (type === "decrease") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        await item.deleteOne();
      } else {
        await item.save();
      }
    }

    // 🔥 RETURN FULL UPDATED CART (IMPORTANT)
    const cartItems = await Cart.find({ consumerId });

    const productIds = cartItems.map((i) => i.productId);
    const allProducts = await getProductsByIds(productIds);

    const productMap = {};
    allProducts.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    const formattedCart = cartItems.map((i) => {
      const p = productMap[i.productId.toString()];
      const stock = p?.stock || 0;

      return {
        _id: i._id,
        quantity: i.quantity,
        productId: i.productId,
        sellerId: i.sellerId,
        title: p?.title || "Product removed",
        description: p?.description || "",
        price: p?.price || 0,
        image: p?.images?.[0]?.url || "",
        stock,
        isOutOfStock: i.quantity > stock || stock === 0,
      };
    });

    res.json(formattedCart);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Remove Item from Cart
exports.removeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const consumerId = req.user.id;

    //Delete item
    const deletedItem = await Cart.findOneAndDelete({
      _id: itemId,
      consumerId,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    //Fetch updated cart
    const cartItems = await Cart.find({ consumerId });

    if (!cartItems.length) {
      return res.json([]);
    }

    const productIds = cartItems.map((item) => item.productId);

    const products = await getProductsByIds(productIds);

    //Map products
    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    //Format response
    const formattedCart = cartItems.map((item) => {
      const product = productMap[item.productId.toString()];

      return {
        _id: item._id,
        quantity: item.quantity,
        productId: item.productId,
        sellerId: item.sellerId,
        title: product?.title || "Product removed",
        price: product?.price || 0,
        image: product?.images?.[0]?.url || "",
      };
    });

    res.json(formattedCart);
  } catch (err) {
    console.error("REMOVE ITEM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const consumerId = req.user.id;

    await Cart.deleteMany({ consumerId });

    res.json({
      message: "Cart cleared successfully",
    });

  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

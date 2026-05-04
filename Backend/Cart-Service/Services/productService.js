const axios = require("axios");

exports.getProductsByIds = async (ids) => {
  try {
    const { data } = await axios.post(
      "http://localhost:4000/api/products/bulk",
      { ids }
    );

    return data;

  } catch (err) {
    console.error("PRODUCT SERVICE ERROR:", err.message);
    console.error("FULL ERROR:", err.response?.data || err);

    throw err; // 👈 IMPORTANT (don’t hide error)
  }
};

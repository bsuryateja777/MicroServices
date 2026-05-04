import { useEffect, useState } from "react";
import axios from "axios";
import { notifyError, notifySuccess } from "../Utils/toastify";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    axios
      .get("/api/products/my-products")
      .then((res) => {
        setProducts(res.data);

        // initialize stock inputs
        const initialStocks = {};
        res.data.forEach((p) => {
          initialStocks[p._id] = p.stock;
        });
        setStockInputs(initialStocks);
      })
      .catch((err) => console.log(err));
  }, []);

  // handle input change
  const handleStockChange = (id, value) => {
    setStockInputs((prev) => ({
      ...prev,
      [id]: value === "" ? "" : Number(value),
    }));
  };

  const updateStock = async (id) => {
    try {
      const res = await axios.patch(`/api/products/${id}/stock`, {
        stock: Number(stockInputs[id]),
      });

      // update UI
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));

      notifySuccess("Stock updated!");
    } catch (err) {
      console.log(err);
      notifyError("Failed to update stock.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">My Products</h1>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            {/* LEFT: IMAGE */}
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={
                  product.images?.[0]?.url || "https://via.placeholder.com/150"
                }
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* MIDDLE: INFO */}
            <div className="flex-1 px-6">
              <h2 className="text-lg font-semibold">{product.title}</h2>

              <div className="flex items-center gap-4 mt-1">
                <p className="text-md text-gray-500">
                  Stock:{" "}
                  <span className="font-medium text-black">
                    {product.stock}
                  </span>
                </p>

                {product.stock < 5 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT: INPUT + BUTTON */}
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={stockInputs[product._id] ?? ""}
                min="0"
                onChange={(e) => handleStockChange(product._id, e.target.value)}
                className="border px-3 py-1.5 w-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={() => updateStock(product._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

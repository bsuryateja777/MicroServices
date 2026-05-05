import { useEffect, useState } from "react";
import ProductsGrid from "../Components/ProductsGrid.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function Products() {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("/api/products/allProducts")
      .then((res) => {
        console.log("Products:", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // 🔍 Filter products
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Search */}
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Add Product Button */}
        <Link
          to={user ? "/products/new" : "/login"}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >
          + Publish Product
        </Link>
      </div>

      {/* Products */}
      <ProductsGrid products={filteredProducts} />
    </div>
  );
}

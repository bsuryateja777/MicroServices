import { AddToCartIcon } from "../Utils/Icons";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { notifySuccess, notifyError } from "../Utils/toastify";

export default function ProductsGrid({ products = [] }) {
  const { user } = useContext(UserContext);

  if (!products.length) {
    return <div>No products found</div>;
  }

  const handleAddToCart = async (product) => {
    try {
      if (!user) {
        return notifyError("Please login first");
      }

      const isOut = !product.stock || Number(product.stock) <= 0;

      if (isOut) {
        return notifyError("Product is out of stock");
      }

      await axios.post("/api/cart", {
        productId: product._id,
      });

      notifySuccess("Added to cart");
    } catch (err) {
      console.error(err);
      notifyError("Failed to add to cart");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => {
        const imageUrl = product.images?.[0]?.url;
        const isOut = !product || Number(product.stock) <= 0;

        return (
          <div
            key={product._id}
            className={`relative h-[320px] border rounded-xl overflow-hidden shadow-sm transition bg-white flex flex-col
              ${isOut ? "opacity-60" : "hover:shadow-md"}
            `}
          >
            {/* 🔴 OUT OF STOCK OVERLAY */}
            {isOut && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <span className="text-white font-bold text-lg">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* IMAGE */}
            <div className="min-h-[70%] p-2">
              <div className="w-full h-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={imageUrl || "https://via.placeholder.com/200"}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex flex-row justify-between pl-2 pr-5">
              <div className="flex flex-col justify-between mb-3 w-[70%]">
                {/* TITLE */}
                <div className="px-3">
                  <h2 className="text-lg font-medium line-clamp-1">
                    {product.title}
                  </h2>
                </div>

                {/* DESCRIPTION */}
                <div className="px-3">
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {product.description || "No description available"}
                  </p>
                </div>

                {/* PRICE */}
                <div className="px-3 pb-2">
                  <p className="text-base font-bold text-black">
                    ${product.price}
                  </p>
                </div>
              </div>

              {/* ADD BUTTON */}
              <div className="h-full w-[30%] flex items-center justify-center">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isOut}
                  className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-lg text-sm
                    hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isOut ? "N/A" : "Add"}</span>
                  {!isOut && <AddToCartIcon />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

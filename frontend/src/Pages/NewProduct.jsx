import { useContext, useState } from "react";
import axios from "axios";
import { notifyInfo, notifySuccess } from "../Utils/toastify";
import { CrossIcon } from "../Utils/Icons";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [images, setImages] = useState([]);

  function handleImageSelect(e) {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 8) {
      notifyInfo("Maximum 8 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  }

  function removeImage(indexToRemove) {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  async function publishProduct() {
    console.log("Publish clicked");

    if (!title || !price || images.length === 0) {
      notifyInfo("Title, price and at least one image required");
      return;
    }

    try {
      const uploadPromises = images.map((file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "MicroServices-unsigned");

        return axios.post(
          "https://api.cloudinary.com/v1_1/dxvdbojpj/image/upload",
          data,
          { withCredentials: false },
        );
      });

      const responses = await Promise.all(uploadPromises);

      const imageUrls = responses.map((res) => ({
        url: res.data.secure_url,
        public_id: res.data.public_id,
      }));
      console.log(user);

      const productData = {
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        images: imageUrls,
        sellerId: user._id,
      };

      console.log(productData);

      await axios.post("/api/products/new", productData);

      notifySuccess("Product Published!");

      // ✅ Redirect to home
      navigate("/");
      
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="font-medium text-gray-700">Product Title</label>

          <input
            type="text"
            placeholder="Enter product title"
            className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-medium text-gray-700">Description</label>

          <textarea
            rows="4"
            placeholder="Describe your product"
            className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="flex gap-2 items-center gap-9">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Price</label>
            <span className="text-gray-500">$</span>

            <input
              type="number"
              placeholder="Enter price"
              className="w-60 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Stock</label>
            <input
              type="number"
              placeholder="Enter price"
              className="w-60 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-medium text-gray-700 mb-3 block">
            Product Images
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upload box */}
            <label className="h-48 w-80 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
              <span className="text-gray-500 font-medium">+ Upload Images</span>

              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>

            {/* Image previews */}
            {images.map((file, index) => (
              <div
                key={index}
                className="relative group h-48 w-80 rounded-xl overflow-hidden border border-gray-200 hover:opacity-80 transition transition-all duration-400"
              >
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                  alt=""
                />

                {/* Delete button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition"
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Button */}
        <button
          onClick={publishProduct}
          className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
        >
          Publish Product
        </button>
      </div>
    </div>
  );
}

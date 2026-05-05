import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { UserContext } from "../UserContext";
import Login from "./Login";
import Profile from "../Components/Profile";
import Orders from "../Components/Orders";
import Wallet from "../Components/Wallet";
import Settings from "../Components/Settings";
import MyProducts from "../Components/MyProducts";
import { notifyError, notifySuccess } from "../Utils/toastify";

export default function AccountCenter() {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("profile");

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      notifySuccess("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      notifyError("Logout failed. Please try again.");
      console.error(err);
    }
  }

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-screen sticky top-0 flex flex-col justify-between">
        {/* Top */}
        <div>
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold">My Account</h2>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">
            {[
              { key: "profile", label: "Profile" },
              { key: "orders", label: "My Orders" },
              { key: "my-products", label: "My Products" },
              { key: "wallet", label: "Wallet" },
              { key: "settings", label: "Settings" },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`cursor-pointer px-4 py-2 rounded-lg
                ${
                  activeTab === item.key
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }
              `}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {activeTab === "profile" && (
          <Profile user={user} setActiveTab={setActiveTab} />
        )}
        {activeTab === "orders" && <Orders />}
        {activeTab === "my-products" && <MyProducts />}
        {activeTab === "wallet" && <Wallet />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
}

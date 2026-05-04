import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { notifyInfo } from "../Utils/toastify";

export default function WalletPage() {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    // 🚨 If no user → redirect to login
    if (!user) {
      notifyInfo("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    axios
      .get("/api/wallet")
      .then((res) => setWallet(res.data))
      .catch((err) => {
        // 🚨 If token expired / unauthorized
        if (err.response?.status === 401) {
          notifyInfo("Session expired. Please login again.");
          navigate("/login");
        } else {
          console.log(err);
        }
      });
  }, [user, navigate]);

  // Add money
  const handleAddMoney = async () => {
    try {
      const res = await axios.post("/api/wallet/add-money", { amount });
      setWallet(res.data);
      setAmount("");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  if (!wallet) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Login to see your wallet details
        </h2>
        <p className="text-gray-500">
          Please login to access balance, add money, and view transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Balance Card */}
      <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-xl shadow-blue-500/40 mb-6">
        <h2 className="text-xl">Wallet Balance</h2>
        <p className="text-3xl font-bold mt-2">
          $ {wallet.balance.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Add Money */}
      <div className="bg-pink-100 p-6 rounded-2xl shadow-xl shadow-pink-600/40 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add Money</h3>

        <div className="flex gap-5 justify-between">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 p-2 rounded w-[85%]"
          />
          <button
            onClick={handleAddMoney}
            className="bg-green-500 text-white px-4 py-2 rounded w-[15%]"
          >
            Add
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-blue-50 p-6 rounded-2xl shadow-xl shadow-gray-600/40">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>

        {[...wallet.transactions] // clone to avoid mutating state
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
          .map((tx) => {
            const isCredit = tx.type === "CREDIT";

            return (
              <div
                key={tx._id}
                className={`flex justify-between border border-gray-300 ${
                  isCredit ? "bg-green-100" : "bg-red-100"
                } rounded-2xl px-10 py-4 my-2`}
              >
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>

                <p
                  className={`font-bold ${
                    isCredit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCredit ? "+" : "-"}${tx.amount.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

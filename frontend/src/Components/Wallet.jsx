import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function Wallet() {
  const { user } = useContext(UserContext);

  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!user) return;

    axios
      .get("/api/wallet")
      .then((res) => setWallet(res.data))
      .catch((err) => console.log(err));
  }, [user]);

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) return;

    try {
      const res = await axios.post("/api/wallet/add-money", { amount });
      setWallet(res.data);
      setAmount("");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  if (!wallet) {
    return <div className="text-gray-500">Loading wallet...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-md mb-6">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-3xl font-bold mt-1">
          $ {wallet.balance.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Add Money */}
      <div className="bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-lg font-semibold mb-4">Add Money</h2>

        <div className="flex gap-4">

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-lg"
          />

          <button
            onClick={handleAddMoney}
            className="bg-green-500 text-white px-6 rounded-lg hover:bg-green-600 transition"
          >
            Add
          </button>

        </div>

        {/* Optional quick suggestions */}
        <div className="flex gap-2 mt-4">
          {[500, 1000, 2000].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100"
            >
              ${val}
            </button>
          ))}
        </div>

      </div>
    </>
  );
}
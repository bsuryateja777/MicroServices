import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { notifyDark, notifyError, notifySuccess } from "../Utils/toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if(password === confirmPassword && (name !== "" || email !== "" || password !== "" || confirmPassword !== "")) {
    try {
      await axios.post("/api/auth/register",
        { name, email, password }
      );
    notifySuccess("registration Successful")
    navigate("/home");
    } catch (err) {
      notifyError(err.response?.data?.message || "Registration failed");
    }
  }
  else {
    notifyDark("Passwords does not match")
    setPassword('')
    setConfirmPassword('')
  }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-pink-200 shadow-2xl shadow-black rounded-xl p-8 w-full max-w-md my-10">
        
        <h1 className="text-2xl font-bold text-center mb-4">
          Docker Mart
        </h1>

        <form className="space-y-3" onSubmit={handleRegister}>
          
          <div>
            <label className="block mb-0.5 font-medium">Full Name</label>
            <input type="text" placeholder="Enter your name" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={name} onChange={(e) => setName(e.target.value)}/>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password"  placeholder="Enter password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input type="password"  placeholder="Enter password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
            Register
          </button>
          <div className="text-center py-1 text-gray-500">
            Already have an account?
            <Link to={'/login'} className="underline text-black p-2">Login now</Link>
          </div>

        </form>

      </div>
    </div>
  );
}
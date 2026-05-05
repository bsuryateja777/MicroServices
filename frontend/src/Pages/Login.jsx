import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { notifySuccess, notifyError } from "../Utils/toastify.js";

export default function Login() {

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function userLogin(e) {
    e.preventDefault();

    try {

      const {data} = await axios.post("/api/auth/login", 
        { email, password }
      );

      // store user in context
      setUser(data);

      notifySuccess(`Welcome back ${data.name}`);

      // redirect
      navigate("/home");

    } catch (err) {

      notifyError(err.response?.data?.message || "Login failed");

    }
  } 

  return (
    <div className="min-h-screen flex items-center justify-center relative -top-10">
      
      <div className="bg-blue-100 shadow-2xl shadow-black rounded-xl p-8 w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Docker Mart
        </h1>

        <form className="space-y-4" onSubmit={userLogin}>
          
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input type="text" placeholder="Enter your Email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" placeholder="Enter Password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account?
            <Link to={'/register'} className="underline text-black p-2">Register now</Link>
          </div>

        </form>

      </div>
    </div>
  );
}

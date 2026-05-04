import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import Header from './Components/Header';
import Home from './Pages/Home.jsx';
import Cart from './Pages/Cart.jsx';
import ProductsPage from './Pages/Products.jsx';
import Account from './Pages/Account.jsx';
import { UserContextProvider } from './UserContext.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Wallet from './Pages/Wallet.jsx';
import NewProduct from './Pages/NewProduct.jsx';
import AccountCenter from './Pages/AccountCenter.jsx';
import MyProducts from './Components/MyProducts.jsx';

axios.defaults.baseURL = process.env.REACT_APP_GATEWAY_URL;
axios.defaults.withCredentials = true;


function App() {
  return (
    <UserContextProvider>
    <div className="App">
      <Header />

      <Routes>
        <Route path='/' element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path='/products/new' element={<NewProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/account-center" element={<AccountCenter />} />
        <Route path='/wallet' element={<Wallet />} />
        <Route path='/products/my-products' element={<MyProducts />} />
      </Routes>

      <ToastContainer position='top-right' autoClose={2000}  theme="light" newestOnTop pauseOnHover/>

    </div>
    </UserContextProvider>
  );
}

export default App;

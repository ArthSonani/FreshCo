import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Navbar from './components/Navbar';
import UserSignup from './pages/UserSignup';
import UserSignin from './pages/UserSignin';
import VendorSignin from './pages/VendorSignin'; 
import VendorSignup from './pages/VendorSignup';
import Inventory from './pages/Inventory';
import Shop from './pages/Shop';
import StoreProducts from './pages/StoreProducts';
import VendorAccount from './pages/VendorAccount';
import UserAccount from './pages/UserAccount';
import Orders from './pages/Orders'
import CartState from './context/CartContext'
import ItemQtyState from './context/ItemQtyContext';
import VendorOrders from './pages/VendorOrders';


export default function App() {
  // toastr.options.timeOut = 30;
  return (
    <BrowserRouter>
      <CartState>
      <ItemQtyState>
        <Navbar />
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/signin" element={<UserSignin />} />
          <Route path="/vendor/signin" element={<VendorSignin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/user/account" element={<UserAccount />} />
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/vendor/account" element={<VendorAccount />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/store/:storeId" element={<StoreProducts />} />
          <Route path="/store/orders" element={<VendorOrders />} />
        </Routes>
      </ItemQtyState>
      </CartState>
    </BrowserRouter>
  );
}

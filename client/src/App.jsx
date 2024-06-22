import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from './pages/Home'
import Navbar from './components/Navbar';
import UserSignup from './pages/UserSignup';
import UserSignin from './pages/UserSignin';
import VendorSignin from './pages/VendorSignin';
import VendorSignup from './pages/VendorSignup';
import Inventory from './pages/Inventory';
import Shop from './pages/Shop';


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/signin" element={<UserSignin />} />
          <Route path="/vendor/signin" element={<VendorSignin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/shop' element={<Shop />} />
      </Routes>
    </BrowserRouter>
  );
}

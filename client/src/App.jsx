import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from './pages/Home'
import Navbar from './components/Navbar';
import Signup from './pages/Signup'
import Signin from './pages/Signin';


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

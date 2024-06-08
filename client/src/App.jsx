import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home'
import Profile from './pages/Profile'
import Navbar from './components/Navbar';
import Main from './components/Main';


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Main />

      {/* <button className='butt'><Link to='/'>Home</Link></button>
      <button className='butt'><Link to='/profile'><button>Profile</button></Link></button>

      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="profile" element={<Profile />} />
      </Routes> */}
    </BrowserRouter>
  );
}

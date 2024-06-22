import React from 'react'
import as  from '../assets/'

export default function Store() {
  return (
    <div className='store-container'>
        <div className='store-image'>
            <img className='store-img' src='../assets/banana.png'/>
        </div>
        <div className='store-info'>
            <h5>Mahakali</h5>
            <p>Dabholi</p>
            <p>Grocerry - Home - Electronics</p>
        </div>
    </div>
  )
}

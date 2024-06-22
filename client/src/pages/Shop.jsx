import React from 'react'
import Store from '../components/Store'

export default function Shop() {
  return (
    <div>
      <h1>Stores near you</h1>
        <div className='stores-container'>

        <Store />
        <Store />
        <Store />
        <Store />
        </div>
        
    </div>
  )
}

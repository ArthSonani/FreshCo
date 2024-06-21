import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import Loader from '../components/Loader'
import Product from '../components/Product'
import { useNavigate } from 'react-router-dom'

export default function Home() {

    const navigate = useNavigate();

  return (
      <section>
        <div className='home-intro'>
          <h1>Open the door,<br/>
            we have come with your grocery
          </h1>
          <p>Whatever you want from local stores, brought right to your door.</p>
        </div>
        {/* <div className='products'>
          <Product />
          <Product />
          <Product />
        </div> */}
      </section>
  )
}

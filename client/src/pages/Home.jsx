import React from 'react'
import homeIntro from '../assets/home-intro.png'

export default function Home() {

  return (
      <section>
        <div className='home-intro'>
          <h1>Open the door,<br/>
            we have come with your grocery
          </h1>
          <p>Whatever you want from local stores, brought right to your door.</p>
          <div className='home-shop'>
            <img src={homeIntro}/>
          </div>
          
        </div>
        
      </section>
  )
}

// 1. #81523F
// 2. #B68363
// 3. #DCCBC5
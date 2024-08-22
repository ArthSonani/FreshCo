import React, { useEffect, useState } from 'react';
import homeIntro from '../assets/home-intro.png';
import home1 from '../assets/home1.jpg';
import home2 from '../assets/home2.jpg';
import home3 from '../assets/home3.jpg';

import grocery from '../assets/grocery.png';
import beauty from '../assets/beauty.png';
import clothes from '../assets/clothes.png';
import essential from '../assets/essential.png';
import gadget from '../assets/gadget.png';
import games from '../assets/games.png';
import medicine from '../assets/medicine.png';
import pets from '../assets/pets.png';
import stationary from '../assets/stationary.png';

export default function Home() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const texts = ['Seamless Shopping !', 'Your Pantry !', 'Modern Convenience !', 'Your Shopping Cart !'];
    let textIndex = 0;
    let charIndex = 0;
    let isTyping = true;

    const dynamicTextElement = document.getElementById('dynamic-text');

    function type() {
      if (isTyping) {
        if (charIndex <= texts[textIndex].length) {
          dynamicTextElement.innerHTML = texts[textIndex].substring(0, charIndex);
          charIndex++;
          setTimeout(type, 200);
        } else {
          isTyping = false;
          setTimeout(type, 500);
        }
      } 
      
      else {
        if (charIndex > 0) {
          dynamicTextElement.innerHTML = texts[textIndex].substring(0, charIndex - 1);
          charIndex--;
          setTimeout(type, 50);
        } else {
          isTyping = true;
          textIndex = (textIndex + 1) % texts.length;
          dynamicTextElement.innerHTML = ''; 
          setTimeout(type, 500);
        }
      }
    }
    type();

    return () => {
      // Cleanup function to reset the typing effect when component unmounts
      dynamicTextElement.innerHTML = '';
    };
  }, []);

  function responsiveTextContainer(){
    if(windowWidth <= 500){
      return(
      <span className='dynamic-500'>
        <span id="dynamic-text"></span>
        <span className="blink-cursor">|</span>
      </span>)
    }
    else{
      return(
      <>
        <span id="dynamic-text"></span>
        <span className="blink-cursor">|</span>
      </>)
    }
  }

  return (
    <section>
      <div className='home-intro'>
        <div className="text-container">
          <span className='main-head'>Where Local Markets Meet&nbsp;</span>
            {responsiveTextContainer()}
        </div>
        <p>Whatever you want from local stores, brought right to your door.</p>
        <div className='home-shop'>
          <img src={homeIntro} alt="Home Intro" />
        </div>
        <span className='home-sub-info-text'>
          Every order you place helps support local farmers, artisans, and small businesses. <br />
          We're committed to reinvesting in our community by bringing fresh, locally-sourced products to your doorstep.<br />
          Shopping locally isn't just about convenience—it's about fostering connections within your community. <br />
          Your support helps keep these beloved markets thriving for years to come.
        </span>
      </div>


      <div className='featured-category'>
        <div className='fc-name'>
          Featured Categories
        </div>
        <div className='fc-content'>
          <div><img src={grocery}/><span>Grocery</span></div>
          <div><img src={stationary}/><span>Stationary</span></div>
          <div><img src={games}/><span>Games</span></div>
          <div><img src={medicine}/><span>Pharmacy</span></div>
          <div><img src={beauty}/><span>Beauty</span></div>
          <div><img src={clothes}/><span>Clothes</span></div>
          <div><img src={essential}/><span>Essentials</span></div>
          <div><img src={gadget}/><span>Electronics</span></div>
          <div><img src={pets}/><span>Pets</span></div>
        </div>
      </div>


      <h4 className='home-subhead'>Featured Local Markets</h4>
      <div className='home-photos'>
        <div className='home-photo'>
          <img src={home1} alt="Market Fresh Grocery" />
          <div>
            <h5>Market Fresh Grocery</h5>
            Experience farm-fresh produce, organic selections, and artisanal goods sourced locally. Support sustainable farming practices while enjoying the best your community has to offer.
          </div>
        </div>
        <div className='home-photo'>
          <img src={home2} alt="City Farmers Market" style={{filter: 'brightness(90%)'}} />
          <div>
            <h5>City Farmers Market</h5>
            Your one-stop shop for the freshest fruits, vegetables, and homemade treats. Shop local and taste the difference in every bite.
          </div>
        </div>
        <div className='home-photo'>
          <img src={home3} alt="Downtown Delights" />
          <div>
            <h5>Downtown Delights</h5>
            From locally roasted coffee to hand-crafted bread, Downtown Delights brings you the best of small-batch goods, supporting local artisans and farmers.
          </div>
        </div>
      </div>
    </section>
  );
}



// #E9EFE6
// #BDCFB5  -- #7f9077
// #4B6340   -- #2C7847
// #263120

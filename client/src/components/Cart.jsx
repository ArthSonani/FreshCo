import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { matchPath, useNavigate } from 'react-router-dom'
import cartImage from '../assets/empty-cart.png'

export default function Cart() {
  const currentUser = useSelector((state) => state.user.user)
  const navigate = useNavigate()
  const isActive = (path) => !!matchPath({ path, end: true }, location.pathname);

  const [ allCarts, setAllCarts ] = React.useState([])
  const [ activeCart, setActiveCart ] = React.useState(null)
  const [ currentStore, setCurrentStore ] = React.useState(null)

  let cartTotal = 0;
  activeCart ? activeCart.products.map((product)=>{
    cartTotal += product.quantityInCart * product.price
  }) : null

  async function allStoreCarts() {
    try {
      const res = await fetch('/api/user/carts', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({zipcode : currentUser.zipcode, user : currentUser._id})

      })
      const data = await res.json()
      console.log(data.cartStoresInArea)
      setAllCarts(data.cartStoresInArea)

      if (data.success === false) {
        console.log(data.message)
        return
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  async function getStore() {
    try{
      const res = await fetch('/api/user/get-store',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({storeId : location.pathname.split('/store/')[1]})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }
      setCurrentStore(data.store)
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getStore()
  }, [location.pathname])

  useEffect(() => {
    if (isActive('/') || isActive('/shop/:category')) {
      setActiveCart(null);
    } else if (isActive('/store/:storeId')) {
      const storeId = location.pathname.split('/store/')[1];
      const storeCart = allCarts.find((cart) => cart.store === storeId);
      setActiveCart(storeCart);
    }
  }, [location.pathname, allCarts]);


  const allCartsOfUser = allCarts
  .filter(cart => cart.productCount !== 0)
  .map(cart => (
    <div key={cart._id} className='cart-store'>
      <div className='cart-store-upper'>
        <div className='cart-store-logo'><img src={cart.logo} /></div>
        <div className='cart-store-info'>
          <p>{cart.businessName}</p>
          <p>{cart.categories[0]}</p>
          <p>{cart.categories[1]}</p>
        </div>
      </div>
      <div className='cart-store-lower'>
        <div className='cart-product-message'>{cart.productCount} products in cart</div>
        <div className='continue-button-container'>
          <div className='continue-button' onClick={() => navigate(`/store/${cart.store}`)}>
            Continue Shopping <span className="material-symbols-outlined">trending_flat</span>
          </div>
        </div>
      </div>
    </div>
  ));


  return (
    <>
    <span className="material-symbols-outlined click-button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" onClick={allStoreCarts}>shopping_cart</span>

    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: "500px" }}>
        <div className="offcanvas-header cart-head">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">{isActive('/store/:storeId') && currentStore ? currentStore.businessName : 'Carts'}</h5>
          <p>Shopping in {currentUser.zipcode}</p>
        </div>

        <div className="offcanvas-body cart-body">
          
          {isActive('/store/:storeId') && currentStore ? 
            (<div className='active-cart-container'>

              {activeCart && activeCart.productCount !== 0 ?
                <div className='active-cart-head'>
                  <div className='active-cart-logo'><img src={currentStore.logo} /></div>
                  <div className='active-cart-info'>
                    <div className='active-cart-info-store'>
                      {currentStore.businessName}
                      <p>{currentStore.categories[0]}</p>
                      <p>{currentStore.categories[1]}</p>
                    </div>
                    <div className='active-cart-total'>
                      {cartTotal != 0 ? <span>₹&nbsp;{cartTotal}</span> : null}
                    </div>
                  </div>
                </div> : null}

              {activeCart && activeCart.productCount !== 0 ? activeCart.products.map((product)=>{
                return (
                  <div className='cart-products' key={product._id}>
                    <div className='cart-product-img'><img src={product.image} /></div>
                    <div className='cart-product-info'>
                      <div className='cart-product-info-detail'>
                        {product.name}
                        <p>{product.quantity}</p>
                      </div>
                      <div className='cart-product-info-price'>
                        <span className='cart-product-info-price-qty'><span className="material-symbols-outlined">remove</span>{product.quantityInCart} <span className="material-symbols-outlined">add</span></span>
                        <span className='cart-product-info-price-total'>₹&nbsp;{product.quantityInCart * product.price}</span>
                      </div>
                    </div>
                  </div>
                )}) : 
                
                <div className='empty-cart'>
                  <img src={cartImage} />
                  <span>Cart is empty</span>
                </div>
              }

              {activeCart && activeCart.productCount !== 0 ?
                <div className='checkout-container'>
                  <div className='checkout'><span className="material-symbols-outlined">shopping_cart_checkout</span>&nbsp;Checkout<div>₹&nbsp;{cartTotal}</div></div>
                </div> : null
              }
              
            </div>) : 
            
            (allCartsOfUser.length !== 0? allCartsOfUser : 
            
            <div className='empty-cart'>
              <img src={cartImage} />
              <span>Cart is empty</span>
            </div>)
          }
      </div>
    </div>
    </>
  )
}

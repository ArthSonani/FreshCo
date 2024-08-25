import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { matchPath, useNavigate } from 'react-router-dom'

import cartImage from '../assets/empty-cart.png'
import { CartContext } from '../context/CartContext'
import CartItem from './CartItem'
import Loading from './Loading'


export default function Cart() {

  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user.user)
  const isActive = (path) => !!matchPath({ path, end: true }, location.pathname);
  
  const {activeCart, getActiveCart, remove} = useContext(CartContext) 

  const [ allCarts, setAllCarts ] = useState(null)
  const [ currentStore, setCurrentStore ] = useState(null)
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

  let cartTotal = 0;
  activeCart ? activeCart.products.map((product)=>{
    cartTotal += product.quantityInCart * product.price
  }) : null
 
  async function allStoreCarts() {
    try {
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/carts', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({zipcode : currentUser.zipcode, user : currentUser._id})

      })
      const data = await res.json()
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
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/get-store',{
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


  async function checkAvailability() {
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/check-availability',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({store : location.pathname.split('/store/')[1], user : currentUser._id})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return true
      }

      if(data.avail === false){
        toast.error(data.message)
        return true
      }

      return false

    }
    catch(err){
      console.log(err)
      return true
    }
  }

  async function updateInventory() {
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/update-inventory',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({store : location.pathname.split('/store/')[1], user : currentUser._id})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }

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
      remove()
    } else if (isActive('/store/:storeId')) {
      const storeId = location.pathname.split('/store/')[1];
      // const storeCart = allCarts.find((cart) => cart.store === storeId);
      getActiveCart(currentUser._id, storeId);
    }
  }, [location.pathname, allCarts]);


  const allCartsOfUser = allCarts? allCarts
  .filter(cart => cart.products.length !== 0)
  .map(cart => (    
    <div key={cart._id} className='cart-store'>
      <div className='cart-store-upper'>
        <div className='cart-store-logo'><img src={cart.logo} /></div>
        <div className='cart-store-info'>
          <p>{cart.businessName}</p>
          <span>
            {cart.categories[0]?<span>{cart.categories[0]}</span> : null}
            {cart.categories[1]?<span> &nbsp; · &nbsp;{cart.categories[1]}</span>:null}
          </span>
          <span>
            {cart.categories[2]?<span>{cart.categories[2]}</span> : null}
            {cart.categories[3]?<span> &nbsp; · &nbsp;{cart.categories[3]}</span> : null}
          </span>
          
        </div>
      </div>
      <div className='cart-store-lower'>
        <div className='cart-product-message'>{cart.products.length} products in cart</div>
        <div className='continue-button-container'>
          <div className='continue-button' onClick={() => navigate(`/store/${cart.store}`)}>
            Continue Shopping <span className="material-symbols-outlined">trending_flat</span>
          </div>
        </div>
      </div>
    </div>
  )): null

  const activeCartProducts = activeCart? activeCart.products.map((product)=>{
    return (
      <CartItem 
        key = {product._id}
        product = {product}
      />
    )}) : null
    

  async function handlePayment() {

    if(currentUser.address == 'none' || currentUser.address == "" || currentUser.address == null){
      toast.error('Your Address is required')
      return
    }
    if(currentUser.phone == 'none' || currentUser.phone == '' || currentUser.phone == null){
      toast.error('Your Phone number is required')
      return
    }

    const availabilityCheck = await checkAvailability();
    if(availabilityCheck){
      return
    }
  
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/payment/order',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({amount : cartTotal})
      })

      const data = await res.json()
      handlePaymentVerify(data.order)

      if(data.success === false){
        console.log(data.message)
        return
      }

    }
    catch(err){
      console.log(err)
    }
  
  }

  async function handlePaymentVerify(orderData) {
    const options = {
      key : import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount : orderData.amount,
      currency : orderData.currency,
      name : 'Arth',
      description : 'Test Mode',
      order_id : orderData.id,

      handler : async (response) => {
        try{
          const verifyRes = await fetch('https://freshco-0dlm.onrender.com/api/payment/verify',{
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              razorpay_order_id : response.razorpay_order_id,
              razorpay_payment_id : response.razorpay_payment_id,
              razorpay_signature : response.razorpay_signature
            })
          })
    
          const verifyData = await verifyRes.json()
    
          if(verifyData.success === false){
            console.log(verifyData.message)
            return
          }

          saveUserOrder()
          updateInventory()

          if(verifyData.message){
            toast.success(verifyData.message)
          }
    
        }
        catch(err){
          console.log(err)
        }
      },

      theme : {
        color : "#4B6340"
      }
    }

    const rzp1 = new window.Razorpay(options);
    rzp1.open()
  }
  
  async function saveUserOrder() {
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/save-order',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({user : currentUser._id, store : activeCart.store, totalAmount : cartTotal})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }

      allStoreCarts()

    }
    catch(err){
      console.log(err)
    }
  }


  return (
    
    <>
    <span className="material-symbols-outlined click-button cart-open" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" onClick={allStoreCarts}>shopping_cart</span>

    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style={{ width: "500px"}}>
      {!allCarts? <Loading /> :
      <>
        <div className="offcanvas-header cart-head">
          {windowWidth < 500? <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> : null}
          <h5 className="offcanvas-title" id="offcanvasRightLabel">{isActive('/store/:storeId') && currentStore ? currentStore.businessName : 'Carts'}</h5>
          <p>Shopping in {currentUser.zipcode}</p>
        </div>

        <div className="offcanvas-body cart-body">
          
          {isActive('/store/:storeId') && currentStore ? 
            (<div className='active-cart-container'>

              {activeCart && activeCart.products.length !== 0 ?
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

              {activeCart && activeCart.products.length !== 0 ? 
                <>
                
                {activeCartProducts}
                
                <div className='checkout-container'>
                  <div className='checkout' onClick={handlePayment}><span className="material-symbols-outlined">shopping_cart_checkout</span>&nbsp;Checkout<div>₹&nbsp;{cartTotal}</div></div>
                </div>
                </>
                : 
                
                <div className='empty-cart'>
                  <img src={cartImage} />
                  <span>Cart is empty</span>
                </div>
              }
              
            </div>) : 
            
            (allCartsOfUser? allCartsOfUser.length !== 0? allCartsOfUser :  
              <div className='empty-cart'>
                <img src={cartImage} />
                <span>Cart is empty</span>
              </div>: null
            )
          }
      </div>
      </>}
    </div>
    </>
    
  )
}

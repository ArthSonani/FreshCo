import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import orderImage from '../assets/vendorOrder.svg'
import loading from '../assets/loading.svg'
import { useNavigate } from 'react-router-dom';

export default function Orders() {

  const currentVendor = useSelector((state)=>state.vendor.vendor);
  const navigate = useNavigate();

  const [ orders, setOrders ] = useState(null);
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

  async function userOrders() {
    try{
      const res = await fetch('https://fresh-co-backend.vercel.app/api/shop/orders',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({store : currentVendor._id})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }
      setOrders(data.orders)
    }
    catch(err){
      console.log(err)
    }
  }

  function toggleProducts(orderId) {
    const productList = document.getElementById(orderId);
    productList.classList.toggle('open');
    const arrow = document.getElementById(orderId + '-right-arrow')
    if(productList.classList.contains('open')){
      arrow.classList.add('rotate-90')
    }
    else{
      arrow.classList.remove('rotate-90')
    }
  }

  useEffect(()=>{
    userOrders()
  }, [])
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    return date.toLocaleString('en-US', options);
};


  const orderComponents = orders? orders.map((order) => {

    let itemsInOrder = 0;
    order.products.forEach(product => {
      itemsInOrder += product.quantityInCart;
    });;

    return(
    <div className='order' key={order._id}>

      <div className='order-total'>
        <p>ORDER ID  &nbsp;&nbsp;<span>{order._id.toUpperCase()}</span></p>
        <p><span>PLACED</span> <span>TOTAL</span></p>
        <p><span>{formatDate(order.createdAt)}</span> <span>₹ {order.totalAmount}</span></p>
      </div>
      
      <hr />

      <div className='shipping-info'>
        <div className='shipping-info-name'>
          <span>{order.user.firstname}&nbsp;{order.user.lastname}</span>
          <span>+91 {order.user.phone}</span>
          <span>{order.user.email}</span>
        </div>
        <div className='shipping-info-address'>
          <span>{order.user.address}</span>
          <span>{order.user.area}&nbsp;({order.user.zipcode})</span>
        </div>
      </div>

      <hr />

      <div className='store-order-products'>

        <div className='products-dropdown' onClick={(()=>toggleProducts(order._id))}>
          Products
          <span className="material-symbols-outlined dropdown-arrow" id={`${order._id}-right-arrow`}>arrow_right</span>
        </div>

        <div className='store-order-products-list' id={order._id}>
          {order.products.map((product)=>{
              return (
                <div className='store-order-product' key={product._id}>
                  <div className='store-order-product-img'><img src={product.image} height={20}/></div>
                  <div className='store-order-product-info'>
                    <div className='product-id-name'>
                      <span>{product.name}</span>
                      <span>{windowWidth < 500? null : 'ID:'} {product._id}</span>
                    </div>
                    <div className='product-qty-pr'>
                      <div>
                        <span>₹&nbsp;{product.price}</span>
                        <span>{product.quantity}</span>
                      </div>
                      <div>
                        <span className='cart-product-info-price-qty'>Qty : {product.quantityInCart}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
              })
          }
        </div>
      </div>

    </div>
    )
}) : null

  return (
    orderComponents == null ? 
    <div className='loading'> <img src={loading} /></div> :

    <div className='user-orders'>
      {windowWidth < 500 ? 
        <div className='orders-sideboard'>
          <h2>Your Orders</h2>
          <p>Orders Incoming! {windowWidth<500? <br />:null} Get Ready to Fulfill Them!</p>
          <img src={orderImage}/>
        </div> : null
      }

      <div className='orders-container'>
        {orderComponents.length !== 0? orderComponents : 

        <div className='no-order-yet'>
          <h5>No orders received yet. Stay tuned!</h5>
          <div onClick={()=>navigate('/inventory')}>Inventory&nbsp;&nbsp;<span className="material-symbols-outlined">trending_flat</span></div>
        </div>
        }
      </div>

      {windowWidth < 500 ? null : 
        <div className='orders-sideboard'>
          <h2>Your Orders</h2>
          <p>Orders Incoming! Get Ready to Fulfill Them!</p>
          <img src={orderImage}/>
        </div>
      }
    </div>
  )
}

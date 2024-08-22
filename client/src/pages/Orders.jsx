import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import orderImage from '../assets/orderImage.svg'
import loading from '../assets/loading.svg'

export default function Orders() {

  const currentUser = useSelector((state)=>state.user.user);

  const [ orders, setOrders ] = useState(null);

  async function userOrders() {
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/user-orders',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({user : currentUser._id})
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

    let moreItemPlace = order.products.length >= 3 ? '75px' : order.products.length == 2 ? '50px' : '25px';

    return(
      
    <div className='order' key={order._id}>

      <div className='order-total'>
        <p>ORDER ID  &nbsp;&nbsp;<span>{order._id.toUpperCase()}</span></p>
        <p><span>PLACED</span> <span>TOTAL</span></p>
        <p><span>{formatDate(order.createdAt)}</span> <span>₹ {order.totalAmount}</span></p>
      </div>
      <hr />

      <div className='ordered-store'>
        <img src={order.store.logo}/>
        <div className='order-store-info'>
          <div className='order-store-name'>
            <span>{order.store.businessName}</span>
            <span>{order.store.area}</span>
          </div>
          <div className='products-images'>
            <img src={order.products[0].image}/>
            {order.products[1] ?<img src={order.products[1].image}/> : null}
            {order.products[2] ?<img src={order.products[2].image}/> : null}
            {itemsInOrder > order.products.length ? <span style={{left : moreItemPlace}}>+ {itemsInOrder - (order.products.length <= 3? order.products.length : 3)}</span> : null}
          </div>
          <div className='order-product-info'>
              <span>Your order contains {itemsInOrder} {itemsInOrder == 1 ? "Item" : "Items"}</span>
          </div>
        </div>
      </div>

      <div className='ordere-delivary-info'>
        <div className='order-status'>
          <p>&nbsp;<span className='status-dot'></span> &nbsp;Pending</p>
          <p><span className="material-symbols-outlined">schedule</span> &nbsp; Will be delivered soon</p>
        </div>
      </div>

    </div>
    )
}) : null

  return (
    orderComponents == null ? 
      <div className='loading'> <img src={loading} /></div> :

      <div className='user-orders'>
        <div className='orders-container'>
          {orderComponents.length !== 0? orderComponents : 

          <div className='no-order-yet'>
            <h5>You haven't placed any order yet.</h5>
            <div onClick={()=>navigate('/shop/all-stores')}>Shop&nbsp;&nbsp;<span className="material-symbols-outlined">trending_flat</span></div>
          </div>
          }
        </div>

        <div className='orders-sideboard'>
          <h2>Your Orders</h2>
          <p>Hold Tight, It's on Its Way!</p>
          <img src={orderImage}/>
        </div>
      </div>
    )
}

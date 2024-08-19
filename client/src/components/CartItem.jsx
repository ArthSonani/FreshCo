import React, { useContext, useEffect, useState } from 'react'
import { ItemQtyContext } from '../context/ItemQtyContext'
import { CartContext } from '../context/CartContext'
import { useSelector } from 'react-redux'

export default function CartItem(props) {

  const { getPreviousQty, updateCart, removeProduct } = useContext(ItemQtyContext)
  const { activeCart } = useContext(CartContext)
  const currentUser = useSelector(state=>state.user.user)

  const [ count, setCount ] = useState(0)

  useEffect(()=>{

    const productInfo = activeCart.products.find(product => product._id === props.product._id);
    setCount(productInfo.quantityInCart)

  }, [activeCart]) 

  function handleQuantity(str){
    if(str === 'add'){
      setCount(count + 1)
      updateCart(currentUser._id, props.product.storeId, { product : props.product.product, quantityInCart : 1 }, str)
    }
    else if(str === 'remove'){
      setCount(count - 1)
      updateCart(currentUser._id, props.product.storeId, { product : props.product.product, quantityInCart : 1 }, str)
    }
  }

  return (
    <div className='cart-products'>
        <div className='cart-product-img'><img src={props.product.image} /></div>
        <div className='cart-product-info'>
          <div className='cart-product-info-detail'>
            {props.product.name}
            <p>{props.product.quantity}</p>
          </div>
          <div className='cart-product-info-price'>
            <span className='cart-product-info-price-qty'>
              <span className="material-symbols-outlined click-button" onClick={()=>handleQuantity('add')}>add</span> 

                {count} 

              {count <= 1 ? 
                <span className="material-symbols-outlined click-button" onClick={()=>removeProduct(currentUser._id, props.product.storeId, props.product.product)}>delete</span> : 
                <span className="material-symbols-outlined click-button" onClick={()=>handleQuantity('remove')}>remove</span>
              } 
            </span>
            <span className='cart-product-info-price-total'>₹&nbsp;{props.product.quantityInCart * props.product.price}</span>
          </div>
        </div>
      </div>
  )
}

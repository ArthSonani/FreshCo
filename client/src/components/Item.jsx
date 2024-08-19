import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { ItemQtyContext } from '../context/ItemQtyContext'
import { populate } from 'dotenv'

export default function Item(props) {

  const currentUser = useSelector(state=>state.user.user)
  const params = useParams()
  const { activeCart, getActiveCart } = useContext(CartContext)
  const { getPreviousQty, updateCart, removeProduct } = useContext(ItemQtyContext)

  const [ count, setCount ] = React.useState(0)


  useEffect(()=>{

    async function fetchPreviousQty() {
      try {
        const productQty = await getPreviousQty(currentUser._id, params.storeId, props.id);
        if (productQty) {
          setCount(productQty);
        }
        else{
          setCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch previous quantity:', error);
      }
    }
    fetchPreviousQty();

  }, [activeCart, currentUser._id, params.storeId]) 

  
  useEffect(()=>{
    getActiveCart(currentUser._id, props.store)
  }, [count])

  async function removeProductFromCart(){
    setCount(0)
    await removeProduct(currentUser._id, params.storeId, props.id)
  }

  function handleQuantity(str){
    if(str === 'add'){
      setCount(count + 1)
      updateCart(currentUser._id, params.storeId, { product : props.id, quantityInCart : 1 }, str)
    }
    else if(str === 'remove'){
      setCount(count - 1)
      updateCart(currentUser._id, params.storeId, { product : props.id, quantityInCart : 1 }, str)
    }
  }

  function rotateCard(id) {
    const item = document.getElementById(id);
    const front = item.querySelector('.product-front');
    const back = item.querySelector('.product-back');
  
    // Add a class to rotate the card
    item.classList.toggle('rotated');
    
    // Toggle display of front and back
    if (item.classList.contains('rotated')) {
      front.style.transform = 'rotateY(180deg)';
      back.style.display = 'block';
    } else {
      front.style.transform = 'rotateY(0deg)';
      back.style.display = 'none';
    }
  }

  return (
    <div className='item' id={props.id}>
      <div className='item-card-inner'>
        <div className='item-front'>
          <div className='item-image'>
            <img src={props.image} /> 
            
            <span className='item-description' onClick={()=>rotateCard(props.id)}>
              <span className="material-symbols-outlined">description</span>
            </span>
            {count <= 0 ?
              <span className='item-add-container' onClick={()=>handleQuantity('add')}>
                <span className="material-symbols-outlined item-add">add_circle</span>&nbsp;Add&nbsp;to&nbsp;cart
              </span>
            :
              <span className='cart-count-container'>
                <span className="material-symbols-outlined item-add" onClick={()=>handleQuantity('add')}>add_circle</span>
                {count}
                {count == 1? <span className="material-symbols-outlined item-add" onClick={()=>removeProductFromCart()}>delete</span> : <span className="material-symbols-outlined item-add" onClick={()=>handleQuantity('remove')}>do_not_disturb_on</span>}
              </span>
            }
          </div>
          <div className='item-info'>
              <div className='item-price'>₹ {props.price}</div>
              <div className='item-name'>{props.name}</div>
              <div className='item-in-stock'>{props.quantity}</div>
              {props.inStock <= 10 ? props.inStock === 0? <div className='item-in-stock'>Out of stock</div> : <div className='item-in-stock'>Only {props.inStock} left</div> : null}
          </div>
        </div>
        <div className='item-back'>
            <span className='item-rotate' onClick={()=>rotateCard(props.id)}>
              <span className="material-symbols-outlined">rotate_left</span>
            </span>
          <span>Category</span><br />
          <p> {props.mainCat.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())} <br/>
          ( {props.subCat.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())} )</p>
          <span>Description</span><br />
          <p>{props.description}</p>
        </div>
      </div>
    </div>

  )
}
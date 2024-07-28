import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function Item(props) {

  const currentUser = useSelector(state=>state.user.user)
  const params = useParams()

  const [ addtocart, setAddtocart ] = React.useState(true)
  const [ cartcount, setCartcount ] = React.useState(false)
  const [ deleteIcon, setDeleteIcon ] = React.useState(false)
  const [ removeIcon, setRemoveIcon ] = React.useState(false)
  const [ count, setCount ] = React.useState(0)


  useEffect(()=>{
    async function getPreviousQty(){
      try{
        const res = await fetch('/api/user/previous-qty',{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ user : currentUser._id, store: params.storeId, product : props.id })
        })

        const data = await res.json()

        if(data.success === false){
          console.log(data.message)
          return
        }

        setCount(data.qty)

      }
      catch(err){
        console.log(err)
      }
    }
    getPreviousQty()

  }, [])


  async function updateCart(type){
    try{
      const res = await fetch('/api/user/update-cart',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ user : currentUser._id, store: params.storeId, products: { product : props.id, quantityInCart : 1 }, type})
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

  async function removeProduct(){
    try{
      setCount(0)
      setDeleteIcon(false)
      setRemoveIcon(true)
      setCartcount(false)
      setAddtocart(true)

      const res = await fetch('/api/user/delete-cart-product',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ user : currentUser._id, store: params.storeId, product: props.id})
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
    if(count > 1){
      setAddtocart(false)
      setCartcount(true)
      setRemoveIcon(true)
      setDeleteIcon(false)
    }
    else if(count === 1){
      setAddtocart(false)
      setCartcount(true)
      setRemoveIcon(false)
      setDeleteIcon(true)
    }
    else{
      setAddtocart(true)
      setCartcount(false)
    }
  }, [count])

  function handleQuantity(str){
    if(str === 'add'){
      setCount(count + 1)
      updateCart(str)
    }
    else if(str === 'remove'){
      setCount(count - 1)
      updateCart(str)
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
            {addtocart && (
              <span className='item-add-container' onClick={()=>handleQuantity('add')}>
                <span className="material-symbols-outlined item-add">add_circle</span>&nbsp;Add&nbsp;to&nbsp;cart
              </span>
            )}
            {cartcount && (
              <span className='cart-count-container'>
                <span className="material-symbols-outlined item-add" onClick={()=>handleQuantity('add')}>add_circle</span>
                {count}
                {removeIcon && <span className="material-symbols-outlined item-add" onClick={()=>handleQuantity('remove')}>do_not_disturb_on</span>}
                {deleteIcon && <span className="material-symbols-outlined item-add" onClick={()=>removeProduct()}>delete</span>}
              </span>
            )}
          </div>
          <div className='item-info'>
              <div className='item-price'>₹ {props.price}</div>
              <div className='item-name'>{props.name}</div>
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
import { createContext, useState, useContext } from "react";
import { CartContext } from '../context/CartContext'

export const ItemQtyContext = createContext();

const ItemQtyState = (props) => {

    const { getActiveCart } = useContext(CartContext)
  
    async function getPreviousQty(user, store, product){
      try{
        const res = await fetch('https://fresh-co-backend.vercel.app/api/user/previous-qty',{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ user, store, product })
        })

        const data = await res.json()

        if(data.success === false){
          console.log(data.message)
          return null
        }

        return data.qty

      }
      catch(err){
        console.log(err)
        return null
      }
    }


    async function updateCart(user, store, products, type){
      try{
        const res = await fetch('https://fresh-co-backend.vercel.app/api/user/update-cart',{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ user, store, products, type})
        })
  
        const data = await res.json()
  
        if(data.success === false){
          console.log(data.message)
          return
        }

        getActiveCart(user, store)
  
      }
      catch(err){
        console.log(err)
      }
    }

    async function removeProduct(user, store, product){
      try{

        const res = await fetch('https://fresh-co-backend.vercel.app/api/user/delete-cart-product',{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ user, store, product })
        })
  
        const data = await res.json()
  
        if(data.success === false){
          console.log(data.message)
          return
        }

        getActiveCart(user, store)
      }
      catch(err){
        console.log(err)
      }
    }



  return (
    <ItemQtyContext.Provider value={{ getPreviousQty, updateCart, removeProduct }}>
      {props.children}
    </ItemQtyContext.Provider>
  );
};

export default ItemQtyState;

import { createContext } from "react";
import { useState } from "react";

export const CartContext = createContext();


const ActiveCartState = (props) =>{

  const [ activeCart, setActiveCart ] = useState(null)

  async function getActiveCart(user, store){
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/get-active-cart',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ user, store})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }

      setActiveCart(data.activeCart)

    }
    catch(err){
      console.log(err)
      return
    }
  }

  const remove = ()=>{
    setActiveCart(null)
  }

  return (
    <CartContext.Provider value={{activeCart, getActiveCart, remove}}>
      {props.children}
    </CartContext.Provider>
  )

}

export default ActiveCartState;

import React, { useEffect } from 'react'
import Product from '../components/Product'
import { useParams } from 'react-router-dom'



export default function StoreProducts() {

  const params = useParams();
  const [ products, setproducts ] = React.useState([])
  const [ store, setStore ] = React.useState(null)


  async function getStoreProducts(){
    try{
      const res = await fetch('/api/shop/store-products',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({storeId : params.storeId})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }

      setproducts(data.products)
      setStore(data.storeName)
  
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getStoreProducts()
  }, [])

  const productsOfStore = products.map((product)=>{
    return(
      <Product 
        key={product._id}
        id={product._id}
        price={product.price} 
        name={product.name} 
        image={product.image} 
        quantity={product.quantity}
      />
    )
  })


  return (
    <div>
      <h2>{store}</h2>  

      <div className='products-container'>
        {productsOfStore}
      </div>
    </div>
  )
}

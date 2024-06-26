import React, { useEffect } from 'react'
import Store from '../components/Store'
import Categories from '../components/Categories'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function Shop() {
  const params = useParams()
  const currentUser = useSelector((state)=>state.user.user)

  const [ stores , setStores ] = React.useState([])
  const [ category, setCatagory ] = React.useState(null)

  async function getNearStores(){
    console.log(params.category)
    try{
      const res = await fetch('/api/shop/near-store', {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({zipCode : currentUser.zipcode, filter: params.category})
      })

      const data = await res.json()
      console.log(data)

      if(data.success === false){
        console.log(data.message)
        return
      }

      setStores(data.storeData)

    }
    catch(err){
      console.log(err)
    }
  }

  

  useEffect(()=>{
    getNearStores()
  }, [params.category])

  const nearStoreData = stores.map((store)=>{
    return (
      <Store
        key = {store._id}
        id = {store._id}
        name = {store.businessName}
        area = {store.area}
        logo = {store.logo}
        categories = {store.categories}
      />
    )
  })


  return (
    <div>

      <div className='store-heading'>
        <h2>{params.category} near you</h2>
      </div>

      <Categories />

      <div className='stores-container'>
        {nearStoreData}
      </div>
        
    </div>
  )
}

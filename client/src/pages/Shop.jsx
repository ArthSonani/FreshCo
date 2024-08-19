import React, { useEffect } from 'react'
import Store from '../components/Store'
import Categories from '../components/Categories'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import resultNotFound from '../assets/search.svg'

export default function Shop() {
  const params = useParams()
  const urlParams = new URLSearchParams(window.location.search)
  const currentUser = useSelector((state)=>state.user.user)

  const [ stores , setStores ] = React.useState([])

  async function getNearStores(){
    try{
      const res = await fetch('/api/shop/near-store', {
        method : 'POST',
        headers : { 
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({zipCode : currentUser.zipcode, filter: params.category, search: urlParams.get('search')})
      })
      
      const data = await res.json()

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
  }, [params.category, urlParams.get('search'), currentUser.zipcode])

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
        <h2>{params.category.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())} in {currentUser.area}</h2>
      </div>

      <Categories />

      {urlParams.get('search')? <h5 className='search-result'>Search result for '{urlParams.get('search')}'</h5> : null}

      <div className='stores-container'>
        {nearStoreData.length == 0? 
        <div className='result-not-found'>
          <img src={resultNotFound} />
          <span>Stores not found</span>
        </div> : nearStoreData}
      </div>
        
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Store from '../components/Store'
import Categories from '../components/Categories'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import resultNotFound from '../assets/search.svg'
import Loading from '../components/Loading'

export default function Shop() {
  const params = useParams()
  const urlParams = new URLSearchParams(window.location.search)
  const currentUser = useSelector((state)=>state.user.user)

  const [ stores , setStores ] = React.useState([])


  // const [assetsLoaded, setAssetsLoaded] = useState(false);

  // // Function to check if fonts are loaded
  // const checkFontsLoaded = () => {
  //   return document.fonts.ready;
  // };

  // // Function to check if all images are loaded
  // const checkImagesLoaded = () => {
  //   return new Promise((resolve) => {
  //     const images = document.images;
  //     let loadedCount = 0;
  //     const totalCount = images.length;

  //     const checkCompletion = () => {
  //       if (loadedCount === totalCount) {
  //         resolve();
  //       }
  //     };

  //     for (let img of images) {
  //       if (img.complete) {
  //         loadedCount++;
  //         checkCompletion();
  //       } else {
  //         img.onload = () => {
  //           loadedCount++;
  //           checkCompletion();
  //         };
  //         img.onerror = () => {
  //           loadedCount++;
  //           checkCompletion();
  //         };
  //       }
  //     }

  //     if (totalCount === 0) {
  //       resolve();
  //     }
  //   });
  // };

  async function getNearStores(){
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/shop/near-store', {
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

  // useEffect(() => {
  //   const loadAssets = async () => {
  //     await Promise.all([getNearStores(), checkFontsLoaded(), checkImagesLoaded()]);
  //     setAssetsLoaded(true);
  //   };

  //   loadAssets();
  // }, []);

  const nearStoreData = stores? stores.map((store)=>{
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
  }) : null 


  return (
    <div>
      {!nearStoreData? <Loading /> : 

      <>
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
      </>
      }
    </div>
  )
}

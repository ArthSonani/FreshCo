import React, { useEffect, useContext, useState } from 'react'
import Item from '../components/Item';
import { useParams } from 'react-router-dom'
import { categoriesData } from '../categoriesData.js'
import product404 from '../assets/product404.svg'
import { CartContext } from '../context/CartContext.jsx';
import Loading from '../components/Loading.jsx'

export default function StoreProducts() {

  const params = useParams();
  const { activeCart } = useContext(CartContext)
  const urlParams = new URLSearchParams(window.location.search)
  const [ products, setproducts ] = useState([])
  const [ store, setStore ] = useState(null)
  const [ category, setCategory ] = useState('shop-all') 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  async function getStoreData(){
    try{
      const res = await fetch('https://freshco-0dlm.onrender.com/api/shop/store-products',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({storeId : params.storeId, filter: category, search: urlParams.get('search')})
      })

      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        return
      }

      setproducts(data.products)
      setStore(data.store)
  
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getStoreData()
  }, [params.storeId, category, urlParams.get('search'), activeCart])

  const productsOfStore = products? products.map((product)=>{
    return(
      <Item 
        key={product._id}   
        store={params.storeId}
        id={product._id}
        price={product.price}
        name={product.name}
        image={product.image}
        description={product.description}
        quantity={product.quantity}
        mainCat={product.mainCategory}
        inStock={product.inStock}
        subCat={product.subCategory}
      />
    )
  }) : null

  function selectCategory(id){
    setCategory(id)
    const allCat = document.querySelectorAll('.store-category')
    allCat.forEach((c)=>{
      c.classList.remove('store-category-selected')
    })
    const item = document.getElementById(id)
    item.classList.add('store-category-selected')

    const x = id.split('-');
    if (x[x.length - 1] === 'main'){
      const show = document.getElementById(id.replace(/-main/, '-sub'))
      show.style.display === 'block' ? show.style.display = 'none' : show.style.display = 'block'
    }
  }
  console.log(store? store.categories: null)

  return (
  <>
    {windowWidth < 500? 
    <div className='phone-store-category'>
        <div className='store-product-cat' id='all-stores' onClick={()=>{setCategory('shop-all')}}>
            <span className="store-icons material-symbols-outlined">storefront</span>
        </div>

        {store? store.categories.includes('groceries-and-food-items')? 
        <div className='store-product-cat' id='groceries-and-food-items' onClick={()=>{setCategory('groceries-and-food-items-main')}}>
            <span className="store-icons material-symbols-outlined">grocery</span>
        </div>
        : null:null}


        {store? store.categories.includes('stationery')? 
        <div className='store-product-cat' id='stationery' onClick={()=>{setCategory('stationery-main')}}>
            <span className="store-icons material-symbols-outlined">book_5</span>
        </div>
        : null:null}

        {store? store.categories.includes('sports-and-games')? 
        <div className='store-product-cat' id='sports-and-games' onClick={()=>{setCategory('sports-and-games-main')}}>
            <span className="store-icons material-symbols-outlined">toys_and_games</span>
        </div>
        : null:null}

        {store? store.categories.includes('pharmacy')? 
        <div className='store-product-cat' id='pharmacy' onClick={()=>{setCategory('pharmacy-main')}}>
            <svg width="25" height="25" viewBox="0 0 24 24" fill="#242529" xmlns="http://www.w3.org/2000/svg" size="20" aria-hidden="true" color="systemGrayscale80" className="e-bauix2"><path d="M21 4.25c-1.1 0-2-.9-2-2V0H6v2.25c0 1.1-.9 2-2 2V8.5h1.5V24h14V8.5H21zM5.75 5.57c1.19-.63 2-1.88 2-3.32v-.5h9.5v.5c0 1.44.81 2.69 2 3.32v1.18H5.75zm1.5 6.68h5.41c.09 0 .15.04.2.11s.06.15.03.23l-2.06 5.75a.26.26 0 0 1-.24.17H7.25zm10.5 10H7.25v-2h3.34c.84 0 1.6-.53 1.88-1.32l2.06-5.75c.47-1.3-.5-2.68-1.88-2.68H7.24v-2h10.5v13.75z"></path></svg>
        </div>
        : null:null}

        {store? store.categories.includes('personal-care-and-beauty')? 
        <div className='store-product-cat' id='personal-care-and-beauty' onClick={()=>{setCategory('personal-care-and-beauty-main')}}>
            <svg width="25" height="25" viewBox="0 0 24 24" fill="#242529" xmlns="http://www.w3.org/2000/svg" size="30" aria-hidden="true" color="systemGrayscale80" className="e-bauix2"><path d="M23.93 19.202s-.02-.08-.02-.12c-.51-2.529-3.2-5.508-7.26-6.197L14.9 8.007h-.97v-1.79c0-1.15-.93-2.079-2.07-2.079h-.72c-.61 0-1.11-.51-1.11-1.12V1.76h4.38c.62 0 1.12.5 1.12 1.12v1h1.75v-1A2.88 2.88 0 0 0 14.4 0H6.39v1.75h1.88v1.259c0 .62-.5 1.11-1.11 1.12h-.57c-1.14 0-2.07.929-2.07 2.078v1.79H3.39L.38 16.413c-.48 1.36-.54 2.869.02 4.198C1.79 23.91 5.62 24 6.95 24h13.18c2.14 0 3.87-1.74 3.87-3.898v-.17c0-.23-.03-.48-.07-.73M6.27 6.217c0-.18.14-.33.32-.33h5.26c.18 0 .32.15.32.33v1.79h-5.9zm.68 16.034c-2.66 0-4.28-.76-4.94-2.32-.35-.859-.35-1.899.02-2.928l2.59-7.247h9.04l1.79 4.978c-.24.75-.93 1.3-1.76 1.3h-.81c-2.14 0-3.87 1.739-3.87 3.898v.17c0 .79.24 1.529.64 2.149zm15.3-2.15c0 1.18-.95 2.15-2.12 2.15h-7.25c-1.17 0-2.12-.96-2.12-2.15v-.17c0-1.179.95-2.148 2.12-2.148h.91a3.63 3.63 0 0 0 3.45-2.97c2.9.83 4.64 3.08 4.96 4.659v.04c.04.18.06.32.06.43v.17z"></path></svg>
        </div>
        : null:null}

        {store? store.categories.includes('clothing-and-accessories')? 
        <div className='store-product-cat' id='clothing-and-accessories' onClick={()=>{setCategory('clothing-and-accessories-main')}}>
            <span className="store-icons material-symbols-outlined">apparel</span>
        </div>
        : null:null}

        {store? store.categories.includes('household-essentials')? 
        <div className='store-product-cat' id='household-essentials' onClick={()=>{setCategory('household-essentials-main')}}>
            <span className="store-icons material-symbols-outlined">mop</span>
        </div>
        : null:null}

        {store? store.categories.includes('electronics-and-gadgets')? 
        <div className='store-product-cat' id='electronics-and-gadgets' onClick={()=>{setCategory('electronics-and-gadgets-main')}}>
            <span className="store-icons material-symbols-outlined">devices</span>
        </div>
        : null:null}

        {store? store.categories.includes('pet-supplies')? 
        <div className='store-product-cat' id='pet-supplies' onClick={()=>{setCategory('pet-supplies-main')}}>
            <span className="store-icons material-symbols-outlined">pet_supplies</span>
        </div>
        : null:null}


    </div> : null}
    

    <div className='store-products'>
      {!productsOfStore || !store? <Loading /> :
      <>
      <div className='store-products-left'>
        <div className='store-left-intro'>
          <div className='store-front-logo'>
            <img src={store.logo}/>
          </div>
          <div className='store-front-name'>
            <h5>{store.businessName}</h5>
            <p>
            {store.categories[0]?<span>{store.categories[0]}</span> : null}
            {store.categories[1]?<span>{store.categories[1]}</span> : null}
            {store.categories[2]?<span>{store.categories[2]}</span> : null}
            &&nbsp;More...
            </p>
          </div>
        </div>
        <div className='store-categories-container'>
          <div className='store-category shop-all store-category-selected' id='shop-all' onClick={()=>selectCategory('shop-all')} ><span className="material-symbols-outlined">local_mall</span> Shop all</div>
          {store.categories.map((category)=>{
            return (
              <React.Fragment key={category}>
                <div key={`${category}-main`} id={`${category}-main`} className='store-category store-main-category' onClick={()=>selectCategory(`${category}-main`)}>{category.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())}</div>
                <div key={`${category}-sub`} id={`${category}-sub`} className='store-sub-category'>{categoriesData.map((cat)=>{
                  if(cat.main === category){
                    return (cat.sub.map((sub)=>{
                      return( <div key={sub} id={sub} className='store-category' onClick={()=>selectCategory(sub)}>{sub.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())}</div>)
                    }))
                  }
                })}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div> 

      
      <div className='store-products-right'>
        <div className='store-category-head'>
        <h3>{category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ').replace(/main/, '')}</h3> 
        {urlParams.get('search')? <h5>Search result for '{urlParams.get('search')}'</h5> : null}
        </div>
        <div className='products-container'>
          {productsOfStore.length === 0? 
            <div className='product-not-found'>
              <img src={product404} />
              <div>Prducts not found</div>
            </div> : 
          productsOfStore}
        </div>
      </div>
      </> }
    </div>
  </>
  )
}

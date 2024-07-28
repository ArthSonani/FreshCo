import React, { useEffect } from 'react'
import Item from '../components/Item';
import { useParams } from 'react-router-dom'
import { categoriesData } from '../categoriesData.js'
import productNotFound from '../assets/not-found.png'

export default function StoreProducts() {

  const params = useParams();
  const [ products, setproducts ] = React.useState([])
  const [ store, setStore ] = React.useState(null)
  const [ category, setCategory ] = React.useState('shop-all')

  async function getStoreData(){
    try{
      const res = await fetch('/api/shop/store-products',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({storeId : params.storeId, filter: category})
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
  }, [params.storeId, category])

  const productsOfStore = products.map((product)=>{
    return(
      <Item 
        key={product._id}
        id={product._id}
        price={product.price}
        name={product.name}
        image={product.image}
        description={product.description}
        mainCat={product.mainCategory}
        subCat={product.subCategory}
      />
    )
  })

  if (!store) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className='store-products'>
      <div className='store-products-left'>
        <div className='store-left-intro'>
          <div className='store-front-logo'>
            <img src={store.logo}/>
          </div>
          <div className='store-front-name'>
            <h5>{store.businessName}</h5>
            <p><span className="store-loc-icon material-symbols-outlined">location_on</span>{store.area}</p>
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
          {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
        </div>
        <div className='products-container'>
          {productsOfStore.length === 0? 
            <div className='product-not-found'>
              <img src={productNotFound} />
              <div>Prduct not found</div>
            </div> : 
          productsOfStore}
        </div>
      </div>
    </div>
  )
}

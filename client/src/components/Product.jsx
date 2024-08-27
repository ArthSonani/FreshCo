import React from 'react'

export default function Product(props) {
 
  const [ formData, setFromData ] = React.useState({
    price: props.other.price, inStock: props.other.inStock, productId : props.id
  })

  function updateFromData(event){
    const { name, value } = event.target

    setFromData((preData)=>{
      return{
        ...preData,
        [name] : value
      }
    })

  }

  async function updateProduct(){
    try{
        const res = await fetch('https://fresh-co-backend.vercel.app/api/inventory/update', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        
        if(data.success === false){
            console.log(data.message)
        }

        const productElement = document.getElementById(props.id);
        const productPrice = productElement.querySelector('.product-price');
        const updateProduct = productElement.querySelector('.update-product');
        const itemDone = productElement.querySelector('.product-done')
        const itemEdit = productElement.querySelector('.product-edit')
        const itemDelete = productElement.querySelector('.product-delete')
        const productSubInfo = productElement.querySelector('.product-subinfo')
                
        itemEdit.style.display = 'grid'
        itemDelete.style.display = 'none'
        itemDone.style.display = 'none'
            
        productSubInfo.style.display = 'flex';
        productPrice.style.display = 'block';
        updateProduct.style.display = 'none';
    }
    catch(err){
        console.log(err)
    }
  }

  async function removeProduct(){
    try{
      const res = await fetch('https://fresh-co-backend.vercel.app/api/inventory/remove', {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({productId: props.id, storeId: props.store})
      })

      const data = await res.json()
      
      if(data.success === false){
          console.log(data.message)
      }
      props.reload()
    }
    catch(err){
        console.log(err)
    }
  }

  const inStockColor = formData.inStock <= 10? 'red' : 'green';

  return (
    <div className='product' id={props.id}>
        <div className='product-image'>
          <img src={props.other.image} /> 
          <span className="material-symbols-outlined product-done" onClick={updateProduct} >check_circle</span>
          <span className="product-edit material-symbols-outlined" onClick={()=>props.onEdit(props.id)}>Edit</span>
          <span className="product-delete material-symbols-outlined" onClick={removeProduct}>delete</span>
        </div>
        <div className='product-info'>
            <div className='product-price'>₹ {formData.price}</div>
            <div className='product-name'><p>{props.other.name}</p></div>
            <div className='product-subinfo'>
              <span>[ {props.id} ]</span> 
              <span>{props.other.quantity}</span> 
              <p style={{color : inStockColor}}>Stock : {formData.inStock}</p>
            </div>

            <div className='update-product'>
              <p>Price</p>
              <input type='number' onChange={updateFromData} name='price' className='product-price-feild number-input' value={formData.price} />
              
              <p>Quantity</p>
              <div className='product-add-remove'>
                  <span className="material-symbols-outlined product-remove">remove</span>
                  <input type='number' onChange={updateFromData} name='inStock' className='product-quantity-feild number-input' value={formData.inStock} />
                  <span className="material-symbols-outlined product-add">add</span>
              </div>
            </div>
        </div>
    </div>

  )
}




// allow read;
// allow write : if
// request.resource.size < 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')


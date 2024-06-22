import React from 'react'

export default function Product(props) {
 
  const [ formData, setFromData ] = React.useState({
    price:props.price, quantity: props.quantity, productId : props.id
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
        const res = await fetch('/api/inventory/update', {
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
        const itemDone = productElement.querySelector('.item-done')
        const itemEdit = productElement.querySelector('.hide-edit')
        const itemDelete = productElement.querySelector('.hide-delete')
                
        itemEdit.classList.add('item-edit')
        itemEdit.classList.remove('hide-edit')


        itemDelete.classList.add('item-delete')
        itemDelete.classList.remove('hide-delete')
            
        productPrice.style.display = 'block';
        updateProduct.style.display = 'none';
        itemDone.style.display = 'none'
        
    }
    catch(err){
        console.log(err)
    }
  }

  async function removeProduct(){
    try{
      const res = await fetch('/api/inventory/remove', {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({productId: props.id})
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

  return (
    <div className='product' id={props.id}>
        <div className='product-image'>
          <img src={props.image} /> 
          <span className="material-symbols-outlined item-done" onClick={updateProduct} >check_circle</span>
          <span className="item-edit material-symbols-outlined" onClick={()=>props.onEdit(props.id)}>Edit</span>
          <span className="item-delete material-symbols-outlined" onClick={removeProduct}>delete</span>
        </div>
        <div className='product-info'>
            <div className='product-price'>₹ {formData.price}</div>
            <div className='update-product'>
              <p>Quantity</p>
              <div className='item-add-remove'>
                  <span className="material-symbols-outlined item-remove">remove</span>
                  <input type='number' onChange={updateFromData} name='quantity' className='item-quantity-feild' value={formData.quantity} />
                  <span className="material-symbols-outlined item-add">add</span>
              </div>
              <p>Price</p>
              <input type='number' onChange={updateFromData} name='price' className='item-price-feild' value={formData.price} />
            </div>
            <div className='product-name'>{props.name}</div>

            {/* <div className='product-quantity'>{formData.quantity}</div> */}
        </div>
    </div>

  )
}




// allow read;
// allow write : if
// request.resource.size < 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')


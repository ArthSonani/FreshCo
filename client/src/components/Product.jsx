import React from 'react'

export default function Product(props) {
 
  const [ formData, setFromData ] = React.useState({
    price:props.price, quantity: props.quantity
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


  return (
    <div className='product' id={props.id}>
        <div className='product-image'>
          <img src={props.image} /> 
          <span className="material-symbols-outlined item-done">check_circle</span>
          <span className="item-edit material-symbols-outlined" onClick={()=>props.onEdit(props.id)}>edit</span>
          {/* <span className="item-delete material-symbols-outlined">delete</span> */}
        </div>
        <div className='product-info'>
            <div className='product-price'>₹ {props.price}</div>
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
        </div>
    </div>

  )
}




// allow read;
// allow write : if
// request.resource.size < 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')


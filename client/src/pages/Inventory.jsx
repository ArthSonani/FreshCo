import React ,{ useEffect, useRef } from 'react'
import Product from '../components/Product'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

export default function Inventory() {

    const currentVendor = useSelector((state)=>state.vendor.vendor)
    const navigate = useNavigate()

    // close button for add new product templete
    function closeAddProduct(){
        const addNew = document.querySelector('.add-new')
        addNew.style.display = 'none'
    }

    function editProduct(productId){
            const productElement = document.getElementById(productId);
            const productPrice = productElement.querySelector('.product-price');
            const updateProduct = productElement.querySelector('.update-product');
            const itemDone = productElement.querySelector('.item-done')
            const itemEdit = productElement.querySelector('.item-edit')
            const itemDelete = productElement.querySelector('.item-delete')
            
            itemEdit.classList.add('hide-edit')
            itemEdit.classList.remove('item-edit')

            itemDelete.classList.add('hide-delete')
            itemDelete.classList.remove('item-delete')
        
            productPrice.style.display = 'none';
            updateProduct.style.display = 'flex';
            itemDone.style.display = 'grid'
          
            // const saveButton = document.querySelector('.save-button-container');
            // saveButton.style.display = 'flex';
    }

    //save button on change
    function saveChange(){
        const resize = document.querySelectorAll('.product')
        const removeThing = document.querySelectorAll('.update-product')
        const addThing = document.querySelectorAll('.product-price')

        resize.forEach((item)=>{
            item.style.height = '250px'
            item.style.width = '200px'
        })
        removeThing.forEach((item)=>{
            item.style.display = 'none'
        })
        addThing.forEach((item)=>{
            item.style.display = 'block'
        })

        const deleteIcon = document.querySelectorAll('.item-delete')
        deleteIcon.forEach((item)=>{
            item.style.display = 'none'
        })

        const saveButton = document.querySelector('.save-button-container')
        saveButton.style.display = 'none'
    }

    // image functionality for product image
    const fileRef = useRef(null)

    // Main functionality
    const [ formData, setFormData ] = React.useState(
        { name: "", price: "", quantity: "", description: "", image: "", category: "", vendorId: currentVendor._id }
    )

    const [ image, setImage ] = React.useState(null)
    const [ products, setProducts ] = React.useState([])
    const [loading, setLoading ] = React.useState(false)

    function updateData(event){
        const { name, value } = event.target

        setFormData((preData)=>{
            return{
                ...preData,
                [name] : value
            }
        })
    }

    async function submitData(event){
        event.preventDefault()
        setLoading(true)
        const storage = getStorage(app)
        const imageName = new Date().getTime() + image.name
        const storageRef = ref(storage, imageName)
        const uploadTask = uploadBytesResumable(storageRef, image)

        try{
            const downloadURL = await new Promise((resolve, reject)=>{
                uploadTask.on(
                    "state_changed",
                    (snapshot)=>{
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`upload is ${progress}% done`)
                    },
                    (error)=>{
                        console.log(error)
                    },
                    ()=>{
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                            resolve(downloadURL)
                        }).catch(reject);
                    }
                )
            })
                
            const updatedFormData = {...formData, image : downloadURL}
       
            const res = await fetch('/api/inventory/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFormData)
            });

            const data = await res.json()

            if(data.success === false){
                console.log(data.message)
                return 
            }
            setLoading(false)
            closeAddProduct()
            getInventoryData()
            navigate('/inventory')
        }
        catch(err){
            console.log(err)
        }
    }

    async function getInventoryData(){
        try{
            const res = await fetch('/api/inventory/data',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({'vendorId': currentVendor._id})
            })

            const data = await res.json()

            if(data.success === false){
                console.log(data.message)
            }
            setProducts(data.vendorProducts)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getInventoryData()
    }, [currentVendor._id])
    

    const productCards = products.map((product)=>{
        return (
            <Product 
                key={product._id}
                id={product._id}
                price={product.price} 
                name={product.name} 
                image={product.image} 
                quantity={product.quantity}
                onEdit={editProduct}
                reload={getInventoryData}
            />
        )
    })


  return (
    <main>
        <div className='inventory-head'>
            <h1>{currentVendor.businessName}'s Inventory</h1>
        </div>
        <div className='inventory-container'>
            {productCards}
        </div>

        <div className='add-new'>
            <div className='add-product-container'>
                <span className="material-symbols-outlined close" onClick={closeAddProduct}>close</span>
                <div className='add-upper'>
                    <div className='add-photo'>
                        <div className='photo-button' onClick={ ()=>fileRef.current.click() }>Upload a Product Image</div>
                        <input id='image' name='image' type="file" ref={fileRef} accept='image/*' hidden onChange={ (e)=>setImage(e.target.files[0]) } />
                        <div className='photo-name'>Product Image</div>
                    </div>
                    <div className='add-info'>
                        <label>Name</label>
                        <input type='text' name='name' value={formData.name} onChange={updateData} />
                        <label>Price</label>
                        <input type='number' name='price' value={formData.price} onChange={updateData} />
                        <label>Quantity</label>
                        <input type='number' name='quantity' value={formData.quantity} onChange={updateData} />
                        <label>Category</label>
                        <input type='text' name='category' value={formData.category} onChange={updateData} />
                    </div>
                </div>
                <div className='add-lower'>
                    <label>Description</label>
                    <textarea name='description' value={formData.description} onChange={updateData} />
                </div>
                <div className='add-new-button-container'>
                    {loading? 
                    <button disabled><span className="spinner-border spinner-border-sm" aria-hidden="true" style={{marginRight: '5px'}}> </span> Loading...</button>:
                    <button onClick={submitData}>Add New Product</button>
                    }
                </div>
            </div>
        </div>

        <div className='save-button-container'>
            <button className='save-button' onClick={saveChange}>Save Changes</button>
        </div>
    </main>
  )
}

    
import React ,{ useEffect, useRef } from 'react'
import Product from '../components/Product'
import { useSelector } from 'react-redux'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { categoriesData } from '../categoriesData.js'
import emptyInventory from '../assets/emptyInventory.svg'
import loadingImg from '../assets/loading.svg'
import inventory from '../assets/inventory.svg'
import { useLocation } from 'react-router-dom'

export default function Inventory() {

    const currentVendor = useSelector((state)=>state.vendor.vendor)
    const location = useLocation(); // Hook to get location object
    

    // Extract search query from location
    const searchQuery = new URLSearchParams(location.search).get('search');
    

    // close button for add new product templete
    function closeAddProduct(){
        const addNew = document.querySelector('.add-new')
        addNew.style.display = 'none'
    }

    function editProduct(productId){
        const productElement = document.getElementById(productId);
        const productPrice = productElement.querySelector('.product-price');
        const updateProduct = productElement.querySelector('.update-product');
        const itemDone = productElement.querySelector('.product-done')
        const itemEdit = productElement.querySelector('.product-edit')
        const itemDelete = productElement.querySelector('.product-delete')
        const productSubInfo = productElement.querySelector('.product-subinfo')
        
        itemEdit.style.display = 'none'
        itemDelete.style.display = 'grid'
        itemDone.style.display = 'grid'
    
        productSubInfo.style.display = 'none';
        productPrice.style.display = 'none';
        updateProduct.style.display = 'flex';
    }


    // image functionality for product image
    const fileRef = useRef(null)

    // Main functionality
    const [ formData, setFormData ] = React.useState({ 
        name: "", 
        price: "", 
        quantity: "", 
        stock: "",
        description: "", 
        image: "", 
        mainCategory: "", 
        subCategory: "",
        storeId: currentVendor ? currentVendor._id : null
    })

    const [ image, setImage ] = React.useState(null)
    const [ products, setProducts ] = React.useState([])
    const [ loading, setLoading ] = React.useState(false)
    const [ error, setError ] = React.useState(null)

    function updateImage(image){
        setImage(image)
        document.querySelector(".photo-button").innerHTML = image.name;
    }

    function updateData(event){
        const {name, value, type, checked} = event.target;
        if(name === 'mainCategory'){
            setFormData((pre)=>{
                return{
                    ...pre,
                    subCategory: ""
                }
            })
        }

        setFormData((preData)=>{
          return {
            ...preData,
            [name] : type === "checkbox"? checked : value
          }
        })
    }

    async function submitData(event){
        event.preventDefault()
        setLoading(true)

        const validateFormData = () => {
            if (!image) return 'Must provide product image';
            if (!formData.name) return 'Must provide product name';
            if (!formData.price) return 'Must provide product price';
            if (!formData.quantity) return 'Must provide product quantity';
            if (!formData.stock) return 'Must provide product in stock quantity';
            if (!formData.description) return 'Must provide product description';
            if (!formData.mainCategory) return 'Must provide product main category';
            if (!formData.subCategory) return 'Must provide product sub category';
            return null;
        };
    
        const error = validateFormData();
        if (error) {
            setError(error);
            setLoading(false);
            return;
        }
        

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
       
            const res = await fetch('https://freshco-0dlm.onrender.com/api/inventory/add-product', {
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
            const addNew = document.querySelector('.add-new')
            addNew.style.display = 'none'
            setFormData({ 
                name: "", 
                price: "", 
                quantity: "", 
                stock: "",
                description: "", 
                image: "", 
                mainCategory: "", 
                subCategory: "",
                storeId: currentVendor ? currentVendor._id : null
            })
            setImage(null)
            getInventoryData()
        }
        catch(err){
            console.log(err)
        }
    }

    async function getInventoryData(){
        try{
            const res = await fetch('https://freshco-0dlm.onrender.com/api/inventory/data',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({storeId: currentVendor._id, search: searchQuery})
            })

            const data = await res.json()

            if(data.success === false){
                console.log(data.message)
            }
            setProducts(data.storeProducts)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        console.log('called')
        getInventoryData()
    }, [currentVendor, searchQuery])
    

    const productCards = products ? products.map((product)=>{
        return (
            <Product 
                key={product._id}
                id={product._id}
                store={currentVendor._id}
                other={product}
                onEdit={editProduct}
                reload={getInventoryData}
            />
        )
    }) : null


  return (
    productCards == null? <div className='loading'> <img src={loadingImg} /></div> :
    <main>
        <div className='inventory-head'>
            <h2>{currentVendor.businessName}'s Inventory</h2>
            <p>Curate with Care, Sell with Pride—Your Inventory is the Heartbeat of Our Marketplace.</p>
            <img src={inventory} />
        </div>

        {searchQuery? <h5 className='search-result'>Search result for '{searchQuery}'</h5> : null}

        <div className={productCards.length != 0 ?'inventory-container' : 'inventory-container-with-img'}>
            {productCards.length != 0 ? productCards : <><img src={emptyInventory} /> <span>Your inventory is empty</span></>}
        </div>

        <div className='add-new' >

            <div className='add-product-container'>
                <span className="material-symbols-outlined close" onClick={closeAddProduct}>close</span>
                <div className='add-product-upper'>
                <div className='add-new-left'>
                    <div className='add-upper'>
                        <div className='add-photo'>
                            <div className='photo-button' onClick={ ()=>fileRef.current.click() }>Upload a Product Image</div>
                            <input id='image' name='image' type="file" ref={fileRef} accept='image/*' hidden onChange={ (e)=>updateImage(e.target.files[0]) } />
                        </div>
                        <div className='add-info'>
                            <textarea name='description' placeholder='Description' value={formData.description} onChange={updateData} />
                        </div>
                    </div>

                    <div className='add-lower'>
                        <input type='text' className='add-input' placeholder='Name' name='name' value={formData.name} onChange={updateData} />
                        <input type='number' className='add-input number-input' placeholder='Price' name='price' value={formData.price} onChange={updateData} />
                        <input type='text' className='add-input' placeholder='Quntity' name='quantity' value={formData.quantity} onChange={updateData} />
                        <input type='number' className='add-input number-input' placeholder='Stock Quantity' name='stock' value={formData.stock} onChange={updateData} />
                    </div>
                </div>
                <div className='add-new-middle'></div>
                <div className='add-new-right'>
                    <div className='add-new-right-head'>Product Category</div>
                    <div className='add-new-right-bottom'>
                        <div className='new-main-cat'>
                            <h6 style={{color: 'black'}}>Main category</h6>
                            {categoriesData.filter(category => currentVendor.categories.includes(category.main)).map((category, index) => (
                                <div  key={index}>
                                <label>
                                    <input 
                                        type='radio'
                                        name='mainCategory'
                                        value={category.main}
                                        checked={formData.mainCategory === category.main}
                                        onChange={updateData}
                                    />
                                    &nbsp;&nbsp;
                                    {category.main.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())}
                                </label>
                                </div>
                            ))}
                        </div>
                        
                        <div className='new-sub-cat'>
                            <h6 style={{color: 'black'}}>Sub category</h6>
                            {formData.mainCategory === "" ? 
                                (<div className='message-div'><p>Select Main Category to visible</p></div>) : 
                                (categoriesData
                                    .filter(item => item.main === formData.mainCategory)
                                    .flatMap(item => item.sub)
                                    .map((cat, index) => (
                                        <div key={index}>
                                        <label>
                                            <input 
                                                type='radio'
                                                name='subCategory'
                                                value={cat}
                                                checked={formData.subCategory === cat}
                                                onChange={updateData}
                                            />
                                            &nbsp;&nbsp;
                                            {cat}
                                        </label>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
                </div>

                <p className='add-product-error'>{error? error : null}</p>

                <div className='add-product-lower'>
                    {loading? 
                    <button disabled><span className="spinner-border spinner-border-sm" aria-hidden="true" style={{marginRight: '5px'}}> </span> Loading...</button>:
                    <button onClick={submitData}>Add&nbsp;New&nbsp;Product</button>
                    }
                </div>
            </div>

        </div>
    </main>
  )
}

    

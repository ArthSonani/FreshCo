import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { userSignoutSuccess, userSignoutStart, userSignoutFailure } from '../redux/user/userSlice';
import { vendorSignoutStart, vendorSignoutSuccess, vendorSignoutFailure } from '../redux/vendor/vendorSlice';


export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const currentUser = useSelector((state)=>state.user.user)
    const currentVendor = useSelector((state)=>state.vendor.vendor)

    const handleUserSignOut = async()=>{
      try{
        dispatch(userSignoutStart())
        const res = await fetch('/api/user/auth/signout')
        const data = res.json()
        if(data.success === false){
          dispatch(userSignoutFailure(data.message))
          return
        }
        dispatch(userSignoutSuccess())
        navigate('/')
      }
      catch(err){
        dispatch(userSignoutFailure(err))
      }
    }

    const handleVendorSignOut = async()=>{
      try{
        dispatch(vendorSignoutStart())
        const res = await fetch('/api/vendor/auth/signout')
        const data = res.json()
        if(data.success === false){
          dispatch(vendorSignoutFailure(data.message))
          return
        }
        dispatch(vendorSignoutSuccess())
        navigate('/')
      }
      catch(err){
        dispatch(vendorSignoutFailure(err))
      }
    }

    function openAddProduct(){
      const addNew = document.querySelector('.add-new')
      addNew.style.display = 'grid'
    }

    function deleteProduct(){
      const deleteIcon = document.querySelectorAll('.item-delete')
      deleteIcon.forEach((item)=>{
        item.style.display = 'inline'
      })
      const saveButton = document.querySelector('.save-button-container')
      saveButton.style.display = 'flex'
    }

    function updateProduct(){
      const resize = document.querySelectorAll('.product')
      const removeThing = document.querySelectorAll('.product-price')
      const addThing = document.querySelectorAll('.update-product')

      resize.forEach((item)=>{
        item.style.height = '300px'
        item.style.width = '220px'
      })
      removeThing.forEach((item)=>{
        item.style.display = 'none'
      })
      addThing.forEach((item)=>{
        item.style.display = 'flex'
      })
      const saveButton = document.querySelector('.save-button-container')
      saveButton.style.display = 'flex'
    }

  return (
    <nav className='navbar'>

      <div className='nav-first'>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#343538" xmlns="http://www.w3.org/2000/svg" size="24" color="systemGrayscale70" aria-hidden="true" data-bs-toggle="offcanvas" aria-controls="offcanvasWithBothOptions" data-bs-target="#offcanvasWithBothOptions">
          <path d="M20 6H4v2h16zM4 11h16v2H4zM4 16h16v2H4z"></path>
        </svg>

        <div className="offcanvas offcanvas-start" style={{ width: "300px" }} data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title nav-logo-name" id="offcanvasWithBothOptionsLabel" onClick={ ()=>navigate('/') }>
              {currentUser? 
                <><span className="material-symbols-outlined">person</span> {currentUser.firstname} </> : 
              currentVendor? 
                <><span className="material-symbols-outlined">storefront</span> {currentVendor.businessName} </> : 
              "GrocerBlink"}
            </h5>
          </div>
          <hr style={{margin: '0', width: '90%'}}/>
          
          <div className="offcanvas-body">
            {currentUser?
              (<>
                <div>Store</div>
                <div>Cart</div>
                <div>Orders</div>
                <div>Shopes</div>
                <div>Manage Account</div>
                <div onClick={ handleUserSignOut }>Log out</div>
              </>) : 
              currentVendor?
              (<>
                <div onClick={navigate('/inventory')} >Inventory</div>
                <div onClick={ openAddProduct }>Add new product</div>
                <div onClick={ deleteProduct }>Delete products</div>
                <div onClick={ updateProduct }>Update inventory</div>
                <div>Manage Account</div>
                <div onClick={ handleVendorSignOut }>Log out</div>
              </>) :
              (<>
              <div className='' onClick={ ()=>navigate('/user/signin') }>Log in</div>
              <div className='' onClick={ ()=>navigate('/user/signup') }>Sign up</div>
              <div className='' onClick={ ()=>navigate('/vendor/signup') }>Become a Merchant</div>
              </>)}
          </div>
        </div>

        <h1 className='nav-logo-name' onClick={ ()=>navigate('/') }>
          <img src='/logo.png' style={{height: '30px'}}/>
          GrocerBlink</h1>
      </div>

      <div className='nav-search'>
        <form className='nav-form'>
          <span className="material-symbols-outlined">search</span>
          <input type='text' className='nav-form-input' placeholder='Search products and stores'></input>
        </form>
      </div>

      <div className='nav-last'>
        {currentUser? 
          <span className="material-symbols-outlined">shopping_cart</span> : 
          currentVendor? <span className="material-symbols-outlined">inventory</span> : 
          (
          <>
          <div className='nav-link' onClick={ ()=>navigate('/user/signin') }><span className="material-symbols-outlined">login</span>Log in</div>
          <div className='nav-link' onClick={ ()=>navigate('/user/signup') }><span className="material-symbols-outlined">person</span>Sign up</div>
          </>
        )}
        
      </div>

    </nav>
  )
}




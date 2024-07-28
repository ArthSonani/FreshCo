import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import { userSignoutSuccess, userSignoutStart, userSignoutFailure } from '../redux/user/userSlice';
import { vendorSignoutStart, vendorSignoutSuccess, vendorSignoutFailure } from '../redux/vendor/vendorSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user)
  const currentVendor = useSelector((state) => state.vendor.vendor)
  const isActive = (path) => !!matchPath({ path, end: true }, location.pathname);

  const handleUserSignOut = async () => {
    try {
      activeLink('user-signout')
      dispatch(userSignoutStart())
      const res = await fetch('/api/user/auth/signout')
      const data = res.json()
      if (data.success === false) {
        dispatch(userSignoutFailure(data.message))
        return
      }
      dispatch(userSignoutSuccess())
      navigate('/')
    }
    catch (err) {
      dispatch(userSignoutFailure(err))
    }
  }

  const handleVendorSignOut = async () => {
    try {
      activeLink('vendor-signout')
      dispatch(vendorSignoutStart())
      const res = await fetch('/api/vendor/auth/signout')
      const data = res.json()
      if (data.success === false) {
        dispatch(vendorSignoutFailure(data.message))
        return
      }
      dispatch(vendorSignoutSuccess())
      navigate('/')
    }
    catch (err) {
      dispatch(vendorSignoutFailure(err))
    }
  }

  // function openAddProduct() {
  //   activeLink('add-product')
  //   document.querySelector('.add-new').style.display = 'grid'
  // }

  function activeLink(id) {
    const links = document.querySelectorAll('.sidebar-options')
    links.forEach((i) => { i.classList.remove('selected-link') })
    const selectedLink = document.getElementById(id)
    selectedLink.classList.add('selected-link')
  }

  return (
    <div className="offcanvas offcanvas-start" style={{ width: "300px" }} data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div className="offcanvas-header">

        <h5 className="offcanvas-title sidebar-head-container" id="offcanvasWithBothOptionsLabel" onClick={() => navigate('/')}>
            {currentUser ?
            <span className='sidebar-heading'><span className="material-symbols-outlined">person</span> {currentUser.firstname} </span> :
            currentVendor ?
                <span className='sidebar-heading'><span className="material-symbols-outlined">storefront</span> {currentVendor.businessName} </span> :
                "GrocerBlink"}
        </h5>

        </div>

        <hr style={{ margin: '0', width: '90%' }} />

        <div className="offcanvas-body">
        {currentUser ?
            (<>
            <Link className='sidebar-links' to='/shop/all-stores'><div className={`sidebar-options ${isActive('/shop/:category') || isActive('/store/:storeId') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">storefront</span>Store</div></Link>
            <Link className='sidebar-links' to='/user/orders'><div className={`sidebar-options ${isActive('/user/orders') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">contract</span>Orders</div></Link>
            <Link className='sidebar-links' to='/user/account'><div className={`sidebar-options ${isActive('/user/account') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">manage_accounts</span>Manage Account</div></Link>
            <div id='user-signout' className='sidebar-options click-button' onClick={handleUserSignOut}><span className="material-symbols-outlined">logout</span>Log out</div>
            </>) :
            currentVendor ?
            (<>
            <Link className='sidebar-links' to='/inventory'><div className={`sidebar-options ${isActive('/inventory') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">inventory</span>Inventory</div></Link>
            {/* <div id='add-product' className='sidebar-options click-button' onClick={openAddProduct}><span className="material-symbols-outlined">note_stack_add</span>Add new product</div> */}
            <Link className='sidebar-links' to='/vendor/account'><div className={`sidebar-options ${isActive('/vendor/account') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">manage_accounts</span>Manage Account</div></Link>
            <div id='vendor-signout' className='sidebar-options click-button' onClick={handleVendorSignOut}><span className="material-symbols-outlined">logout</span>Log out</div>
            </>) :
            (<>
            <Link className='sidebar-links' to='/user/signin'> <div className={`sidebar-options ${isActive('/user/signin') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">login</span>Log in</div></Link>
            <Link className='sidebar-links' to='/user/signup'> <div className={`sidebar-options ${isActive('/user/signup') ? 'selected-link' : ''}`}><span className="material-symbols-outlined">person</span>Sign up</div></Link>
            <Link className='sidebar-links' to='/vendor/signup'> <div className={`sidebar-options ${isActive('/vendor/signup') || isActive('/vendor/signin')? 'selected-link' : ''}`}><span className="material-symbols-outlined">add_business</span>Become a Merchant</div></Link>
            </>)}
        </div>
    </div>
  )
}

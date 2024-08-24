import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import { userSignoutSuccess, userSignoutStart, userSignoutFailure } from '../redux/user/userSlice';
import { vendorSignoutStart, vendorSignoutSuccess, vendorSignoutFailure } from '../redux/vendor/vendorSlice';
import logo from '../assets/logo.png'
import peek from '../assets/peek.png'

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
      const res = await fetch('https://freshco-0dlm.onrender.com/api/user/auth/signout')
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
      const res = await fetch('https://freshco-0dlm.onrender.com/api/vendor/auth/signout')
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
    <div className="offcanvas offcanvas-start" style={{ width: "250px" }} data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div className="offcanvas-header">

        <h5 className="offcanvas-title sidebar-head-container" id="offcanvasWithBothOptionsLabel" onClick={() => navigate('/')}>
  
        {currentUser ?
          <div className='sidebar-logo-name'><span className="material-symbols-outlined">account_circle</span>&nbsp;&nbsp;{currentUser.firstname}&nbsp;{currentUser.lastname}</div>:
        currentVendor?  
          <div className='sidebar-username'><span className="material-symbols-outlined">storefront</span>&nbsp;&nbsp;{currentVendor.businessName}</div>:
          <div className='sidebar-logo-name click-button' onClick={() => navigate('/')}><img src={logo} style={{ height: '30px' }} /> &nbsp;&nbsp;FRESHCO</div>
        }
        
        </h5>

        </div>

        <hr style={{ margin: '0', width: '90%' }} />

        <div className="offcanvas-body sidebar-body">
          <img src={peek} />
        {currentUser ?
            (<>
            <Link className='sidebar-links' to='/shop/all-stores' ><div className={`sidebar-options ${isActive('/shop/:category') || isActive('/store/:storeId') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">storefront</span>Store</div></Link>
            <Link className='sidebar-links' to='/user/orders'><div className={`sidebar-options ${isActive('/user/orders') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">contract</span>Orders</div></Link>
            <Link className='sidebar-links' to='/user/account'><div className={`sidebar-options ${isActive('/user/account') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">manage_accounts</span>Manage Account</div></Link>

            


            <div className='sidebar-bottom'>
              <hr style={{margin: '5px'}}/>
              <div id='user-signout' className='sidebar-logout' onClick={handleUserSignOut} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">logout</span>&nbsp;&nbsp;Log out</div>
            </div>
            </>) :
            currentVendor ?
            (<>
            <Link className='sidebar-links' to='/inventory'><div className={`sidebar-options ${isActive('/inventory') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">inventory</span>Inventory</div></Link>
            <Link className='sidebar-links' to='/store/orders'><div className={`sidebar-options ${isActive('/store/orders') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">contract</span>Orders</div></Link>
            <Link className='sidebar-links' to='/vendor/account'><div className={`sidebar-options ${isActive('/vendor/account') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">manage_accounts</span>Manage Account</div></Link>
            <div className='sidebar-bottom'>
              <hr style={{margin: '5px', marginBottom: '15px'}}/>
              <div id='vendor-signout' className='sidebar-logout' onClick={handleVendorSignOut} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">logout</span>&nbsp;&nbsp;Log out</div>
            </div>
            </>) :
            (<>
            <Link className='sidebar-links' to='/user/signin'> <div className={`sidebar-options ${isActive('/user/signin') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">login</span>Log in</div></Link>
            <Link className='sidebar-links' to='/user/signup'> <div className={`sidebar-options ${isActive('/user/signup') ? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">person</span>Sign up</div></Link>
            <Link className='sidebar-links' to='/vendor/signup'> <div className={`sidebar-options ${isActive('/vendor/signup') || isActive('/vendor/signin')? 'selected-link' : ''}`} data-bs-dismiss="offcanvas"><span className="material-symbols-outlined">add_business</span>Become a Merchant</div></Link>
            </>)}
        </div>
    </div>
  )
}

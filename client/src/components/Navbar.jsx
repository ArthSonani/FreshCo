import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, matchPath, useParams, Link } from 'react-router-dom'
import { vendorSigninSuccess } from '../redux/vendor/vendorSlice'
import { updateUser } from '../redux/user/userSlice';
import Cart from './Cart';
import Sidebar from './Sidebar'
import logo from '../assets/logo.png'


export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUser = useSelector((state) => state.user.user)
  const currentVendor = useSelector((state) => state.vendor.vendor)
  const isActive = (path) => !!matchPath({ path, end: true }, location.pathname);

  const [zipData, setZipData] = useState({
    zip: currentUser ? currentUser.zipcode : "", area: currentUser ? currentUser.area : "", userId: currentUser ? currentUser._id : ""
  })
  const [ loading, setLoading ] = useState(false)

  const [search, setSearch] = useState("")
  const [ originalCounts, setOriginalCounts ] = useState(null)
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


  function updateData(event) {
    const { name, value } = event.target

    setZipData((preData) => {
      return {
        ...preData,
        [name]: value
      }
    })
  }

  useEffect(() => {
    setZipData({zip: currentUser ? currentUser.zipcode : "", area: currentUser ? currentUser.area : "", userId: currentUser ? currentUser._id : ""})
  }, [currentUser])


  async function checkForOrders(e) {
    e ? e.preventDefault() : null
    try {
      const res = await fetch('/api/shop/order-count', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({store : currentVendor ? currentVendor._id : null})

      })
      const data = await res.json()

      if (data.success === false) {
        console.log(data.message)
        return
      }
      
      setOriginalCounts(data.orderCount)
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (currentVendor) {
      checkForOrders(); 
    }
  }, []);
  
  async function updateOrderCount() {
    try {
      const res = await fetch('/api/shop/update-order-count', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({store : currentVendor._id})

      })
      const data = await res.json()

      if (data.success === false) {
        console.log(data.message)
        return
      }
      dispatch(vendorSigninSuccess(data.updatedStore))
      navigate('/store/orders')
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    checkForOrders()
  }, [currentVendor ? currentVendor.orderCount : null])

  async function setZip(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/user/auth/update-zip', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(zipData)

      })
      const data = await res.json()

      if (data.success === false) {
        console.log(data.message)
        return
      }
      dispatch(updateUser(data[0]))

      setLoading(false)
      const zipForm = document.querySelector('.nav-zip-form-container');
      const zipBackgroung = document.querySelector('.nav-zip-form-background');
      zipBackgroung.style.display = 'none';
      zipForm.style.display = 'none';
    }
    catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  function toggleZipMenu() {
    const zipLogo = document.querySelector('.nav-zip-form-container');
    const zipBackgroung = document.querySelector('.nav-zip-form-background');
    if (zipLogo.style.display === 'none' || zipLogo.style.display === '') {
      zipLogo.style.display = 'flex';
      zipBackgroung.style.display = 'block'
    } else {
      zipLogo.style.display = 'none';
      zipBackgroung.style.display = 'none'
    }
  }

  function hideZip(){
    const zipLogo = document.querySelector('.nav-zip-form-container');
    const zipBackgroung = document.querySelector('.nav-zip-form-background');
    zipLogo.style.display = 'none';
    zipBackgroung.style.display = 'none'
  }

  function handleSearch(e) {
    e ? e.preventDefault() : null
    const urlParams = new URLSearchParams(window.location.search)
    if (search === '') {
      urlParams.delete('search');
    } else {
      urlParams.set('search', search)
    }
    const searchQuery = urlParams.toString()
    navigate(`${location.pathname}?${searchQuery}`)
  }

  useEffect(() => {
    handleSearch()
  }, [search])

  function openAddProduct() {
    document.querySelector('.add-new').style.display = 'grid'
  }


  return (
    <nav className='navbar'>

      <div className='nav-first'>
        <span className="material-symbols-outlined click-button sidebar-open" data-bs-toggle="offcanvas" aria-controls="offcanvasWithBothOptions" data-bs-target="#offcanvasWithBothOptions">menu</span>
        <Sidebar />

        <div className='nav-logo-name click-button' onClick={() => navigate('/')}>
          <img src={logo}/> {windowWidth <= 500 && !isActive('/') ? null : 'FRESHCO'}
        </div>

      </div>

      {isActive('/shop/:category') || ( isActive('/store/:storeId') && !isActive('/store/orders') ) || isActive('/inventory')?
        (<div className='nav-search'  style={isActive('/store/:storeId') || isActive('inventory') ? { width: '45%' } : null}>
          <form className='nav-form' onSubmit={handleSearch}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input type='text' placeholder={isActive('/shop/:category') ? 'Search Stores' : isActive('/inventory') || isActive('/store/:storeId')? 'Search Products' : null} value={search} onChange={(e) => setSearch(e.target.value.trimStart())} />
          </form>
        </div>)

        : null}

      <div className='nav-last'>
        {currentUser ?
          (<>
            {isActive('/') || isActive('/shop/:category') ?
              <span className='nav-zip click-button'>
                <span className='nav-zip-logo nav-last-options' onClick={toggleZipMenu}>
                  <span className="material-symbols-outlined">home_pin</span>
                  {windowWidth <= 500 ? null :currentUser.zipcode}<span className="material-symbols-outlined">arrow_drop_down</span>
                </span>

                <div className='nav-zip-form-background' onClick={hideZip}></div>
                <div className='nav-zip-form-container'>
                  <form className='nav-zip-form'>
                    <input type='text' className='nav-form-area' value={zipData.area} name='area' onChange={updateData} />
                    <div className='zip-form-container'>
                      <input type='number' className='nav-zip-input number-input' name='zip' onChange={updateData} value={zipData.zip} />
                      {loading? 
                      <button className='nav-form-button' disabled><span className="spinner-border spinner-border-sm" aria-hidden="true"></span></button>:
                      <button className='nav-form-button' onClick={setZip}>set</button>
                      }
                     </div>
                  </form>
                </div>
              </span>

              : ''}

            <Cart />

          </>) :
          currentVendor ?
            (<>{isActive('/inventory') ?
              <>
                <div className='nav-options' onClick={openAddProduct}><span className="material-symbols-outlined">note_stack_add</span>&nbsp;{windowWidth < 500 ? null :'  Add product'}</div>  
                <div className='nav-options' onClick={updateOrderCount}>
                  { currentVendor.orderCount !== originalCounts ? <span className='new-notification'></span> : null}
                  <span className="material-symbols-outlined">contract</span>&nbsp;{windowWidth < 500 ? null :'  Orders'}
                </div>
              </> :
              <div className='nav-options' onClick={() => navigate('/inventory')}><span className="material-symbols-outlined">inventory</span>&nbsp;{windowWidth < 500 ? null :'  Inventory'}</div>}
            </>) :
            (<>
              <div className='nav-link click-button' onClick={() => navigate('/user/signin')}><span className="material-symbols-outlined">login</span>Log in</div>
              <div className='nav-link click-button' onClick={() => navigate('/user/signup')}><span className="material-symbols-outlined">person</span>Sign up</div>
            </>)}
      </div>
    </nav>)
}

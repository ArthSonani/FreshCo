import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, matchPath, useParams } from 'react-router-dom'
import { updateUser } from '../redux/user/userSlice';
import Cart from './Cart';
import Sidebar from './Sidebar'
import logo from '../assets/logo.png'


export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams()

  const currentUser = useSelector((state) => state.user.user)
  const currentVendor = useSelector((state) => state.vendor.vendor)
  const isActive = (path) => !!matchPath({ path, end: true }, location.pathname);

  const [zipData, setZipData] = React.useState({
    zip: currentUser ? currentUser.zipcode : "", area: currentUser ? currentUser.area : "", userId: currentUser ? currentUser._id : ""
  })

  const [ search, setSearch ] = React.useState("")

  function updateData(event) {
    const { name, value } = event.target

    setZipData((preData) => {
      return {
        ...preData,
        [name]: value
      }
    })
  }


  async function setZip(event) {
    event.preventDefault()
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
      window.location.reload()
    }
    catch (err) {
      console.log(err)
    }
  }

  function handleSearch(e){
    e? e.preventDefault() : null
    const urlParams = new URLSearchParams(window.location.search)
    if (search === '') {
      urlParams.delete('search');
    } else {
      urlParams.set('search', search)
    }
    const searchQuery = urlParams.toString()
    navigate(`/shop/all-stores?${searchQuery}`)
  }

  useEffect(()=>{
    if (location.pathname === '/shop/all-stores') {
      handleSearch();
    }
  }, [search, location.pathname])

  function openAddProduct() {
    document.querySelector('.add-new').style.display = 'grid'
  }

  return (
    <nav className='navbar'>

      <div className='nav-first'>
        <span className="material-symbols-outlined click-button" data-bs-toggle="offcanvas" aria-controls="offcanvasWithBothOptions" data-bs-target="#offcanvasWithBothOptions">menu</span>
        <Sidebar />

        <div className='nav-logo-name click-button' onClick={() => navigate('/')}>
          <img src={logo} style={{ height: '30px' }} /> GrocerBlink
        </div>

      </div>

      {isActive('/shop/:category') || isActive('/store/:storeId')? 
        (<div className='nav-search'>
          <form className='nav-form' onSubmit={handleSearch}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input type='text' placeholder='Search products and stores' value={search} onChange={(e)=>setSearch(e.target.value)}/>
          </form>
        </div>) 
        
      : null}

      <div className='nav-last'>
        {currentUser ?
          (<>
            {isActive('/') || isActive('/shop/:category') ?
              <span className='nav-zip click-button'>
                <span className='nav-zip-logo dropdown-toggle' data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                  <span className="material-symbols-outlined">home_pin</span>{currentUser.zipcode}
                </span>

                <div className='nav-zip-form-container dropdown-menu' style={{ marginTop: '10px', left: '-50%' }}>
                  <form className='nav-zip-form'>
                    <input type='text' className='nav-form-area' value={zipData.area} name='area' onChange={updateData} />
                    <div className='zip-form-container'>
                      <input type='number' className='nav-zip-input number-input' name='zip' onChange={updateData} value={zipData.zip} />
                      <button className='nav-form-button' onClick={setZip}>set</button>
                    </div>
                  </form>
                </div>
              </span>

              : ''}

            <Cart />

          </>) :
          currentVendor ?
            (<><span className="material-symbols-outlined" onClick={openAddProduct}>note_stack_add</span>
              <span className="material-symbols-outlined">manage_accounts</span></>) :
            (<>
              <div className='nav-link click-button' onClick={() => navigate('/user/signin')}><span className="material-symbols-outlined">login</span>Log in</div>
              <div className='nav-link click-button' onClick={() => navigate('/user/signup')}><span className="material-symbols-outlined">person</span>Sign up</div>
            </>)}
      </div>
    </nav>)
}
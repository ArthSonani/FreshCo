import React from 'react'


export default function Navbar() {
  return (
    <nav className='navbar'>

      <div className='nav-first'>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#343538" xmlns="http://www.w3.org/2000/svg" size="24" color="systemGrayscale70" aria-hidden="true" data-bs-toggle="offcanvas" aria-controls="offcanvasWithBothOptions" data-bs-target="#offcanvasWithBothOptions">
          <path d="M20 6H4v2h16zM4 11h16v2H4zM4 16h16v2H4z"></path>
        </svg>

        <div class="offcanvas offcanvas-start my-width" style={{width: "300px"}} data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Logo on sidebar</h5>
            {/* <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> */}
        </div>
        <div class="offcanvas-body">
            <p>In the sidebar</p>
        </div>
        </div>

        <h1>GrocerBlink</h1>
      </div>

      <div className='nav-search'>
        <form className='nav-form'>
          <button><span class="material-symbols-outlined">search</span></button>
          <input type='text' className='nav-form-input' placeholder='Search products and stores'></input>
        </form>
      </div>

      <div className='nav-last'>
        <div className='nav-link'><span class="material-symbols-outlined">login</span>Log in</div>
        <div className='nav-link'><span class="material-symbols-outlined">person</span>Sign up</div>
      </div>

    </nav>
  )
}

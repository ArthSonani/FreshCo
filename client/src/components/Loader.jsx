import React from 'react'

export default function Loader() {
  return (
    <div className='loading'>
      <div class="lds-ripple">
        <img src='/loaderLogo.png' style={{height: '100px', borderRadius: '50%'}}/>
          <div></div>
          <div></div>
      </div>
    </div>
  )
}

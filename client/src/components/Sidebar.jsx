import React from 'react'

export default function Sidebar() {
  return (
    <div>
        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Enable both scrolling & backdrop</button>
        <div class="offcanvas offcanvas-start my-width" style={{width: "300px"}} data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Logo on sidebar</h5>
            {/* <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> */}
        </div>
        <div class="offcanvas-body">
            <p>In the sidebar</p>
        </div>
        </div>
    </div>
    
  )
}

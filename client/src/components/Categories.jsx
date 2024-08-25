import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Categories() {
    const navigate = useNavigate()
    const params = useParams()

    useEffect(()=>{
        const icons = document.querySelectorAll('.category-icon-container')
        icons.forEach((i)=>{i.classList.remove('category-selected')})
        const selected = document.getElementById(params.category)
        selected.classList.add('category-selected')
    },[params.category])
    

  return (
    <div className='category-container'>
        <div className='category-icon-container' id='all-stores' onClick={()=>{navigate('/shop/all-stores')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">storefront</span></div>
            <div className='category-name'>All&nbsp;stores</div>
        </div>
        <div className='category-icon-container' id='groceries-and-food-items' onClick={()=>{navigate('/shop/groceries-and-food-items')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">grocery</span></div>
            <div className='category-name'>Grocery</div>
        </div>
        <div className='category-icon-container' id='stationery' onClick={()=>{navigate('/shop/stationery')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">book_5</span></div>
            <div className='category-name'>Stationery</div> 
        </div>
        <div className='category-icon-container' id='sports-and-games' onClick={()=>{navigate('/shop/sports-and-games')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">toys_and_games</span></div>
            <div className='category-name'>Games</div>
        </div>
        <div className='category-icon-container' id='pharmacy' onClick={()=>{navigate('/shop/pharmacy')}}>
            <div className='category-icon'><svg width="30" height="30" viewBox="0 0 24 24" fill="#242529" xmlns="http://www.w3.org/2000/svg" size="30" aria-hidden="true" color="systemGrayscale80" className="e-bauix2"><path d="M21 4.25c-1.1 0-2-.9-2-2V0H6v2.25c0 1.1-.9 2-2 2V8.5h1.5V24h14V8.5H21zM5.75 5.57c1.19-.63 2-1.88 2-3.32v-.5h9.5v.5c0 1.44.81 2.69 2 3.32v1.18H5.75zm1.5 6.68h5.41c.09 0 .15.04.2.11s.06.15.03.23l-2.06 5.75a.26.26 0 0 1-.24.17H7.25zm10.5 10H7.25v-2h3.34c.84 0 1.6-.53 1.88-1.32l2.06-5.75c.47-1.3-.5-2.68-1.88-2.68H7.24v-2h10.5v13.75z"></path></svg></div>
            <div className='category-name'>Pharmacy</div>
        </div>
        <div className='category-icon-container' id='personal-care-and-beauty' onClick={()=>{navigate('/shop/personal-care-and-beauty')}}>
            <div className='category-icon'><svg width="30" height="30" viewBox="0 0 24 24" fill="#242529" xmlns="http://www.w3.org/2000/svg" size="30" aria-hidden="true" color="systemGrayscale80" className="e-bauix2"><path d="M23.93 19.202s-.02-.08-.02-.12c-.51-2.529-3.2-5.508-7.26-6.197L14.9 8.007h-.97v-1.79c0-1.15-.93-2.079-2.07-2.079h-.72c-.61 0-1.11-.51-1.11-1.12V1.76h4.38c.62 0 1.12.5 1.12 1.12v1h1.75v-1A2.88 2.88 0 0 0 14.4 0H6.39v1.75h1.88v1.259c0 .62-.5 1.11-1.11 1.12h-.57c-1.14 0-2.07.929-2.07 2.078v1.79H3.39L.38 16.413c-.48 1.36-.54 2.869.02 4.198C1.79 23.91 5.62 24 6.95 24h13.18c2.14 0 3.87-1.74 3.87-3.898v-.17c0-.23-.03-.48-.07-.73M6.27 6.217c0-.18.14-.33.32-.33h5.26c.18 0 .32.15.32.33v1.79h-5.9zm.68 16.034c-2.66 0-4.28-.76-4.94-2.32-.35-.859-.35-1.899.02-2.928l2.59-7.247h9.04l1.79 4.978c-.24.75-.93 1.3-1.76 1.3h-.81c-2.14 0-3.87 1.739-3.87 3.898v.17c0 .79.24 1.529.64 2.149zm15.3-2.15c0 1.18-.95 2.15-2.12 2.15h-7.25c-1.17 0-2.12-.96-2.12-2.15v-.17c0-1.179.95-2.148 2.12-2.148h.91a3.63 3.63 0 0 0 3.45-2.97c2.9.83 4.64 3.08 4.96 4.659v.04c.04.18.06.32.06.43v.17z"></path></svg></div>
            <div className='category-name'>Beauty</div>
        </div>
        <div className='category-icon-container' id='clothing-and-accessories' onClick={()=>{navigate('/shop/clothing-and-accessories')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">apparel</span></div>
            <div className='category-name'>Clothes</div>
        </div>
        <div className='category-icon-container' id='household-essentials' onClick={()=>{navigate('/shop/household-essentials')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">mop</span></div>
            <div className='category-name'>Essentials</div>
        </div>
        <div className='category-icon-container' id='electronics-and-gadgets' onClick={()=>{navigate('/shop/electronics-and-gadgets')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">devices</span></div>
            <div className='category-name'>Electronics</div>
        </div>
        <div className='category-icon-container' id='pet-supplies' onClick={()=>{navigate('/shop/pet-supplies')}}>
            <div className='category-icon'><span className="icons material-symbols-outlined">pet_supplies</span></div>
            <div className='category-name'>Pets</div>
        </div>
    </div>
  )
}

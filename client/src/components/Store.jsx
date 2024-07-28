import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Store(props) {
  
  const navigate = useNavigate()

  return (
    <div className='store-container click-button' onClick={()=>{navigate(`/store/${props.id}`)}}>
        <div className='store-image'>
            <img className='store-img' src={props.logo} />
        </div>
        <div className='store-info'>
            <h5 className='store-name'>{props.name}</h5>
            <p className='store-loc'><span className="store-loc-icon material-symbols-outlined">location_on</span>{props.area}</p>
            <p className='store-cate'>{props.categories[0]}<br />{props.categories[1]}<br />{props.categories[2]}</p>
        </div>
    </div>
  )
}

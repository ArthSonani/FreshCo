import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { endLoading, startLoading } from '../redux/loadPage/loadingSlice'

export default function Home() {
  const dispatch = useDispatch()
  const {loading} = useSelector((state)=>state.loadPage)

  // console.log(loading)

  function refresh(){
    dispatch(startLoading())
    setTimeout(()=>{
      dispatch(endLoading())
    }, 2000)
  }

  return (
    <>
    {loading? 
      <div className='loading'><Loader /></div>: ""
    }
    <section>
      <div className='home-intro'>
        <h1>Open the door,<br/>
          we have come with your grocery
        </h1>
        <p>Whatever you want from local stores, brought right to your door.</p>
      </div>
      <button onClick={refresh}>Load</button>
    </section>
     </>
  )
}

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userSigninSuccess } from '../redux/user/userSlice'

export default function UserAccount() {

  const dispatch = useDispatch() 
  const currentUser = useSelector((state)=>state.user.user)

  const [ accountData, setAccountData ] = React.useState({}) 
  const [ currentField, setCurrentField ] = React.useState(null)
  const [ updatedValue, setUpdatedValue ] = React.useState('')
  const [ formError, setFormError ] = React.useState(null)
  const [ updatePassword, setUpdatePassword ] = React.useState({
    current: '', new: '', confirm: ''
  })

  function updateData(event){
    setUpdatedValue(event.target.value)
  }

  function changePassword(event){
    const { name, value } = event.target

        setUpdatePassword((preData)=>{
            return{
                ...preData,
                [name] : value
            }
        })
  }

  useEffect(()=>{
    async function getCurrentUser(){
      try{
        const res = await fetch('/api/user/user-data', {
          method : 'POST',
          headers : { 
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({user : currentUser._id})
        })
        
        const data = await res.json()

        console.log(data)
  
        if(data.success === false){
          console.log(data.message)
          return
        }
  
        setAccountData(data.userData)
        dispatch(userSigninSuccess(data.userData))
        
      }
      catch(err){
        console.log(err)
      }
    }
    getCurrentUser()
  }, [currentUser._id])


  async function updateAccount(){

    const mailformat = /(\W|^)[\w.+\-]*@gmail\.com(\W|$)/;
    if(currentField == 'email' && !updatedValue.match(mailformat)){
      setFormError("Invalid email!")
      return
    }

    if (currentField === 'phone') {
      if (updatedValue.length !== 10 || !['6', '7', '8', '9'].includes(updatedValue[0])) {
          setFormError("Invalid phone number!");
          return;
      }
    }

    if (currentField === 'address' && updatedValue.trim().length == 0) {
      setFormError("Invalid Address!");
      return;
    }

    if (updatePassword.new !== updatePassword.confirm){
      setFormError("Password doesn't match!")
      return
    } 

    try{
      const res = await fetch('/api/user/update-account', {
        method : 'POST',
        headers : { 
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({user : currentUser._id, field: currentField, value: updatedValue, currentPassword: updatePassword.current, newPassword: updatePassword.new})
      })
      
      const data = await res.json()

      console.log(data)

      if(data.success === false){
        console.log(data.message)
        setFormError(data.message)
        return
      }


      setAccountData((prevData) => ({
        ...prevData,
        [currentField]: updatedValue
      }));
      dispatch(userSigninSuccess(data.userData))
      setCurrentField(null);
      setUpdatedValue('');
      setFormError(null)

      const updateContainer = document.querySelector('.update-container')
      updateContainer.style.display = 'none'

    }
    catch(err){
      console.log(err)
    }
  }


  function changeFeild(feild){
    const updateContainer = document.querySelector('.update-container')
    updateContainer.style.display = 'grid'
    setCurrentField(feild)
    setUpdatedValue(accountData[feild] || '')
  }

  function closeUpdateContainer(){
    const updateContainer = document.querySelector('.update-container')
    updateContainer.style.display = 'none'
  }

  return (
    <div className='general-account'>
        <div className='account-setting-head'>
          <h3>Account settings</h3>
        </div>

        <div className='user-account-info'>


          <div className='update-container'>
            <div className='update-account'>
            <span className="material-symbols-outlined close" onClick={closeUpdateContainer}>close</span>

              <h4>Change {currentField}</h4>
              {currentField === 'password'? 
              
              (<>

                <input type='text' value={updatePassword.current} name='current' placeholder='Current password' onChange={changePassword}/>
                <input type='text' value={updatePassword.new} name='new' onChange={changePassword} placeholder='New password'/>
                <input type='text' value={updatePassword.confirm} placeholder='Confirm password' name='confirm' onChange={changePassword}/>

              </>) :

                <input 
                  placeholder='Enter'
                  type={['phone', 'zipcode'].includes(currentField) ? 'number' : 'text'} 
                  value={updatedValue} 
                  name={currentField} 
                  onChange={updateData} 
                />
                
              
              }

              {formError && <p style={{color: 'red', marginTop: '10px', marginBottom: '0px', textAlign: 'center'}}>{formError}</p>}

              <button onClick={updateAccount} className='update-account-button'>Update</button>
            </div>
          </div>



          <div className='account-category'>
            <h5>Account information</h5>
            <div>
              Email address
              <p className='user-info'><span>{accountData.email}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('email')}>edit</span></p>
            </div>
            <div>
              Password
              <p className='user-info'><span>* * * * * * *</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('password')}>edit</span></p>
            </div>
          </div>


          <div className='account-category'>
            <h5>Personal information</h5>
            <div>
              First name
              <p className='user-info'><span>{accountData.firstname}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('firstname')}>edit</span></p>
            </div>
            <div>
              Last name
              <p className='user-info'><span>{accountData.lastname}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('lastname')}>edit</span></p>
            </div>
            <div>
              Phone no
              <p className='user-info'><span>{accountData.phone? accountData.phone : 'No phone number'}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('phone')}>edit</span></p>
            </div>
          </div>


          <div className='account-category'>
            <h5>Addresses information</h5>
            <div>
              Address
              <p className='user-info'><span>{accountData.address? accountData.address : 'No address'}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('address')}>edit</span></p>
            </div>
            <div>
              Area
              <p className='user-info'><span>{accountData.area}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('area')}>edit</span></p>
            </div>
            <div>
              Zipcode
              <p className='user-info'><span>{accountData.zipcode}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('zipcode')}>edit</span></p>
            </div>
          </div>


        </div>
    </div>
  )
}





// update data to redux when update done
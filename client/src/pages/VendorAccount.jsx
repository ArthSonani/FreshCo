import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { categoriesData } from '../categoriesData'
import { vendorSigninSuccess } from '../redux/vendor/vendorSlice'

export default function VendorAccount() {
  
  const dispatch = useDispatch() 
  const currentVendor = useSelector((state)=>state.vendor.vendor)

  const [ accountData, setAccountData ] = React.useState({})
  const [ currentField, setCurrentField ] = React.useState(null)
  const [ updatedValue, setUpdatedValue ] = React.useState('')
  const [ formError, setFormError ] = React.useState(null)
  const [ formWarning, setFormWarning ] = React.useState(null)
  const [ updatePassword, setUpdatePassword ] = React.useState({
    current: '', new: '', confirm: ''
  })
  const [ updateCategories, setUpdateCategories ] = useState(null)

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

  function changeCategories(event){
    const { value, checked } = event.target
        let updatedCategories = [...updateCategories]

        if(checked){
            updatedCategories.push(value)
        }
        else{
          setFormWarning('Removing a category will also remove all products in your inventory that belong to that category.')
          updatedCategories = updatedCategories.filter((category)=> category !== value)
        }

      setUpdateCategories(updatedCategories)
      setUpdatedValue(updatedCategories)
  }


  useEffect(()=>{
    async function getcurrentVendor(){
      try{
        const res = await fetch('/api/shop/store-data', {
          method : 'POST',
          headers : { 
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({store : currentVendor._id})
        })
        
        const data = await res.json()
  
        if(data.success === false){
          console.log(data.message)
          return
        }
  
        setAccountData(data.storeData)
        setUpdateCategories(accountData.categories)
        dispatch(vendorSigninSuccess(data.storeData))
  
      }
      catch(err){
        console.log(err)
      }
    }
    getcurrentVendor()
  }, [currentVendor._id])

  useEffect(() => {
    if (accountData.categories) {
      setUpdateCategories(accountData.categories);
    }
  }, [accountData]);

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
      const res = await fetch('/api/shop/update-account', {
        method : 'POST',
        headers : { 
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
          store : currentVendor._id, 
          field: currentField, 
          value: updatedValue, 
          currentPassword: updatePassword.current, 
          newPassword: updatePassword.new
        })
      })
      
      const data = await res.json()

      if(data.success === false){
        console.log(data.message)
        setFormError(data.message)
        return
      }

      setAccountData((prevData) => ({
        ...prevData,
        [currentField]: updatedValue
      }));
      setUpdatePassword({
        current: '', new: '', confirm: ''
      })
      dispatch(vendorSigninSuccess(data.storeData))
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
    setFormError(null)
    setFormWarning(null)
  }

  return (
    <div className='general-account'>
        <div className='account-setting-head'>
          <h3>Account settings</h3>
        </div>

        <div className='user-account-info'>


          <div className='update-container'>
            <div className={currentField == 'categories'? 'vendor-acc-select' :'update-account'}>
              <span className="material-symbols-outlined close" onClick={closeUpdateContainer}>close</span>

              <h4>Change {currentField}</h4>
              {currentField === 'password'? 
              
              (<>

                <input type='password' value={updatePassword.current} name='current' placeholder='Current password' onChange={changePassword}/>
                <input type='password' value={updatePassword.new} name='new' onChange={changePassword} placeholder='New password'/>
                <input type='password' value={updatePassword.confirm} placeholder='Confirm password' name='confirm' onChange={changePassword}/>

              </>) : currentField === 'categories'? 
              
              
              <div className='acc-select'>
                {categoriesData.map((category, index) => (
                    <label key={index}>
                        <input 
                            type='checkbox'
                            value={category.main}
                            checked={updateCategories.includes(category.main)}
                            onChange={changeCategories}
                        />
                        &nbsp;&nbsp;
                        {category.main.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())}
                    </label>
                ))}
              </div> :

                <input 
                  type={['phone', 'zipcode'].includes(currentField) ? 'number' : 'text'} 
                  value={updatedValue} 
                  name={currentField} 
                  onChange={updateData} 
                />
              } 

              {formError && <p style={{color: 'red', marginTop: '10px', marginBottom: '0px', textAlign: 'center'}}>{formError}</p>}
              {formWarning && <p style={{color: 'rgb(175, 178, 69)', marginTop: '10px', marginBottom: '0px', padding : '10px', textAlign: 'center'}}>{formWarning}</p>}
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
            <h5>Store information</h5>
            <div>
              Vendor name
              <p className='user-info'><span>{accountData.name}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('name')}>edit</span></p>
            </div>
            <div>
              Store name
              <p className='user-info'><span>{accountData.businessName}</span> <span className='material-symbols-outlined' onClick={()=>changeFeild('businessName')}>edit</span></p>
            </div>
            <div>
              Store categories
              <div className='vendor-cat'> <span className='material-symbols-outlined vendor-cat-edit' onClick={()=>changeFeild('categories')}>edit</span>
                {accountData.categories ? accountData.categories.map(category=>{
                  return ( <p key={category} className='store-category-info'><span>{category}</span></p>)
                }) : null}
              </div>
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

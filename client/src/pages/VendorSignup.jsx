import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { vendorSigninStart, vendorSigninSuccess, vendorSigninFailure } from '../redux/vendor/vendorSlice'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

const categories = [
    {
        show : 'Groceries and Food Items',
        use : 'groceries-and-food-items'
    },
    {
        show : 'Stationery',
        use : 'stationery'
    },
    {
        show : 'Stores and Games',
        use : 'stores-and-games'
    },
    {
        show : 'Pharmacy',
        use : 'pharmacy'
    },
    {
        show : 'Personal Care and Beauty',
        use : 'personal-care-and-beauty'
    },
    {
        show : 'Clothing and Accessories',
        use : 'clothing-and-ccessories'
    },
    {
        show : 'Household Essentials',
        use : 'household-essentials'
    },
    {
        show : 'Electronics and Gadgets',
        use : 'electronics-and-gadgets'
    },
    {
        show : 'Pet Supplies',
        use : 'pet-supplies'
    }
]


export default function Signup() {

    const logoRef = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()  

    const [ formData, setFormData ] = React.useState(
        { name: '', businessname: '', email: '', area: '', zipcode: '', password: '', c_password: '', logo: '', categories: [] }
    )
    const [ logo, setLogo ] = React.useState(null)
    const { loading, error } = useSelector(state =>state.vendor)
    
    function updateLogoState(logo){
        document.querySelector(".signin-logo-input").innerHTML = logo.name;
        setLogo(logo)
    }

    function updateData(event){
        const { name, value } = event.target;

        setFormData((preData)=>{
            return{
                ...preData,
                [name] : value
            }
        })
    }

    function updateCategories(event){
        const { value, checked } = event.target
        let updatedCategories = [...formData.categories]

        if(checked){
            updatedCategories.push(value)
        }
        else{
            updatedCategories = updatedCategories.filter((category)=> category !== value)
        }

        setFormData({
            ...formData,
            categories : updatedCategories
        })
    }

    async function submitData(event){
        event.preventDefault()
        const storage = getStorage(app)
        const logoName = new Date().getTime() + logo.name
        const storageRef = ref(storage, logoName)
        const uploadTask = uploadBytesResumable(storageRef, logo)

        try{
            dispatch(vendorSigninStart())

            const downloadURL = await new Promise((resolve, reject)=>{
                uploadTask.on(
                    "state_changed",
                    (snapshot)=>{
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`logo upload is ${progress}% done`)
                    },
                    (error)=>{
                        console.log(error)
                    },
                    ()=>{
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                            resolve(downloadURL)
                        }).catch(reject);
                    }
                )
            })
                
            const updatedFormData = {...formData, logo : downloadURL}
            
            const res = await fetch('/api/vendor/auth/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFormData)
            })

            const data = await res.json()

            if(data.success === false){
                dispatch(vendorSigninFailure(data.message))
                return
            }
            dispatch(vendorSigninSuccess(data))
            navigate('/inventory')
        }
        catch(err){
            dispatch(vendorSigninFailure(err))
        }
    }
    

      
  return (
    <main className='signup-main'>
        <div className='signup-page'>
            <div className='signup-head'>
                <h1>Create an vendor account</h1>
                <h5>Already have an account? <Link className='signin-link' to='/vendor/signin'>Signin</Link></h5>
            </div>

            <hr className='signup-line'/>

            <div className='signup-form-container'>
                <form className='signup-form'>

                    <input type='text' className='signup-input' placeholder='Name' onChange={updateData} name='name' value={formData.name} required />
                    <input type='text' className='signup-input' placeholder='Business Name' onChange={updateData} name='businessname' required value={formData.businessname} />
                    <div className='signup-input signin-logo-input' onClick={()=>logoRef.current.click()}>Choose your business logo</div>
                    <input type='file' ref={logoRef} hidden required onChange={ (e)=>updateLogoState(e.target.files[0]) } />
                    <input type='text' className='signup-input' placeholder='Area Name' onChange={updateData} name='area' required value={formData.area} />
                    <input type='number' className='signup-input' placeholder='Zip Code' pattern="[0-9]{6}" onChange={updateData} required name='zipcode' value={formData.zipcode} />

                    <p className='input-head'>Select the categories available in your store.</p>

                    <div className='signin-select'>
                        {categories.map((category, index) => (
                            <label key={index}>
                                <input 
                                    type='checkbox'
                                    value={category.use}
                                    checked={formData.categories.includes(category.use)}
                                    onChange={updateCategories}
                                />
                                &nbsp;&nbsp;
                                {category.show}
                            </label>
                        ))}
                    </div>

                    <p className='input-head'>Set password</p>

                    <input type='email' className='signup-input' placeholder='Email' onChange={updateData} required name='email' value={formData.email} />
                    <input type='password' className='signup-input' placeholder='Password' onChange={updateData} required name='password' value={formData.password} />
                    <input type='password' className='signup-input' placeholder='Confirm Password' onChange={updateData} required name='c_password' value={formData.c_password} />
                    
                    <div className='button-container'>
                        {error && <p style={{color: 'red', marginTop: '20px'}}>{JSON.stringify(error)}</p>}
                        <button disable={loading? 'true' : 'undefined'} onClick={submitData} className='signup-button'>{loading? "Loading..." : "Create account" }</button>
                    </div>
                    <p className='signup-p'>By signing up, or continuing with Facebook or Google,<br />
                    you agree to the GrocerBlink <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
                </form>
            </div>
        </div>
    </main>
  )
}



        // 'Groceries and Food Items'
        // 'Stationery'
        // 'Stores and Games'
        // 'Pharmacy'
        // 'Personal Care and Beauty'
        // 'Clothing and Accessories'
        // 'Household Essentials'
        // 'Electronics and Gadgets'
        // 'Pet Supplies'
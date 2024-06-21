import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { vendorSigninStart, vendorSigninSuccess, vendorSigninFailure } from '../redux/vendor/vendorSlice'

export default function Signup() {

    const navigate = useNavigate()
    const dispatch = useDispatch()  

    const [ formData, setFormData ] = React.useState(
        { name: '', businessname: '', email: '', zipcode: '', password: '' }
    )
    
    const { loading, error } = useSelector(state =>state.vendor)

    function updateData(event){
        const { name, value } = event.target;

        setFormData((preData)=>{
            return{
                ...preData,
                [name] : value
            }
        })
    }

    async function submitData(event){
        event.preventDefault()
        try{
            dispatch(vendorSigninStart())
            const res = await fetch('/api/vendor/auth/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            // console.log(data)

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
                <div className='signup-option'>
                    <div style={{width: '20%'}} className='signup-option-div'><img src="/facebook.png" alt="Facebook" width="25" /></div>
                    <div style={{width: '80%'}} className='signup-option-div'>Continue with Facebook</div>
                </div>
                <div className='signup-option'>
                    <div style={{width: '20%'}} className='signup-option-div'><img src="https://dye1fo42o13sl.cloudfront.net/social-icons/google-logo-icon.png" alt="Google" width="25" /></div>
                    <div style={{width: '80%'}} className='signup-option-div'>Continue with Google</div>
                </div>
            </div>

            <hr className='signup-line'/>

            <div className='signup-form-container'>
                <form className='signup-form'>

                    <input type='text' className='signup-input' placeholder='Name' onChange={updateData} name='name' value={formData.name} />
                    <input type='text' className='signup-input' placeholder='Business Name' onChange={updateData} name='businessname' value={formData.businessname} />
                    <input type='number' className='signup-input' placeholder='Zip Code' pattern="[0-9]{6}" onChange={updateData} name='zipcode' value={formData.zipcode} />
                    <input type='email' className='signup-input' placeholder='Email' onChange={updateData} name='email' value={formData.email} />
                    <input type='password' className='signup-input' placeholder='Password' onChange={updateData} name='password' value={formData.password} />
                    {error && <p style={{color: 'red', marginTop: '20px'}}>{JSON.stringify(error)}</p>}
                    <div disable={loading? 'true' : 'undefined'} onClick={submitData} className='signup-button'>{loading? "Loading..." : "Create account" }</div>

                    <p className='signup-p'>By signing up, or continuing with Facebook or Google,<br />
                    you agree to the GrocerBlink <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
                </form>
            </div>
        </div>
    </main>
  )
}

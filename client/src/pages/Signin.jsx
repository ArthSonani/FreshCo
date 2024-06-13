import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signinStart, signinSuccess, signinFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function Signin() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [ formData, setFormData ] = React.useState(
        { email: "", password: "" }
    )
    
    const { loading, error } = useSelector((state)=>state.user)

    function updateData(event){
        const { name, value } = event.target

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
            dispatch(signinStart())
            const res = await fetch('/api/auth/signin',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)

            })
            const data = await res.json()
            // console.log(data)

            if(data.success === false){
                dispatch(signinFailure(data.message))
                return
            }
            dispatch(signinSuccess(data))
            navigate('/')
        }
        catch(err){
            dispatch(signinFailure(err))
        }

    }

    // console.log(useSelector((state)=>state.user.user))


  return (
    <main className='signup-main'>
    <div className='signup-page'>
        <div className='signup-head'>
            <h1>Sign in</h1>
            <h5>New to GrocerBlink? <Link className='signin-link' to='/signup'>Signup</Link></h5>
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
                
                <input type='email' className='signup-input' placeholder='Email' name='email' onChange={updateData} />
                <input type='password' className='signup-input' placeholder='Password' name='password' onChange={updateData} />
                {error && <p style={{color: 'red', marginTop: '20px'}}>{error}</p>}
                <div disable={loading} className='signup-button' onClick={submitData}>{loading? <><span class="spinner-border spinner-border-sm" aria-hidden="true" style={{marginRight: '5px'}}> </span> Loading...</> : "Sign in"}</div>
                <p className='signup-p'>By signing up, or continuing with Facebook or Google,<br />
                you agree to the GrocerBlink <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
            </form>
        </div>
    </div>
    </main>
  )
}
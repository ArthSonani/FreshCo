import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userSigninStart, userSigninSuccess, userSigninFailure } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

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
            dispatch(userSigninStart())
            const res = await fetch('https://freshco-0dlm.onrender.com/api/user/auth/signin',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)

            })
            const data = await res.json()

            console.log(data)

            if(data.success === false){
                dispatch(userSigninFailure(data.message))
                return
            }
            
            toast.success(`Welcome back ${data.firstname}!`)
            dispatch(userSigninSuccess(data))
            navigate('/shop/all-stores')
        }
        catch(err){
            dispatch(userSigninFailure(err))
        }

    }

    // console.log(useSelector((state)=>state.user.user))


  return (
    <main className='signup-main'>
    <div className='signup-page'>
        <div className='signup-head'>
            <h1>Sign in your account</h1>
            <h5>New to FRESHCO? <Link className='signin-link' to='/user/signup'>Signup</Link></h5>
        </div>

        <hr className='signup-line'/>

        <div className='signup-form-container'>
            <form className='signup-form'>
                <input type='email' className='signup-input' placeholder='Email' name='email' onChange={updateData} value={formData.email} />
                <input type='password' className='signup-input' placeholder='Password' name='password' onChange={updateData} value={formData.password} />
                <div className='button-container'>
                    {error && <p style={{color: 'red', marginTop: '20px'}}>{JSON.stringify(error)}</p>}
                    <div disable={loading? 'true' : 'undefined'} className='signup-button' onClick={submitData}>{loading? <><span className="spinner-border spinner-border-sm" aria-hidden="true" style={{marginRight: '5px'}}> </span> Loading...</> : "Sign in"}</div>
                </div>
                <p className='signup-p'>By signing up, or continuing with Facebook or Google,<br />
                you agree to the FRESHCO <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
            </form>
        </div>
    </div>
    </main>
  )
}

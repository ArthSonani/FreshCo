import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
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
                
                <input type='email' className='signup-input' placeholder='Email'></input>
                <input type='password' className='signup-input' placeholder='Password'></input>
                <div type='button' className='signup-button'>Sign in</div>
                <p className='signup-p'>By signing up, or continuing with Facebook or Google,<br />
                you agree to the GrocerBlink <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
            </form>
        </div>
    </div>
    </main>
  )
}
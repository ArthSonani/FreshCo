import React, {useRef, useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { userSigninStart, userSigninSuccess, userSigninFailure } from '../redux/user/userSlice'
import toast from 'react-hot-toast'

export default function Signup() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const length = 6;
    const inputRefs = useRef([]);

    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [ correctOTP, setCorrectOTP ] = useState(null)
    const [timer, setTimer] = useState(0);
    const [ formData, setFormData ] = useState(
        { firstname: '', lastname: '', email: '', zipcode: '', password: '', c_password: '', area: '' }
    )

    const { loading, error } = useSelector(state =>state.user)
    const [ formError, setFormError ] = useState(null)
    const [warning, setWarning] = useState(null)

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

        const combinedOtp = otp.join("");

        if (combinedOtp.length != 6){
            setFormError('Enter Full OTP')
        }
        else if (correctOTP === combinedOtp){
            try{
                dispatch(userSigninStart())
                const res = await fetch('https://fresh-co-backend.vercel.app/api/user/auth/signup', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                const data = await res.json()

                if(data.success === false){
                    dispatch(userSigninFailure(data.message))
                    return
                }
                dispatch(userSigninSuccess(data))
                toast.success(`Welcome ${data.firstname}`)
                navigate('/shop/all-stores')
            }
            catch(err){
                dispatch(userSigninFailure(err))
            }
        }
        else{
            setFormError('OTP incorrect')
        }
    }
    


    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearTimeout(countdown);
        } else {
            setOtp(new Array(length).fill(''));
            setWarning('Time is up! click resend to get OTP')
        }
    }, [timer]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        if (index > 0 && !otp[index - 1]){
            inputRefs.current[otp.indexOf("")].focus();
        }

    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]){
            inputRefs.current[index - 1].focus();
        }
    };

    function closeVerify(){
        const verifyCNT = document.querySelector('.signup-verify')
        verifyCNT.style.display = 'none';
        setTimer(0)
        setFormError(null)
        setWarning(null)
    }

    async function checkData(event){
        event.preventDefault()

        const validateFormData = () => {
            const mailformat = /(\W|^)[\w.+\-]*@gmail\.com(\W|$)/;

            if (!formData.firstname) return 'Must provide your first name!';
            else if (!formData.lastname) return 'Must provide your last name!';
            else if (!formData.zipcode) return 'Must provide your area zipcode!';
            else if (!formData.area) return 'Must provide your area name!';
            else if (!formData.email) return 'Must provide your email!';
            else if(!formData.email.match(mailformat)) return 'Invalid email!';
            else if (!formData.password) return 'Must provide strong password!';
            else if (!formData.c_password) return 'Must provide confirm password!';
            else if(formData.password !== formData.c_password) return "Password doesn't match!"
            return null;
        };
    
        const formError = validateFormData();
        if (formError) {
            setFormError(formError);
            return;
        }

        try{
            const res = await fetch('https://fresh-co-backend.vercel.app/api/user/auth/check-email', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email : formData.email})
            })
            const data = await res.json()

            if(data.success === false){
                console.log(data.message)
                return
            }

            if(!data.available){
                setFormError('This email address is already in use.')
            }
            else{
                generateOTP()
                const verifyCNT = document.querySelector('.signup-verify')
                verifyCNT.style.display = 'flex';
            }
        }
        catch(err){
            dispatch(userSigninFailure(err))
        }
    }
    

    async function generateOTP(event){
        event? event.preventDefault() : null

        try{
            const res = await fetch('https://fresh-co-backend.vercel.app/api/user/auth/generate-otp', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email : formData.email})
            })
            const data = await res.json()

            if(data.success === false){
                console.log(data.message)
                return
            }

            setCorrectOTP(data.otp)
            setTimer(60);
            setFormError(null)
            setWarning(null)
        }
        catch(err){
            dispatch(userSigninFailure(err))
        }
    }


      
  return (
    <main className='signup-main'>

        <div className='signup-verify'>
            <div className='verify-container'>
                <span className="material-symbols-outlined verify-close" onClick={closeVerify}>close</span>
                <h4>Verify Your Email</h4>
                <p>Enter OTP sent to  {formData.email}</p>
                <div className='otp-container'>
                    {otp.map((value, index) => {
                        return (
                        <input
                            key={index}
                            type="text"
                            ref={(input) => (inputRefs.current[index] = input)}
                            value={value}
                            onChange={(e) => handleChange(index, e)}
                            onClick={() => handleClick(index)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                        );
                    })}
                </div>
                <div className='time-resend'>
                    <span className='timer'>Time: {timer}s</span> 
                    <span onClick={generateOTP} className='resend'>Resend OTP</span>
                </div>

                {formError && !warning && <p style={{color: 'red', marginTop: '20px', marginBottom: '0', textAlign: 'center'}}>{formError}</p>}
                {warning && <p style={{color: '#A6A15E', marginTop: '20px', marginBottom: '0', textAlign: 'center'}}>{warning}</p>}
                <div disable={loading? 'true' : 'undefined'} onClick={submitData} className='signup-button'>{loading? "Loading..." : "Verify" }</div>
            </div>
        </div>

        <div className='signup-page'>
            <div className='signup-head'>
                <h1>Create an account</h1>
                <h5>Already have an account? <Link className='signin-link' to='/user/signin'>Signin</Link></h5>
            </div>

            <hr className='signup-line'/>

            <div className='signup-form-container'>
                <form className='signup-form'>

                    <input type='text' className='signup-input' placeholder='First Name' onChange={updateData} name='firstname' value={formData.firstname} />
                    <input type='text' className='signup-input' placeholder='Last Name' onChange={updateData} name='lastname' value={formData.lastname} />
                    <input type='number' className='signup-input number-input' placeholder='Zip Code' pattern="[0-9]{6}" onChange={updateData} name='zipcode' value={formData.zipcode} />
                    <input type='text' className='signup-input' placeholder='Area Name' onChange={updateData} name='area' value={formData.area} />
                    <br />
                    <input type='email' className='signup-input' placeholder='Email' onChange={updateData} name='email' value={formData.email} />
                    <input type='password' className='signup-input' placeholder='Password' onChange={updateData} name='password' value={formData.password} />
                    <input type='password' className='signup-input' placeholder='Confirm Password' onChange={updateData} name='c_password' value={formData.c_password} />

                    {formError && timer == 0 && <p style={{color: 'red', marginTop: '20px', textAlign: 'center'}}>{formError}</p>}

                    <div className='button-container'>
                        <div disable={loading? 'true' : 'undefined'} onClick={checkData} className='signup-button'>{loading? "Loading..." : "Create account" }</div>
                    </div>
                    <p className='signup-p'>By signing up, <br />
                    you agree to the FRESHCO <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
                </form>
            </div>
        </div>
    </main>
  )
}

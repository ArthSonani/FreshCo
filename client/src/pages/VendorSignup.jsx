import React, { useRef,useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { vendorSigninStart, vendorSigninSuccess, vendorSigninFailure } from '../redux/vendor/vendorSlice'
import { app } from '../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { categoriesData } from '../categoriesData'
import toast from 'react-hot-toast'

export default function Signup() {

    const logoRef = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()  
    const length = 6;
    const inputRefs = useRef([]);

    const [otp, setOtp] = useState(new Array(length).fill(""));
    const [ correctOTP, setCorrectOTP ] = useState(null)
    const [timer, setTimer] = useState(0);
    const [ formData, setFormData ] = React.useState(
        { name: '', businessname: '', email: '', area: '', zipcode: '', password: '', c_password: '', logo: '', categories: [] }
    )

    const [ logo, setLogo ] = React.useState(null)
    const { loading, error } = useSelector(state =>state.vendor)
    const [ formError, setFormError ] = React.useState(null)
    const [warning, setWarning] = useState(null)
    
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

        const combinedOtp = otp.join("");

        if (combinedOtp.length != 6){
            setFormError('Enter Full OTP')
        }
        else if (correctOTP === combinedOtp){


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
                
                const res = await fetch('https://freshco-0dlm.onrender.com/api/vendor/auth/signup', {
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
                toast.success(`Welcome ${data.name} to ${data.businessName}!`)
                dispatch(vendorSigninSuccess(data))
                navigate('/inventory')
            }
            catch(err){
                dispatch(vendorSigninFailure(err))
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
        const mailformat = /(\W|^)[\w.+\-]*@gmail\.com(\W|$)/;

        const validateFormData = () => {
            if (!formData.name) return 'Must provide your name!';
            else if (!formData.businessname) return 'Must provide your store name!';
            else if (!logo) return 'Must provide your store logo!';
            else if (!formData.area) return 'Must provide your store area!';
            else if (!formData.zipcode) return 'Must provide your store area zipcode!';
            else if (formData.categories.length == 0) return 'At least select one category related to your store!'
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
            const res = await fetch('https://freshco-0dlm.onrender.com/api/vendor/auth/check-email', {
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
            dispatch(vendorSigninFailure(err))
        }
    }
    

    async function generateOTP(event){
        event? event.preventDefault() : null

        try{
            const res = await fetch('https://freshco-0dlm.onrender.com/api/vendor/auth/generate-otp', {
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
            dispatch(vendorSigninFailure(err))
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
                <h1>Create a virtual store</h1>
                <h5>Already have an account? <Link className='signin-link' to='/vendor/signin'>Signin</Link></h5>
            </div>

            <hr className='signup-line'/>

            <div className='signup-form-container'>
                <form className='signup-form'>

                    <input type='text' className='signup-input' placeholder='Name' onChange={updateData} name='name' value={formData.name} required />
                    <input type='text' className='signup-input' placeholder='Store Name' onChange={updateData} name='businessname' required value={formData.businessname} />
                    <div className='signup-input signin-logo-input' onClick={()=>logoRef.current.click()}>Choose your business logo</div>
                    <input type='file' ref={logoRef} hidden required onChange={ (e)=>updateLogoState(e.target.files[0]) } />
                    <input type='text' className='signup-input' placeholder='Area Name' onChange={updateData} name='area' required value={formData.area} />
                    <input type='number' className='signup-input number-input' placeholder='Zip Code' pattern="[0-9]{6}" onChange={updateData} required name='zipcode' value={formData.zipcode} />

                    <p className='input-head'>Select the categories available in your store.</p>

                    <div className='signin-select'>
                        {categoriesData.map((category, index) => (
                            <label key={index}>
                                <input 
                                    type='checkbox'
                                    value={category.main}
                                    checked={formData.categories.includes(category.main)}
                                    onChange={updateCategories}
                                />
                                &nbsp;&nbsp;
                                {category.main.replace(/-/g, ' ').replace(/\b\w/, char => char.toUpperCase())}
                            </label>
                        ))}
                    </div>

                    <p className='input-head'>Set password</p>

                    <input type='email' className='signup-input' placeholder='Email' onChange={updateData} required name='email' value={formData.email} />
                    <input type='password' className='signup-input' placeholder='Password' onChange={updateData} required name='password' value={formData.password} />
                    <input type='password' className='signup-input' placeholder='Confirm Password' onChange={updateData} required name='c_password' value={formData.c_password} />
                    
                    {formError && timer == 0 && <p style={{color: 'red', marginTop: '20px', textAlign: 'center'}}>{formError}</p>}

                    <div className='button-container'>
                        <button disable={loading? 'true' : 'undefined'} onClick={checkData} className='signup-button'>{loading? "Loading..." : "Create account" }</button>
                    </div>
                    <p className='signup-p'>By signing up, <br />
                    you agree to the FRESHCO <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
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



        // make sure you can upload upto 1 mb 

import Store from '../models/store_model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken' 
import nodemailer from 'nodemailer'


export const signup = async (req, res, next)=>{
    const { name, businessname, area, categories, logo, email, zipcode, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    if (password === "") return next(errorHandler(401, "Must Provide Password!"))
    const newStore = new Store({name, businessName: businessname, email, logo, area, categories, zipcode, password: hasedPass, products: []})
    try{
        await newStore.save()
        const validStore = await Store.findOne({email}) 
        const token = jwt.sign({id: validStore._id}, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validStore._doc
        res.cookie('access_token_store', token, {httpOnly: true}).status(200).json(rest)
    }catch(err){
        next(err);
    }
}
 
export const signin = async (req, res, next)=>{
    const { email, password } = req.body;
    try{
        const validStore = await Store.findOne({email}) 
        if(!validStore) return next(errorHandler(404, "User not found!"))
        const validPassword = bcryptjs.compareSync(password, validStore.password)
        if(!validPassword) return next(errorHandler(401, "Wrong credentials!"))

        const token = jwt.sign({id: validStore._id}, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validStore._doc
        res.cookie('access_token_store', token, {httpOnly: true}).status(200).json(rest)
    }
    catch(err){
        next(err)
    }
}

export const signout = async (req, res, next)=>{
    try{
        res.clearCookie('access_tocken_store');
        res.status(200).json("User has been log out!")
    }
    catch(err){
        next(err)
    }
}


export const checkEmail = async (req, res, next)=>{
    const { email } = req.body;
    try{
        const validUser = await Store.findOne({email}) 
        res.status(200).json({available : validUser? false : true})
    }
    catch(err){
        next(err)
    }
}


export const generateOTP = async (req, res, next)=>{
    const { email } = req.body;
    try{
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.COMPANY_MAIL,
                pass: process.env.MAIL_APP_PASSWORD
            }
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const mailOptions = {
            from: {
                name: "FRESHCO",
                address: process.env.COMPANY_MAIL
            },
            to: email,
            subject: 'OTP to verify Email',
            text: `Hello, Thank you for signing up with FRESHCO!
            
            Your one-time password (OTP) for email verification is:
            
            ${otp}
            
            Please enter this OTP on the verification page to complete your registration. This OTP is valid for a short period of time and can be used only once.
            If you did not request this OTP, please ignore this email.
            
            Best regards,
            The FRESHCO Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });

        res.status(200).json({message: `OTP sent to ${email}`, otp})
    }
    catch(err){
        next(err)
    }
}
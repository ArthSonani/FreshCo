import User from '../models/user_model.js'
import Cart from '../models/cart_model.js'
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'  


export const signup = async (req, res, next)=>{
    const { firstname, lastname, zipcode, area, email, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    const newUser = new User({firstname, lastname, zipcode, email, area, password: hasedPass})
    
    try{  
        await newUser.save()
        const validUser = await User.findOne({email}) 
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc
        res.cookie('access_token_user', token, {httpOnly: true}).status(200).json(rest)
        
    }catch(err){
        next(err);
    }
}

export const signin = async (req, res, next)=>{
    const { email, password } = req.body;
    try{
        const validUser = await User.findOne({email}) 
        if(!validUser) return next(errorHandler(404, "User not found!"))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) return next(errorHandler(401, "Wrong credentials!"))

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc
        res.cookie('access_token_user', token, {httpOnly: true}).status(200).json(rest)

    }
    catch(err){
        next(err)
    }
}

export const signout = async (req, res, next)=>{
    try{
        res.clearCookie('access_tocken_user');
        res.status(200).json("User has been log out!")
    }
    catch(err){
        next(err)
    }
}

export const updateZip = async (req, res, next)=>{
    const { zip, area, userId } = req.body;
    try{
        await User.updateOne({_id: userId}, {$set:{zipcode: zip, area}})
        const updatedUser = await User.find({_id : userId})
        res.status(200).json(updatedUser)
    }
    catch(err){
        next(err)
    }
}


export const checkEmail = async (req, res, next)=>{
    const { email } = req.body;
    try{
        const validUser = await User.findOne({email}) 
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
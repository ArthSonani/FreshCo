import User from '../models/user_model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'  


export const signup = async (req, res, next)=>{
    const { firstname, lastname, zipcode, email, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    if (password === "") return next(errorHandler(401, "Must Provide Password!"))
    const newUser = new User({firstname, lastname, zipcode, email, password: hasedPass})
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
        console.log(validPassword)

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
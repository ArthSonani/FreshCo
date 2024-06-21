import Vendor from '../models/vendor_model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken' 


export const signup = async (req, res, next)=>{
    const { name, businessname, email, zipcode, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    if (password === "") return next(errorHandler(401, "Must Provide Password!"))
    const newVendor = new Vendor({name, businessName: businessname, email, zipcode, password: hasedPass, products: []})
    try{
        await newVendor.save()
        const validVendor = await Vendor.findOne({email}) 
        const token = jwt.sign({id: validVendor._id}, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validVendor._doc
        res.cookie('access_token_vendor', token, {httpOnly: true}).status(200).json(rest)
        
    }catch(err){
        next(err);
    }
}

export const signin = async (req, res, next)=>{
    const { email, password } = req.body;
    try{
        const validVendor = await Vendor.findOne({email}) 
        if(!validVendor) return next(errorHandler(404, "User not found!"))
        const validPassword = bcryptjs.compareSync(password, validVendor.password)
        if(!validPassword) return next(errorHandler(401, "Wrong credentials!"))

        const token = jwt.sign({id: validVendor._id}, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validVendor._doc
        res.cookie('access_token_vendor', token, {httpOnly: true}).status(200).json(rest)

    }
    catch(err){
        next(err)
    }
}

export const signout = async (req, res, next)=>{
    try{
        res.clearCookie('access_tocken_vendor');
        res.status(200).json("User has been log out!")
    }
    catch(err){
        next(err)
    }
}
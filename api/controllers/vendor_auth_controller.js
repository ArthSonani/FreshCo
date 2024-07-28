import Store from '../models/store_model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken' 


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
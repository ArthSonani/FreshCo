import User from '../models/user_model.js'
import Cart from '../models/cart_model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'  


export const signup = async (req, res, next)=>{
    const { firstname, lastname, zipcode, area, email, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    const newUser = new User({firstname, lastname, zipcode, email, area, password: hasedPass})
    const newCart = new Cart({ user: newUser._id, products: [] });
    
    try{
        await newUser.save()
        await newCart.save();
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
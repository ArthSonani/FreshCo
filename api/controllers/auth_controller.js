import User from '../models/user_model.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req, res, next)=>{
    const { firstname, lastname, zipcode, email, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    const newUser = new User({firstname, lastname, zipcode, email, password: hasedPass})
    try{
        await newUser.save()
        res.status(201).json({ message: "Successfully created new user!" })
    }catch(err){
        next(err);
    }
    
}

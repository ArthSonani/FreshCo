import User from '../models/user_model.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req, res)=>{
    const { username, email, password } = req.body;
    const hasedPass = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hasedPass})
    try{
        await newUser.save()
        res.status(201).send("Well done budyy!!")
    }catch(err){
        res.status(500).send(err.message)
    }
    
    // console.log(req.body)
}

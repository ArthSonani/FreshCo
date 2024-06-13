import express from 'express'
import mongoose from 'mongoose'
import { mongodbURL, PORT } from './config.js'
import dotenv from 'dotenv'
import userRouter from './routes/user_route.js'
import authRouter from './routes/auth_route.js'

dotenv.config()


mongoose.connect(mongodbURL).then(()=>{
    console.log("Connected to MongoDB!!")
}).catch((err)=>{
    console.log(err)
})

const app = express();
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);



app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


app.listen(PORT, ()=>{
    console.log(`App is runing on ${PORT}!!`)
})
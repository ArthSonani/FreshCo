import express from 'express'
import mongoose from 'mongoose'
import { mongodbURL, PORT } from './config.js'

import userRouter from './routes/user_route.js'
import authRouter from './routes/auth_route.js'

mongoose.connect(mongodbURL).then(()=>{
    console.log("Connected to MongoDB!!")
}).catch((err)=>{
    console.log(err)
})

const app = express();
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);



app.listen(PORT, ()=>{
    console.log(`App is runing on ${PORT}!!`)
}
)
import express from 'express'
import mongoose from 'mongoose'
import { mongodbURL, PORT } from './config.js'

import userRouter from './routes/user_route.js'

mongoose.connect(mongodbURL).then(()=>{
    console.log("Connected to MongoDB!!")
}).catch((err)=>{
    console.log(err)
})

const app = express();

app.use('/api/user', userRouter);


app.listen(PORT, ()=>{
    console.log(`App is runing on ${PORT}!!`)
}
)
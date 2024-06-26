import express from 'express'
import mongoose from 'mongoose'
import { mongodbURL, PORT } from './config.js'
import dotenv from 'dotenv'

import userAuthRouter from './routes/user_auth_route.js'
import vendorAuthRouter from './routes/vendor_auth_route.js'
import productRouter from './routes/product_route.js'
import storeRouter from './routes/store_route.js'

dotenv.config()


mongoose.connect(mongodbURL).then(()=>{
    console.log("Connected to MongoDB!!")
}).catch((err)=>{
    console.log(err)
})

const app = express();
app.use(express.json());

app.use('/api/user/auth', userAuthRouter);
app.use('/api/vendor/auth', vendorAuthRouter);
app.use('/api/inventory', productRouter);  
app.use('/api/shop', storeRouter);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Proxy is working' });
});



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
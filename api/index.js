import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import userAuthRouter from './routes/user_auth_route.js'
import vendorAuthRouter from './routes/vendor_auth_route.js'
import productRouter from './routes/product_route.js'
import storeRouter from './routes/store_route.js'
import userRouter from './routes/user_route.js'
import paymentRouter from './routes/payment_route.js'

dotenv.config()

mongoose.connect(process.env.mongodbURL).then(()=>{
    console.log("Connected to MongoDB!!")
}).catch((err)=>{ 
    console.log(err)
})
 
const app = express();
app.use(express.json());

// Robust CORS: allow dev and prod frontends, support credentials/cookies
const allowedOrigins = [
    'http://localhost:5173',
    'https://fresh-co.vercel.app',
    'https://fresh-co-frontend.vercel.app',
    'https://fresh-co-backend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Allow non-browser clients
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests globally
app.options('*', cors());

app.use('/api/user/auth', userAuthRouter);
app.use('/api/vendor/auth', vendorAuthRouter); 
app.use('/api/inventory', productRouter);  
app.use('/api/shop', storeRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRouter)

app.get('/', (req, res)=>{
    res.send("FreshCo Backend is running!!")
})


app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(process.env.PORT, ()=>{
    console.log(`App is runing on ${process.env.PORT}!!`)
})
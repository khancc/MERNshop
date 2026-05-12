import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import walletRouter from './routes/walletRoute.js';
import "./models/reviewModel.js";

//app config
const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// api endpoints
app.use("/api/product", productRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin/wallet", walletRouter);

app.get('/', (req, res)=>{
    res.send('API is running...')
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
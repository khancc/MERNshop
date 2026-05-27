import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://truongkhanga_db_user:truongkhang123@cluster0.9lolsjz.mongodb.net/mernshop?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
}
import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb://voductuan1305:user123@ac-xpaweu3-shard-00-00.dypzsvo.mongodb.net:27017,ac-xpaweu3-shard-00-01.dypzsvo.mongodb.net:27017,ac-xpaweu3-shard-00-02.dypzsvo.mongodb.net:27017/MERNShop?replicaSet=atlas-35wrth-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("MongoDB connected...")).catch((err) => console.log(err));
}

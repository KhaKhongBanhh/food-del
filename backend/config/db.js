import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://traungo456:admin@cluster0.rj0r81m.mongodb.net/food-delivery').then(() => 
        console.log("MongoDB connected successfully"))
}
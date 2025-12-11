import mongoose from "mongoose";

export const connectToDB = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => console.log('db connected successfully.')).catch((e) => console.log(e.message));
}
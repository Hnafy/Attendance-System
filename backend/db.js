import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
let URI = process.env.MONGO_URI;
const connection = () => {
  if (!URI) {
    console.error("❌ MONGODB_URI is not defined");
    return;
  }
  try{
    mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("✅ Connected to MongoDB");
  }catch(err){
    console.error("Connection error:", err);
    console.error("❌ Bad connection to MongoDB:", err.message);
  }
};

export default connection;

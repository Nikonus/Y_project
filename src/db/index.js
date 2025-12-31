import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";


const  connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("Mongodb connected successfully")
        console.log(`Mongodb connected to host: ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("Mongodb ERROR", error)
        process.exit(1)        
    }
}

export default connectDB;
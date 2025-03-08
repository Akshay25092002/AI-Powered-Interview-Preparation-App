import mongoose from "mongoose";

const connectToMongo = async () => {
    const mongoURI = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully.");

    } catch (error) {
        console.error("MongoDB connected error: ", error);
        process.exit(1);
    }

}

export default connectToMongo;
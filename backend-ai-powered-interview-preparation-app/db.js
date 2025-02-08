import mongoose from "mongoose";

const mongoURI = "mongodb://localhost:27017/?directConnection=true";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully.");

    } catch (error) {
        console.error("MongoDB connected error: ", error);
        process.exit(1);
    }

}

export default connectToMongo;
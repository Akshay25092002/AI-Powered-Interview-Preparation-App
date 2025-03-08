import express from "express";
import cors from "cors"
import connectToMongo from "./db.js";
import authUser from "./routes/auth.js"
import env from "dotenv"


const app = express();
env.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectToMongo();

app.use("/api/auth", authUser);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
import express from "express";
import cors from "cors"
import connectToMongo from "./db.js";
import authUser from "./routes/auth.js"


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

connectToMongo();

app.use("/api/auth", authUser);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
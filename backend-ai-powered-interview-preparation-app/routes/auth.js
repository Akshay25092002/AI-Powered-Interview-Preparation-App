import express from 'express';
import User from '../models/User.js';

const router = express.Router();

//1.Endpoint:
router.get('/getuser', async (req, res) => {

    try {
        const userId = req.query.id
        const users = await User.findOne({ id: userId });
        res.send(users);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
});

//2. Endpoint:
router.post("/adduser", async (req, res) => {

    try {
        const { id, name, email, imageUrl } = req.body;

        const users = new User({
            id, name, email, imageUrl
        });
        const savedUser = await users.save();
        res.json(savedUser);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
});

export default router;
import express from 'express';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Answer from '../models/Answer.js';

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

//3.Endpoint:
// router.get("/getinterview", async (req, res) => {

//     try {
//         const { id } = req.query; // Get ID from query params

//         if (!id) {
//             return res.status(400).json({ error: "Interview ID is required" });
//         }
//         const interview = await Interview.findById(id); // Fetch from MongoDB

//         if (!interview) return res.status(404).json({ error: "Interview not found" });

//         res.status(200).json(interview);

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server error occured.")
//     }
// });

///////////
router.post("/createInterview", async (req, res) => {

    try {
        const { userId, questions, ...data } = req.body;

        let user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let newInterview = await Interview.create({
            id: userId,
            questions: questions,
            ...data,
            userId: user._id,
        });
        console.log("Interview Created:", newInterview);

        return res.status(201).json(newInterview);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
});

//Update
router.put("/updateInterview", async (req, res) => {
    try {
        const { id, ...updateData } = req.body; // Extract _id from request

        if (!id) {
            return res.status(400).json({ error: "Interview ID is required" });
        }

        // 🔹 Find and update the interview by _id
        const updatedInterview = await Interview.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedInterview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        res.status(200).json(updatedInterview);
    } catch (error) {
        console.error("Error updating interview:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//by InterviewId
router.get("/getinterview", async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: "Missing interview ID" });

        const interview = await Interview.findById(id); // Fetch by `_id`
        if (!interview) return res.status(404).json({ error: "Interview not found" });

        res.status(200).json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//by user id
router.get("/getinterviews", async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const interviews = await Interview.find({ id }); // Fetch all interviews for this user
        res.status(200).json(interviews);
    } catch (error) {
        console.error("Error fetching interviews:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//answer -check
// ✅ Check if user has already answered the question
router.get("/answer/check", async (req, res) => {
    try {
        const { userId, question } = req.query;

        if (!userId || !question) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const existingAnswer = await Answer.findOne({ id: userId, question });

        res.json({ exists: !!existingAnswer });
    } catch (error) {
        console.error("Error checking answer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Save User's Answer
router.post("/answer/save", async (req, res) => {
    try {
        const { userId, interviewIdRef, question, correct_ans, user_ans, feedback, rating } = req.body;

        if (!userId || !question || !user_ans) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        let user = await User.findOne({ id: userId });

        const newAnswer = new Answer({
            id: userId,
            interviewIdRef,
            question,
            correct_ans,
            user_ans,
            feedback,
            rating,
            userId: user._id,
        });

        await newAnswer.save();

        res.status(201).json({ message: "Answer saved successfully" });
    } catch (error) {
        console.error("Error saving answer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Fetch feedbacks based on userId and mockIdRef
router.get("/answers/get", async (req, res) => {
    try {
        const { userId, interviewIdRef } = req.query;

        if (!userId || !interviewIdRef) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        // ✅ Find all answers for the user and interview
        const feedbacks = await Answer.find({ id: userId, interviewIdRef: interviewIdRef });

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;
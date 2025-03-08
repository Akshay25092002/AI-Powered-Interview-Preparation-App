import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AnswerSchema = new Schema(
    {
        id: {
            type: String, // Firebase UID or any unique user identifier
        },
        userId: {
            type: Schema.Types.ObjectId, // ObjectId to reference users
            ref: "users", // from "users" collection
        },
        interviewIdRef: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Mock Interview
            ref: "interviews", // Assuming a MockInterview model exists
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        correct_ans: {
            type: String,
            required: true,
        },
        user_ans: {
            type: String,
            required: true,
        },
        feedback: {
            type: String, // AI-generated feedback
            required: true,
        },
        rating: {
            type: Number, // AI-generated rating (1-10)
            required: true,
            min: 1,
            max: 10,
        },
    },
    { timestamps: true }
);

const Answer = model("Answer", AnswerSchema);
export default Answer;

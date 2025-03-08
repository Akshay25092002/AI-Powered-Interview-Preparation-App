import mongoose from "mongoose";

const { Schema, model } = mongoose;

const InterviewSchema = new Schema({
    id: {
        type: String,
    },
    position: {
        type: String,
    },
    description: {
        type: String,
    },
    experience: {
        type: Number,
    },
    userId: {
        type: Schema.Types.ObjectId, // ObjectId to reference users
        ref: "users", // from "users" collection
    },
    techStack: {
        type: String,
    },
    questions: [{
        question: {
            type: String,
        },
        answer: {
            type: String,
        },
    }],
}, { timestamps: true });

const Interview = model("interviews", InterviewSchema);
export default Interview;
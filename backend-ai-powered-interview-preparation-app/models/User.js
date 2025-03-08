import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const User = model("users", UserSchema);
export default User;
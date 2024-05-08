import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    secreteKey: {
        type: String,
        required: true,
    },
    category: {
        type: String,

        default: 'uncategorized',
    },
    registerNumber: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    isEmployee: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
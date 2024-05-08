import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'teacher'], // Expanded roles
        default: 'user' // Default role for new users
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;

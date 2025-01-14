const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'], // Roles
        required: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true // This will allow `null` or missing values without violating the unique constraint
    },
    usn: {
        type: String,
        required: function () {
            return this.role === 'student'; // Required only for students
        },
        unique: function () {
            return this.role === 'student'; // Unique for students
        },
        trim: true
    },
    dob: {
        type: Date,
        required: function () {
            return this.role === 'teacher' || this.role === 'student'; // Required for teachers and students
        }
    },
    email: {
        type: String,
        required: function () {
            return this.role === 'admin'; // Required only for admins
        },
        unique: function () {
            return this.role === 'admin'; // Unique for admins
        },
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: function () {
            return this.role === 'admin'; // Required only for admins
        },
        minlength: [6, 'Password must be at least 6 characters long']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;

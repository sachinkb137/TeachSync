const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'], // Roles
        required: true
    },
    // Fields specific to students
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
    // Fields specific to teachers and students
    dob: {
        type: Date,
        required: function () {
            return this.role === 'teacher' || this.role === 'student'; // Required for both teachers and students
        }
    },
    // Fields specific to admins
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

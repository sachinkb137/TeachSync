const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        unique: true, // Ensures each USN is unique
        trim: true // Removes leading/trailing spaces
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectType: {
        type: String,
        required: true,
        enum: ['Theory', 'Lab', 'Elective'],  // Validates the subject type
    },
    subjectName: {
        type: String,
        required: true,  // Subject name is required
    },
    subjectCode: {
        type: String,
        required: true,
        unique: true,  // Ensures unique subject codes
    },
    semester: {
        type: Number,
        required: true,
        min: 1,  // Semester must be between 1 and 8
        max: 8,
    },
    teachingHoursPerWeek: {
        type: Number,
        required: true,
        min: 1,  // Minimum teaching hours per week is 1
    },
    credits: {
        type: Number,
        required: true,
        min: 1,  // Minimum credits for a subject is 1
    },
    department: {
        type: String,
        required: true,  // Department is required
    },
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Creating the model based on the schema
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;

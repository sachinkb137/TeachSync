const mongoose = require('mongoose');

const ElectiveAssignmentSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    teacherNames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }], 
    department: { type: String },
    semester: { type: String },
    teacherPreferences: { type: String }
});

const ElectiveAssignment = mongoose.model('ElectiveAssignment', ElectiveAssignmentSchema);

module.exports = ElectiveAssignment;

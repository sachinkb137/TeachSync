const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    classroomCode: {
        type: String,
        required: true,
        unique: true // Ensure the classroomCode is unique
    }
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;

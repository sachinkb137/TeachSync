const mongoose = require('mongoose');

const AssignClassroomSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    classroomCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true,
    },
});

module.exports = mongoose.model('AssignClassroom', AssignClassroomSchema);
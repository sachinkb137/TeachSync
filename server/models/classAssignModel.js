const mongoose = require('mongoose');

const assignClassroomSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  classroomCode: {
    type: mongoose.Schema.Types.ObjectId, // Corrected to ObjectId for referencing another model
    ref: 'Classroom', // Refers to the Classroom model
    required: true
  }
});

const AssignClassroom = mongoose.model('AssignClassroom', assignClassroomSchema);

module.exports = AssignClassroom;

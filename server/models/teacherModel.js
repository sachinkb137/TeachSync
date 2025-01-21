//models/teacherModel.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true
  },
  teacherID: {
    type: String,
    required: true,
    unique: true
  },
  designation: {
    type: String,
    required: true
  },
  subjectSpecialization: {
    type: String,
    required: false
  }

});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

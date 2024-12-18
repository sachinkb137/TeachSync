const mongoose = require('mongoose');

const labSubjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  teacherName: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  department: { type: String },
  semester: { type: String },
  labsPerWeek: { type: Number, required: true }
});

const LabSubject = mongoose.model('LabSubject', labSubjectSchema);

module.exports = LabSubject;

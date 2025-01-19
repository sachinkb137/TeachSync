const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectType: { type: String, required: true },
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  semester: { type: Number, required: true },
  teachingHoursPerWeek: { type: Number, required: true },
  credits: { type: Number, required: true },
  department: { type: String, required: true },
});

// // Create a compound unique index
// subjectSchema.index({ subjectCode: 1, department: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;

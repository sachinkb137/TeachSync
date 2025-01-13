const mongoose = require('mongoose');

// Define time slot schema without room-related data
const timeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  }
});

// Define timetable schema with the slots containing the time slots, no room field included
const timeTableSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  department: {
    type: String,
    required: true
  },
  slots: [timeSlotSchema], // Slots will only contain the subject, teacher, and timing details
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create the model
const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;

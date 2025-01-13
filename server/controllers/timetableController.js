
// Subjects 
const Subject = require('../models/subjectModel');

// Teacher
const Teacher = require('../models/teacherModel');

//Classroom
const Classroom = require('../models/classroomModel')

// Assign Theory,Lab,Electives
const TheoryAssignment = require('../models/assignSubjectsModel');

// Assignn Classrooms
const AssignClassroom = require('../models/classAssignModel')


const { response } = require('express');
//subject
exports.addSubject = async (req, res) => {
    console.log("Received data:", req.body);
    try {
      const {
        subjectType,
        subjectName,
        subjectCode,
        semester,
        teachingHoursPerWeek,
        credits,
        department,
      } = req.body;
  
      // Validate subjectType
      if (!['Theory', 'Lab', 'Elective'].includes(subjectType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subjectType. Allowed values are 'Theory', 'Lab', and 'Elective'.",
        });
      }
  
      // Check if the subject already exists in the same department
      const existingSubject = await Subject.findOne({
        subjectCode,
        department,
        subjectType,
        subjectName,
        semester,
        credits,
      });
  
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: `Subject with the same code "${subjectCode}" already exists in the "${department}" department.`,
        });
      }
  
      // Create and save the new subject document
      const newSubject = new Subject({
        subjectType,
        subjectName,
        subjectCode,
        semester,
        teachingHoursPerWeek,
        credits,
        department,
      });
  
      await newSubject.save();
  
      res.status(201).json({
        success: true,
        message: "Subject added successfully.",
        data: newSubject,
      });
    } catch (error) {
      console.error("Error adding subject:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  
exports.fetchSubject = async (req, res) => {
    try {
        const subjects = await Subject.find();  // Fetch all subjects from the database
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error("Error fetching subjects:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const subjectId = req.params.id;
        console.log("Deleting subject with ID:", subjectId);

        // Find and delete the subject by ID
        const deletedSubject = await Subject.findByIdAndDelete(subjectId);
        if (!deletedSubject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({ success: true, data: deletedSubject });

    } catch (error) {
        console.error("Error deleting subject:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};




// Teacher

exports.addTeacher = async (req, res) => {
    try {
        const { teacherName, teacherID, designation } = req.body;
        if (!teacherName || !teacherID || !designation) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const newTeacher = await Teacher.create({ teacherName, teacherID, designation });
        res.status(201).json({ success: true, data: newTeacher });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Teacher ID must be unique." });
        }
        console.error("Error adding teacher:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.fetchTeacher = async (req, res) => {
    try {
        const teachers = await Teacher.find({});
        res.status(200).json({ success: true, data: teachers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        console.log(teacherId, "this is the id");
        
        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
        if (!deletedTeacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        
        res.status(200).json({ success: true, data: deletedTeacher });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



//ClassRooms


exports.addClassroom = async (req, res) => {
    console.log(req.body);
    try {
        const { classroomCode } = req.body;

        // Validate the classroom code
        if (!classroomCode) {
            return res.status(400).json({ success: false, message: "Classroom code is required" });
        }

        // Create a new classroom
        const classroom = new Classroom({ classroomCode });
        await classroom.save();

        res.status(201).json({ success: true, message: 'Classroom added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.fetchClassroom = async (req, res) => {
    try {
        // Fetch all classrooms
        const fetchClassrooms = await Classroom.find({});
        res.status(200).json({ success: true, data: fetchClassrooms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteClassroom = async (req, res) => {
    try {
        const classroomID = req.params.id;
        console.log(classroomID, "This is the classroom id");

        // Delete the classroom by ID
        const deletedClassroom = await Classroom.findByIdAndDelete(classroomID);
        if (!deletedClassroom) {
            return res.status(404).json({ success: false, message: "Classroom not found" });
        }

        res.status(200).json({ success: true, data: deletedClassroom });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Theory Assign

exports.createAssignment = async (req, res) => {
    try {
        const { subjectId, teacherId } = req.body;
        console.log(subjectId)
        const assignment = new TheoryAssignment({ subjectId, teacherId });
        await assignment.save();
        res.status(201).send(assignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).send('Error creating assignment');
    }
};

exports.fetchassignments = async (req, res) => {
    try {
        const fetchassignments = await TheoryAssignment.find({}).populate('subjectId').populate('teacherId').exec();
        res.status(201).json({ success: true, data: fetchassignments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.DeleteAssignments = async (req, res) => {
    try {
        const AssignmentId = req.params.id;
        console.log(AssignmentId, "this is the theory assignment id")
        const deletedAssignments = await TheoryAssignment.findByIdAndDelete({ _id: AssignmentId });
        if (!deletedAssignments) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        res.status(200).json({ success: true, data: deletedAssignments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Elective Subjects

exports.AddElective = async (req, res) => {
    try {
        const { subjectId, teacherId } = req.body;
        console.log(teacherId)
        const assignment = new TheoryAssignment({ subjectId, teacherId });
        await assignment.save();
        res.status(201).send(assignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).send('Error creating assignment');
    }
};


exports.fetchelectives = async (req, res) => {
    try {
        const fetchElectives = await TheoryAssignment.find({}).populate('subjectId teacherId').exec();
        res.status(201).json({ success: true, data: fetchElectives });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.DeleteElective = async (req, res) => {
    try {
        const ElectiveId = req.params.id;
        console.log(ElectiveId, "this is the elective assignment id")
        const deletedElectives = await TheoryAssignment.findByIdAndDelete({ _id: ElectiveId });
        if (!deletedElectives) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }
        res.status(200).json({ success: true, data: deletedElectives });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Lab Subjects

exports.AddLab = async (req, res) => {
    try {
        const { subjectId, teacherId } = req.body;
        console.log(subjectId)
        const assignment = new TheoryAssignment({ subjectId, teacherId });
        await assignment.save();
        res.status(201).send(assignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).send('Error creating assignment');
    }
};

exports.fetchLabs = async (req, res) => {
    try {
        const fetchLabs = await TheoryAssignment.find({}).populate('subjectId teacherId').exec();;
        res.status(201).json({ success: true, data: fetchLabs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Controller function to assign classroom

// Assign classroom


exports.assignClassRoom = async (req, res) => {
    console.log("Request Body:", req.body);  // Log the request body for debugging
    try {
        const { course, semester, classroom } = req.body;

        // Validate required fields
        if (!course || !semester || !classroom || !classroom.classroomCode) {
            console.log("Validation Error: Missing required fields");
            return res.status(400).json({ success: false, message: "All fields (course, semester, and classroom) are required" });
        }

        const classroomCode = classroom.classroomCode;
        console.log(`Assigning classroom: Course: ${course}, Semester: ${semester}, Classroom Code: ${classroomCode}`);
        
        // Check if classroomCode exists in the Classroom collection
        const classroomExists = await Classroom.findOne({ classroomCode });
        if (!classroomExists) {
            console.log("Validation Error: Classroom with this code does not exist");
            return res.status(404).json({ success: false, message: "Classroom with this code does not exist" });
        }

        // Create a new classroom assignment without section
        const newClassroomAssignment = new AssignClassroom({ 
            course, 
            semester, 
            classroomCode: classroomExists._id // Use the ObjectId of the classroom
        });

        await newClassroomAssignment.save();
        res.status(201).json({ success: true, message: 'Classroom assigned successfully', data: newClassroomAssignment });
    } catch (error) {
        console.error('Error assigning classroom:', error);
        res.status(500).json({ success: false, error: 'Failed to assign classroom' });
    }
};

// Fetch all classroom assignments
exports.fetchClassRooms = async (req, res) => {
    try {
        const classroomAssignments = await AssignClassroom.find().populate('classroomCode', 'classroomCode');
        res.status(200).json({ success: true, data: classroomAssignments });
    } catch (error) {
        console.error('Error fetching classroom assignments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch classroom assignments' });
    }
};

// Remove a classroom assignment
exports.removeClassRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the classroom assignment by ID
        const deletedAssignment = await AssignClassroom.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return res.status(404).json({ success: false, message: 'Classroom assignment not found' });
        }

        return res.status(200).json({ success: true, message: 'Classroom assignment deleted successfully' });
    } catch (error) {
        console.error('Error deleting classroom assignment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
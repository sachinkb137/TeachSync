
// const express = require('express');
// const timetableRouter = express.Router();
// const { addSubject, fetchSubject, deleteSubject, addTeacher, fetchTeacher, deleteTeacher, addClassroom, fetchClassroom, deleteClassroom, createAssignment, fetchassignments, DeleteAssignments, AddElective, fetchelectives, DeleteElective, AddLab, fetchLabs, assignClassRoom, fetchClassRooms, removeClassRoom } = require('../controllers/timetableController');
// // const {generate } from '../controllers/generate.js';
// const { generateTimetableForAllSemesters } = require('../controllers/server.js')
// // const { generateTimetableForAllSemesters } = require('../controllers/timetable');

// // Subjects Routing
// timetableRouter.post('/addsubjects', addSubject);
// timetableRouter.get('/fetchsubjects', fetchSubject);
// timetableRouter.delete('/deletesubject/:id', deleteSubject);
// // timetableRouter.delete('/deletesubject/:id', deleteSubject);


// // Teachers Routing
// timetableRouter.post('/teachers', addTeacher);
// timetableRouter.get('/fetchteachers', fetchTeacher);
// timetableRouter.delete('/deleteteacher/:id', deleteTeacher);
 
// //ClassRooms Routing
// timetableRouter.post('/classrooms', addClassroom);
// timetableRouter.get("/fetchclassroom", fetchClassroom)
// timetableRouter.delete('/deleteClassroom/:id', deleteClassroom)

// // Theory Assign
// timetableRouter.post('/theoryassignments', createAssignment);
// timetableRouter.get('/fetchassignments', fetchassignments);
// timetableRouter.delete('/deleteAssignments/:id', DeleteAssignments);

// // Electives Assign
// timetableRouter.post('/electiveassignments', AddElective);
// timetableRouter.get('/fetchelective', fetchelectives)
// timetableRouter.delete('/deleteelective/:id', DeleteElective)

// // Lab  assign 
// timetableRouter.post('/labassignments', AddLab);
// timetableRouter.get('/fetchlabs', fetchLabs);

// // Classrooms Assign
// timetableRouter.post('/assignclassrooms', assignClassRoom);
// timetableRouter.get('/fetchclassrooms', fetchClassRooms);
// timetableRouter.delete('/removeclassroom/:id', removeClassRoom);
// // timetableRouter.get('/generate', generate);


// timetableRouter.get('/generateTimeTable', generateTimetableForAllSemesters);

// module.exports = timetableRouter;
const express = require('express');
const timetableRouter = express.Router();

const {
    addSubject,
    fetchSubject,
    deleteSubject,
    addTeacher,
    fetchTeacher,
    deleteTeacher,
    addClassroom,
    fetchClassroom,
    deleteClassroom,
    createAssignment,
    fetchassignments,
    DeleteAssignments,
    AddElective,
    fetchelectives,
    DeleteElective,
    AddLab,
    fetchLabs,
    assignClassRoom,
    fetchClassRooms,
    removeClassRoom,
} = require('../controllers/timetableController');

const { generateTimetableForAllSemesters } = require('../controllers/server.js');

// Subjects Routes
timetableRouter.post('/subjects', addSubject);
timetableRouter.get('/subjects', fetchSubject);
timetableRouter.delete('/subjects/:id', deleteSubject);

// Teachers Routes
timetableRouter.post('/teachers', addTeacher);
timetableRouter.get('/teachers', fetchTeacher);
timetableRouter.delete('/teachers/:id', deleteTeacher);

// Classrooms Routes
timetableRouter.post('/classrooms', addClassroom);
timetableRouter.get('/classrooms', fetchClassroom);
timetableRouter.delete('/classrooms/:id', deleteClassroom);

// Theory Assignments Routes
timetableRouter.post('/theory-assignments', createAssignment);
timetableRouter.get('/theory-assignments', fetchassignments);
timetableRouter.delete('/theory-assignments/:id', DeleteAssignments);

// Elective Assignments Routes
timetableRouter.post('/elective-assignments', AddElective);
timetableRouter.get('/elective-assignments', fetchelectives);
timetableRouter.delete('/elective-assignments/:id', DeleteElective);

// Lab Assignments Routes
timetableRouter.post('/lab-assignments', AddLab);
timetableRouter.get('/lab-assignments', fetchLabs);

// Classroom Assignments Routes
timetableRouter.post('/classroom-assignments', assignClassRoom);
timetableRouter.get('/classroom-assignments', fetchClassRooms);
timetableRouter.delete('/classroom-assignments/:id', removeClassRoom);

// Timetable Generation Route
timetableRouter.get('/generate-timetable', generateTimetableForAllSemesters);

module.exports = timetableRouter;

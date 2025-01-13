const express = require('express');
const router = express.Router();
const { generateAllTimeTables, getTimeTable } = require('../controllers/server');

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


// Subjects Routes
router.post('/subjects', addSubject);
router.get('/subjects', fetchSubject);
router.delete('/subjects/:id', deleteSubject);

// Teachers Routes
router.post('/teachers', addTeacher);
router.get('/teachers', fetchTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Classrooms Routes
router.post('/classrooms', addClassroom);
router.get('/classrooms', fetchClassroom);
router.delete('/classrooms/:id', deleteClassroom);

// Theory Assignments Routes
router.post('/theory-assignments', createAssignment);
router.get('/theory-assignments', fetchassignments);
router.delete('/theory-assignments/:id', DeleteAssignments);

// Elective Assignments Routes
router.post('/elective-assignments', AddElective);
router.get('/elective-assignments', fetchelectives);
router.delete('/elective-assignments/:id', DeleteElective);

// Lab Assignments Routes
router.post('/lab-assignments', AddLab);
router.get('/lab-assignments', fetchLabs);

// Classroom Assignments Routes
router.post('/classroom-assignments', assignClassRoom);
router.get('/classroom-assignments', fetchClassRooms);
router.delete('/classroom-assignments/:id', removeClassRoom);

const Subject = require('../models/subjectModel');

// Get unique departments
router.get('/departments', async (req, res) => {
    try {
        const departments = await Subject.distinct('department');
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Get unique semesters
router.get('/semesters', async (req, res) => {
    try {
        const semesters = await Subject.distinct('semester');
        res.status(200).json(semesters);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch semesters' });
    }
});

router.post('/timetable/generate-all', generateAllTimeTables);
router.get('/timetable', getTimeTable);
module.exports = router;

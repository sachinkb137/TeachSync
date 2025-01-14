const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');
const User = require('../models/userModel');  // To handle dob validation

// Sign-in route
router.post('/signin', (req, res) => {
    console.log("Sign-In Request Body:", req.body);
    const { signInType } = req.body;

    if (signInType === "admin") {
        authController.adminSignIn(req, res);
    } else if (signInType === "teacher") {
        authController.teacherSignIn(req, res);
    } else if (signInType === "student") {
        authController.studentSignIn(req, res);
    } else {
        res.status(400).json({ message: 'Invalid sign-in type' });
    }
});

// Route to fetch a specific teacher by ID
router.get('/fetchteachers/:teacherID', async (req, res) => {
    try {
        const { teacherID } = req.params;
        const teacher = await Teacher.findOne({ teacherID });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Fetch dob from user model
        const user = await User.findOne({ username: teacherID });
        if (!user) {
            return res.status(404).json({ message: 'Teacher user details not found' });
        }

        res.status(200).json({ teacher, dob: user.dob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch a specific student by USN
router.get('/fetchstudents/:usn', async (req, res) => {
    try {
        const { usn } = req.params;
        const student = await Student.findOne({ usn });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Fetch dob from user model
        const user = await User.findOne({ username: usn });
        if (!user) {
            return res.status(404).json({ message: 'Student user details not found' });
        }

        res.status(200).json({ student, dob: user.dob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

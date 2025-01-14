const User = require('../models/userModel'); // Unified User model
const Teacher = require('../models/teacherModel'); // Teacher model

exports.adminSignIn = async (req, res) => {
  try {
      console.log("Admin Sign-In Request Body:", req.body);

      const { email, password } = req.body;
      const admin = await User.findOne({ email, role: 'admin' });

      if (!admin) {
          console.log("Admin not found or role mismatch");
          return res.status(401).json({ message: 'Invalid email or role' });
      }

      // Direct password comparison (insecure)
      if (password !== admin.password) {
          console.log("Password mismatch for email:", email);
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.status(200).json({ message: 'Admin sign in successful', user: admin });
  } catch (error) {
      console.error("Admin Sign-In Error:", error);
      res.status(500).json({ message: error.message });
  }
};

exports.studentSignIn = async (req, res) => {
  try {
    const { usn, dob } = req.body;

    // Find the student in the user model using usn
    const student = await User.findOne({ usn, role: 'student' }); // Ensure 'role' matches

    if (!student) {
      return res.status(401).json({ message: 'Invalid student USN' });
    }

    // Validate the date of birth (dob) from the user model
    if (dob && dob !== student.dob.toISOString().split('T')[0]) {
      return res.status(401).json({ message: 'Invalid date of birth' });
    }

    res.status(200).json({ message: 'Student sign in successful', user: student });
  } catch (error) {
    console.error("Student Sign-In Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.teacherSignIn = async (req, res) => {
  try {
    const { teacherID } = req.body;

    // Step 1: Find the teacher in the teacher model using teacherID
    const teacher = await Teacher.findOne({ teacherID });

    if (!teacher) {
      return res.status(401).json({ message: 'Invalid teacher ID' });
    }

    // Step 2: No need to query the User model anymore, since teacherID is already in the Teacher model
    // We will just return the teacher's details

    res.status(200).json({ message: 'Teacher sign in successful', user: teacher });
  } catch (error) {
    console.error("Teacher Sign-In Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// const User = require('../models/userModel');

// exports.signIn = async (req, res) => {
//   try {
//     console.log(req.body)
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     res.status(200).json({ message: 'Sign in successful', user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const Admin = require('../models/userModel');
const Teacher = require('../models/teacherModel');

// exports.adminSignIn = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email, password });
//     if (!admin) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     res.status(200).json({ message: 'Admin sign in successful', user: admin });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.adminSignIn = async (req, res) => {
  try {
      console.log("Admin Sign-In Request Body:", req.body);

      const { email, password } = req.body;
      const admin = await Admin.findOne({ email, role: 'admin' });

      if (!admin) {
          console.log("Admin not found or role mismatch");
          return res.status(401).json({ message: 'Invalid email or role' });
      }

      // Direct password comparison (DO NOT use in production, it's insecure)
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




exports.teacherSignIn = async (req, res) => {
  try {
    const { teacherID } = req.body;
    const teacher = await Teacher.findOne({ teacherID });
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid teacher ID' });
    }
    res.status(200).json({ message: 'Teacher sign in successful', user: teacher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.studentSignIn = async (req, res) => {
  try {
    const { usn } = req.body;
    const student = await student.findOne({ usn });
    if (!student) {
      return res.status(401).json({ message: 'Invalid student usn' });
    }
    res.status(200).json({ message: 'Student sign in successful', user: student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
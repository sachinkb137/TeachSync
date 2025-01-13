const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors'); // Import cors package
app.use(express.json());

const mongoose = require('mongoose');
// const mongoURI = 'mongodb://localhost:27017/Automatic_TimeTable_Generator';
const mongoURI = process.env.MONGO_URL;

// Allow requests from the frontend server (change this port if necessary)
app.use(cors({ origin: 'http://localhost:3000' }));  // Assuming frontend is running on port 3000

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const timetableRoutes = require('./routes/timetableRoute');
const authRoutes = require('./routes/authRoutes');


// Set up routes
app.use('/api', authRoutes);
app.use('/api', timetableRoutes);

const PORT = process.env.PORT || 5001;  // Backend port set to 5001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const TimeTable = require('../models/timetableModel');
const Subject = require('../models/subjectModel');
const Teacher = require('../models/teacherModel');
const AssignSubjects = require('../models/assignSubjectsModel');
const TimeTableGeneticAlgorithm = require('../utils/geneticAlgorithm');

exports.generateAllTimeTables = async (req, res) => {
  try {
    // Fetch all departments and semesters
    const departments = await Subject.distinct('department');
    const semesters = await Subject.distinct('semester');

    // Validate if there are departments and semesters to process
    if (!departments.length || !semesters.length) {
      return res.status(400).json({
        success: false,
        error: 'No departments or semesters found for timetable generation',
      });
    }

    const teachers = await Teacher.find();
    const assignments = await AssignSubjects.find();

    // Iterate over all department and semester combinations
    for (const department of departments) {
      for (const semester of semesters) {
        // Fetch subjects for the current department and semester
        const subjects = await Subject.find({ department, semester });

        if (!subjects.length) {
          console.log(`No subjects found for department ${department}, semester ${semester}`);
          continue;
        }

        // Initialize genetic algorithm
        const ga = new TimeTableGeneticAlgorithm(subjects, teachers, assignments);

        // Generate timetable
        const solution = ga.evolve();

        // Save the generated timetable
        const timeTable = new TimeTable({
          department,
          semester,
          slots: solution,
          isActive: true,
        });

        await timeTable.save();
        console.log(`Generated timetable for department ${department}, semester ${semester}`);
      }
    }

    res.status(201).json({
      success: true,
      message: 'All timetables generated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getTimeTable = async (req, res) => {
    try {
        const { department, semester } = req.query;

        const timeTable = await TimeTable.findOne({
            department,
            semester,
            isActive: true,
        })
            .populate('slots.subject')
            .populate('slots.teacher');

        if (!timeTable) {
            return res.status(404).json({
                success: false,
                error: 'Timetable not found',
            });
        }

        // Remove room data before sending the response
        const timeTableWithoutRoom = timeTable.slots.map(slot => {
            const { room, ...rest } = slot.toObject(); // Exclude room field
            return rest;
        });

        res.status(200).json({
            success: true,
            data: {
                ...timeTable.toObject(),
                slots: timeTableWithoutRoom,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

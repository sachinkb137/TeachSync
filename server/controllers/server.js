const Subject = require('../models/subjectModel');
const Teacher = require('../models/teacherModel');
const TheoryAssignment = require('../models/assignSubjectsModel');
const LabAssignment = require('../models/assignSubjectsModel');
const ElectiveAssignment = require('../models/assignSubjectsModel');

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize teacher availability object
let teacherAvailability = {};

// Function to initialize teacher availability
async function initializeTeacherAvailability() {
    const teachers = await Teacher.find();
    const numberOfDays = 6; // Monday to Saturday
    const periodsPerDay = 8; // 8 periods per day for weekdays

    teacherAvailability = {}; // Reset the availability at the start
    for (const teacher of teachers) {
        teacherAvailability[teacher.teacherName] = Array.from({ length: numberOfDays }, () => Array(periodsPerDay).fill(true));
    }
}

// Function to check if a teacher is available at the given day and period across all semesters
function teacherAvailable(teacherName, day, period, isLab = false) {
    // Check if the period overlaps with breaks
    if (isWithinBreakPeriod(day, period)) {
        return false; // Can't schedule during breaks
    }

    if (isLab) {
        // Check availability for two consecutive periods for labs
        return teacherAvailability[teacherName][day][period] && teacherAvailability[teacherName][day][period + 1];
    }
    return teacherAvailability[teacherName][day][period];
}

// Function to check if the period overlaps with break times (10 AM - 10:30 AM and 12:30 PM - 2 PM)
function isWithinBreakPeriod(day, period) {
    if (day < 5) { // Monday to Friday
        if (period === 2) return true; // 10:00 AM - 10:30 AM break
        if (period === 5) return true; // 12:30 PM - 2:00 PM lunch break
    }
    return false;
}

// Function to update teacher availability after assigning a lecture
function updateTeacherAvailability(teacherName, day, period, isLab = false) {
    teacherAvailability[teacherName][day][period] = false;
    if (isLab) {
        teacherAvailability[teacherName][day][period + 1] = false; // Mark the second period for labs
    }
}

// Function to select a teacher based on availability for the given subject, day, and period
async function selectTeacher(subjectId, day, period, isLab = false) {
    try {
        // Find the teacher assigned to the given subject
        const assignment = await TheoryAssignment.findOne({ subjectId }).populate('teacherId');

        if (assignment && assignment.teacherId) {
            const teachers = Array.isArray(assignment.teacherId) ? assignment.teacherId : [assignment.teacherId];

            for (const teacher of teachers) {
                // Check if the teacher is available
                if (teacherAvailable(teacher.teacherName, day, period, isLab)) {
                    return teacher;
                }
            }

            throw new Error(`No available teacher found for this subject on day ${day} period ${period}`);
        } else {
            throw new Error('No teacher assigned to this subject');
        }
    } catch (error) {
        console.error(`Error selecting teacher for subject ${subjectId} on day ${day}, period ${period}:`, error);
        throw error;
    }
}

// Function to check if a class can be scheduled in the given slot
function canHaveLecture(subject, day, period, timetables, type) {
    const timetable = timetables[type];

    // Ensure that the period is not a break time
    if (isWithinBreakPeriod(day, period)) {
        return false; // Can't schedule during breaks
    }

    // Check if the slot is already filled
    if (timetable[day][period]) {
        return false; // Slot already occupied
    }

    // Ensure no double bookings for labs (requires two consecutive slots)
    if (subject.subjectType === 'Lab' && (period > 5 || timetable[day][period + 1])) {
        return false; // Not enough consecutive slots for a lab
    }

    // Check additional constraints (e.g., department-specific rules)
    if (subject.department && timetable[day][period]) {
        return false; // Prevent scheduling conflicts within the same department
    }

    return true; // Slot is available
}

// Function to generate timetable for electives only
async function generateElectiveTimetable(semester) {
    try {
        // Initialize timetable matrix for electives
        const electiveTimetable = Array.from({ length: 6 }, () => Array(8).fill(null)); // 8 periods per day for weekdays, 6 days

        // Fetch elective subjects for the semester
        const electives = await Subject.find({ semester, subjectType: 'Elective' });

        // Group electives by subjectName
        const electivesMap = {};
        electives.forEach(subject => {
            if (!electivesMap[subject.subjectName]) {
                electivesMap[subject.subjectName] = [];
            }
            electivesMap[subject.subjectName].push(subject);
        });

        // Iterate over each elective group
        for (const subjectName in electivesMap) {
            const subjectGroup = electivesMap[subjectName];
            let lecturesScheduled = 0;

            // Shuffle days and periods for fairness
            const shuffledDays = shuffle([0, 1, 2, 3, 4, 5]); // Monday to Saturday
            const shuffledPeriods = shuffle([0, 1, 2, 3, 4, 5, 6, 7]); // All periods for the day

            for (const day of shuffledDays) {
                for (const period of shuffledPeriods) {
                    for (const subject of subjectGroup) {
                        if (canHaveLecture(subject, day, period, { elective: electiveTimetable }, 'elective')) {
                            try {
                                const teacher = await selectTeacher(subject._id, day, period);
                                electiveTimetable[day][period] = { subject: subject.subjectName, teacher: teacher.teacherName };
                                updateTeacherAvailability(teacher.teacherName, day, period);
                                lecturesScheduled++;
                                if (lecturesScheduled >= subject.lecturesPerWeek) break;
                            } catch (error) {
                                console.error(`No teacher available for elective subject ${subject.subjectName} on day ${day} period ${period}:`, error);
                            }
                        }
                    }
                    if (lecturesScheduled >= subjectGroup[0].lecturesPerWeek) break;
                }
                if (lecturesScheduled >= subjectGroup[0].lecturesPerWeek) break;
            }
        }

        return electiveTimetable;
    } catch (error) {
        console.error("Error generating timetable for electives:", error);
        throw error;
    }
}

// Function to generate timetable for a single semester and department with elective slots pre-filled
async function generateTimetableForDepartment(semester, department, electiveTimetable) {
    try {
        // Initialize timetable matrix for the department
        const timetable = Array.from({ length: 6 }, () => Array(8).fill(null)); // 8 periods per day for weekdays

        // Fill elective slots in the timetable
        for (let day = 0; day < 6; day++) {
            for (let period = 0; period < 8; period++) {
                if (electiveTimetable[day][period]) {
                    timetable[day][period] = electiveTimetable[day][period];
                }
            }
        }

        // Fetch non-elective subjects for the department in the semester
        const subjects = await Subject.find({ department, semester, subjectType: { $ne: 'Elective' } });

        // Group subjects by subjectName
        const subjectsMap = {};
        subjects.forEach(subject => {
            if (!subjectsMap[subject.subjectName]) {
                subjectsMap[subject.subjectName] = [];
            }
            subjectsMap[subject.subjectName].push(subject);
        });

        // Iterate over each subject group
        for (const subjectName in subjectsMap) {
            const subjectGroup = subjectsMap[subjectName];
            let lecturesScheduled = 0;

            // Shuffle days for fairness
            const shuffledDays = shuffle([0, 1, 2, 3, 4, 5]); // Monday to Saturday

            for (const day of shuffledDays) {
                let labScheduledToday = false;

                // Iterate over each period of the day, ensuring no gaps
                for (let period = 0; period < 8; period++) {
                    if (subjectGroup[0].subjectType === 'Lab' && period > 5) {
                        continue; // Skip if there are no two consecutive slots left for Lab
                    }

                    // Ensure no gaps by only scheduling if previous period is filled or it's the first period
                    if (period > 0 && !timetable[day][period - 1] && timetable[day][period] == null) continue;

                    for (const subject of subjectGroup) {
                        if (!timetable[day][period] && canHaveLecture(subject, day, period, { [department]: timetable }, department)) {
                            try {
                                const isLab = subject.subjectType === 'Lab';
                                if (isLab && labScheduledToday) {
                                    continue; // Skip if a Lab is already scheduled for the day
                                }

                                const teacher = await selectTeacher(subject._id, day, period, isLab);
                                timetable[day][period] = { subject: subject.subjectName, teacher: teacher.teacherName };
                                if (isLab) {
                                    timetable[day][period + 1] = { subject: subject.subjectName, teacher: teacher.teacherName };
                                    labScheduledToday = true;
                                }
                                updateTeacherAvailability(teacher.teacherName, day, period, isLab);
                                lecturesScheduled++;
                                if (isLab) lecturesScheduled++; // Count both slots for Lab
                                if (lecturesScheduled >= (isLab ? subject.labsPerWeek : subject.lecturesPerWeek)) break;
                            } catch (error) {
                                console.error(`No teacher available for subject ${subject.subjectName} on day ${day} period ${period}:`, error);
                            }
                        }
                    }
                    if (lecturesScheduled >= (subjectGroup[0].subjectType === 'Lab' ? subjectGroup[0].labsPerWeek : subjectGroup[0].lecturesPerWeek)) break;
                }
                if (lecturesScheduled >= (subjectGroup[0].subjectType === 'Lab' ? subjectGroup[0].labsPerWeek : subjectGroup[0].lecturesPerWeek)) break;
            }
        }

        return timetable;
    } catch (error) {
        console.error("Error generating timetable for semester and department:", error);
        throw error;
    }
}

// Function to generate timetables for all semesters
exports.generateTimetableForAllSemesters = async (req, res) => {
    try {
        const allTimetables = [];
        const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
        const departments = ["Computer-A", "Computer-B", "Computer-C"]; // Hardcoded departments

        await initializeTeacherAvailability();

        for (const semester of semesters) {
            const electiveTimetable = await generateElectiveTimetable(semester);

            for (const department of departments) {
                const timetable = await generateTimetableForDepartment(semester, department, electiveTimetable);
                allTimetables.push({ semester, department, timetable });
            }
        }

        return res.json({ timetable: allTimetables });
    } catch (error) {
        console.error("Error generating timetables for all semesters and departments:", error);
        res.status(500).json({ error: error.message });
    }
}

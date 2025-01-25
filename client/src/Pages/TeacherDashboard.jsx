import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TimeTable from '../Pages/Generate/TimeTable';
import '../Pages/Generate/TimeTableDashboard.css';
import { usePDF } from 'react-to-pdf';

function TimeTableDashboard() {
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showData, setShowData] = useState(false);
    const teacherId = localStorage.getItem('teacherId');
    const { toPDF, targetRef } = usePDF({ filename: 'teachertimetable.pdf' });

    const [hours, setHours] = useState({
        theoryHours: 0,
        labHours: 0,
        electiveHours: 0, // New field for elective hours
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, semRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/departments'),
                    axios.get('http://localhost:5000/api/semesters'),
                ]);
                setDepartments(deptRes.data);
                setSemesters(semRes.data);
            } catch (err) {
                console.error('Error fetching departments or semesters:', err);
                setError('Failed to load department or semester data');
            }
        };

        fetchData();
    }, []);

    const fetchTimetable = async () => {
        if (!department || !semester || !teacherId) {
            setError('Please select all fields and ensure you are logged in.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:5000/api/timetable/teacher', {
                params: { department, semester, teacherId },
            });

            if (response.data && response.data.data) {
                setTimetable(response.data.data);
                calculateHours(response.data.data);

                response.data.data.slots.forEach((slot, index) => {
                    console.log(`Slot ${index + 1}:`, slot);
                    if (slot.subject?.subjectType === 'Elective') {
                        console.log(`Elective Subject Details:`, slot.subject);
                    }
                });
            } else {
                setError('No timetable available for the selected department and semester.');
                setTimetable(null);
                setHours({ theoryHours: 0, labHours: 0, electiveHours: 0 });
            }
        } catch (err) {
            console.error('Error fetching timetable:', err);
            setError('Failed to fetch timetable');
            setTimetable(null);
            setHours({ theoryHours: 0, labHours: 0, electiveHours: 0 });
        } finally {
            setLoading(false);
        }
    };

    const calculateHours = (data) => {
        let theoryHours = 0;
        let labHours = 0;
        let electiveHours = 0;

        if (data && data.slots) {
            data.slots.forEach((slot) => {
                if (slot.teacher && slot.teacher.teacherID === teacherId) {
                    const duration = getSlotDuration(slot.startTime, slot.endTime);

                    if (slot.subject?.subjectType === 'Theory') {
                        theoryHours += duration;
                    } else if (slot.subject?.subjectType === 'Lab') {
                        labHours += duration;
                    } else if (slot.subject?.subjectType === 'Elective') {
                        electiveHours += duration;
                    }
                }
            });
        }

        setHours({ theoryHours, labHours, electiveHours });
    };

    const getSlotDuration = (startTime, endTime) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        return (endHour + endMinute / 60) - (startHour + startMinute / 60);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <h1>Teacher Timetable Dashboard</h1>
                </div>

                <div className="dashboard-form">
                    <div className="dashboard-form-group">
                        <label>Department</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="dashboard-select-input"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dashboard-form-group">
                        <label>Semester</label>
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="dashboard-select-input"
                        >
                            <option value="">Select Semester</option>
                            {semesters.map((sem, index) => (
                                <option key={index} value={sem}>
                                    {sem}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dashboard-btn-container">
                        <button
                            onClick={fetchTimetable}
                            disabled={!department || !semester || loading}
                            className="dashboard-view-btn"
                        >
                            View Timetable
                        </button>
                        {timetable && (
                            <button
                                onClick={() => setShowData(!showData)}
                                className="dashboard-view-data-btn"
                            >
                                {showData ? 'Hide Data' : 'View Data'}
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="dashboard-error-message">
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="dashboard-loading-spinner">
                        <div className="dashboard-spinner"></div>
                    </div>
                )}

                {timetable && !loading && (
                    <div>
                        <div className="dashboard-btn-container">
                            <button onClick={toPDF} className="dashboard-download-btn">
                                Download PDF
                            </button>
                        </div>

                        {showData && (
                            <div className="dashboard-table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Particulars</th>
                                            <th>Units</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Theory</td>
                                            <td>{hours.theoryHours.toFixed(2)} hrs</td>
                                        </tr>
                                        <tr>
                                            <td>Laboratory</td>
                                            <td>{hours.labHours.toFixed(2)} hrs</td>
                                        </tr>
                                        <tr>
                                            <td>Elective</td>
                                            <td>{hours.electiveHours.toFixed(2)} hrs</td>
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            <td>{(hours.theoryHours + hours.labHours + hours.electiveHours).toFixed(2)} hrs</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div ref={targetRef} className="dashboard-timetable">
                            <TimeTable data={timetable} teacherName={teacherId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimeTableDashboard;

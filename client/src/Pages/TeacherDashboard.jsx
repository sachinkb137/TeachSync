import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TimeTable from '../Pages/Generate/TimeTable';
import '../Pages/Generate/TimeTableDashboard.css';
import { usePDF } from 'react-to-pdf';
function TimeTableDashboard() {
    const [departments, setDepartments] = useState([]); // List of departments
    const [semesters, setSemesters] = useState([]); // List of semesters
    const [department, setDepartment] = useState(''); // Selected department
    const [semester, setSemester] = useState(''); // Selected semester
    const [timetable, setTimetable] = useState(null); // Timetable data
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const teacherId = localStorage.getItem('teacherId'); // Retrieve teacher ID from localStorage
    const { toPDF, targetRef } = usePDF({ filename: 'teachertimetable.pdf' });
    // Fetch departments and semesters on component mount
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

    // Fetch timetable based on selected department, semester, and teacherId
    const fetchTimetable = async () => {
        if (!department || !semester || !teacherId) {
            setError('Please select all fields and ensure you are logged in.');
            return;
        }
    
        setLoading(true);
        setError(null); // Reset error state
    
        console.log('Fetching timetable with:', { department, semester, teacherId });
    
        try {
            const response = await axios.get('http://localhost:5000/api/timetable/teacher', {
                params: { department, semester, teacherId }, // Check if teacherId is passed
            });
            console.log('Response:', response);
            if (response.data && response.data.data) {
                console.log('Fetched timetable:', response.data.data);
                setTimetable(response.data.data); // Set timetable data
            } else {
                console.warn('No timetable data returned:', response.data);
                setError('No timetable available for the selected department and semester.');
                setTimetable(null);
            }
        } catch (err) {
            console.error('Error fetching timetable:', err);
            setError('Failed to fetch timetable');
            setTimetable(null);
        } finally {
            setLoading(false); // Reset loading state
        }
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
                            <button
                                onClick={toPDF}
                                className="dashboard-download-btn"
                            >
                                Download PDF
                            </button>
                        </div>
                        <div ref={targetRef}>
                            <TimeTable data={timetable} />
                        </div>
                    </div>
                )}
                {timetable && !loading && (
                    <div className="dashboard-timetable">
                        <TimeTable data={timetable} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimeTableDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import TimeTable from './TimeTable'; // Ensure this is a default import
import './TimeTableDashboard.css'; // Import the updated CSS

function TimeTableDashboard() {
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatingTimetable, setGeneratingTimetable] = useState(false); // New state for generating timetable
    const { toPDF, targetRef } = usePDF({ filename: 'timetable.pdf' });

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
                setError('Failed to load data');
            }
        };

        fetchData();
    }, []);

    const fetchTimetable = async () => {
        if (!department || !semester) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:5000/api/timetable', {
                params: { department, semester },
            });
            setTimetable(response.data.data); // Storing the fetched timetable in state
        } catch (err) {
            setError('Failed to fetch timetable');
            setTimetable(null); // Reset timetable in case of error
        } finally {
            setLoading(false);
        }
    };

    const generateAllTimetables = async () => {
        setGeneratingTimetable(true); // Start generating timetable
        setError(null);

        try {
            await axios.post('http://localhost:5000/api/timetable/generate-all');
            alert('All timetables generated successfully!');
        } catch (err) {
            setError('Failed to generate all timetables');
        } finally {
            setGeneratingTimetable(false); // Finished generating timetable
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <h1>Timetable Dashboard</h1>
                    <button
                        onClick={generateAllTimetables}
                        disabled={loading || generatingTimetable}
                        className="dashboard-generate-btn"
                    >
                        {generatingTimetable ? 'Generating Timetables...' : 'Generate All Timetables'}
                    </button>
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
                            disabled={!department || !semester || loading || generatingTimetable}
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

                {loading && !generatingTimetable && (
                    <div className="dashboard-loading-spinner">
                        <div className="dashboard-spinner"></div>
                    </div>
                )}

                {generatingTimetable && (
                    <div className="dashboard-generating-message">
                        <p>Generating timetables, please wait...</p>
                        <div className="dashboard-spinner"></div>
                    </div>
                )}

                {timetable && !loading && !generatingTimetable && (
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
                            {/* Displaying the timetable in TimeTable component */}
                            <TimeTable data={timetable} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimeTableDashboard;

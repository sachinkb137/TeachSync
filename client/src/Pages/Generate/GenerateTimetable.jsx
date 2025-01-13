import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import TimeTable from './TimeTable'; // Ensure this is a default import
import './TimeTableDashboard.css'; // Import the new CSS file

function TimeTableDashboard() {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toPDF, targetRef } = usePDF({ filename: 'timetable.pdf' });

  useEffect(() => {
    const fetchDepartmentsAndSemesters = async () => {
      try {
        const [departmentsRes, semestersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/departments'),
          axios.get('http://localhost:5000/api/semesters'),
        ]);
        setDepartments(departmentsRes.data);
        setSemesters(semestersRes.data);
      } catch (err) {
        setError('Failed to load departments or semesters');
      }
    };

    fetchDepartmentsAndSemesters();
  }, []);

  const fetchTimetable = async () => {
    if (!department || !semester) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/timetable', {
        params: { department, semester },
      });
      setTimetable(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch timetable');
      setTimetable(null);
    } finally {
      setLoading(false);
    }
  };

  const generateAllTimetables = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/timetable/generate-all');
      alert('All timetables generated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate all timetables');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="card">
        <div className="header">
          <h1>Timetable Dashboard</h1>
          <button
            onClick={generateAllTimetables}
            disabled={loading}
            className="btn generate-btn"
          >
            Generate All Timetables
          </button>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="select-input"
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="select-input"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem, index) => (
                <option key={index} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="btn-container">
            <button
              onClick={fetchTimetable}
              disabled={!department || !semester || loading}
              className="btn view-btn"
            >
              View Timetable
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}

        {timetable && !loading && (
          <div>
            <div className="btn-container">
              <button
                onClick={() => toPDF()}
                className="btn download-btn"
              >
                Download PDF
              </button>
            </div>
            <div ref={targetRef}>
              <TimeTable data={timetable} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeTableDashboard;

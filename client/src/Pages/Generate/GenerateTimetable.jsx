import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import TimeTable from './TimeTable'; // Ensure this is a default import

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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-bold text-gray-900">Timetable Dashboard</h1>
            <button
              onClick={generateAllTimetables}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Generate All Timetables
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem, index) => (
                  <option key={index} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchTimetable}
                disabled={!department || !semester || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Timetable
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {timetable && !loading && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => toPDF()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
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
    </div>
  );
}

export default TimeTableDashboard;

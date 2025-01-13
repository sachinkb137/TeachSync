import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideNavbar from '../../Components/SideNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignClassrooms() {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/classrooms');
                setClassrooms(response.data.data);
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            }
        };

        fetchClassrooms();
    }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/classroom-assignments');
                setAssignments(response.data.data);
            } catch (error) {
                console.error('Error fetching classroom assignments:', error);
            }
        };

        fetchAssignments();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            // Send the course, semester, and classroom object data (classroom._id)
            const assignmentData = {
                course: selectedCourse,
                semester: selectedSemester,
                classroomCode: selectedClassroom._id, // Send the ObjectId of the classroom
            };
    
            // Post the data to the backend
            await axios.post('http://localhost:5000/api/classroom-assignments', assignmentData);
            toast.success('Classroom assigned successfully');
            
            // Fetch updated assignments after the assignment is created
            const response = await axios.get('http://localhost:5000/api/classroom-assignments');
            setAssignments(response.data.data);
        } catch (error) {
            console.error('Error assigning classroom:', error);
            toast.error('Error assigning classroom');
        }
    };
    

    const handleDelete = async (assignmentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/classroom-assignments/${assignmentId}`);
            toast.success('Assignment deleted successfully');
            
            // Fetch updated assignments after deletion
            const response = await axios.get('http://localhost:5000/api/classroom-assignments');
            setAssignments(response.data.data);
        } catch (error) {
            console.error('Error deleting assignment:', error);
            toast.error('Error deleting assignment');
        }
    };

    const courses = [
        { id: 'computer-a', name: 'Computer-A' },
        { id: 'computer-b', name: 'Computer-B' },
        { id: 'computer-c', name: 'Computer-C' },
        { id: 'aids', name: 'AIML' },
        { id: 'aids', name: 'AIDS' }
    ];

    // Semesters from 1 to 8
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    // Filter assigned classrooms based on selected course and semester
    const filteredClassrooms = classrooms.filter(classroom => {
        // Check if the current classroom is not already assigned
        return !assignments.some(assignment =>
            assignment.classroom === classroom.classroomCode
        );
    });

    return (
        <>
            <ToastContainer />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-auto col-sm-3.2 bg-dark d-flex flex-column justify-content-between min-vh-100">
                        <SideNavbar />
                    </div>
                    <div className="col">
                        <h1 className="text-center mt-5 mb-4 custom-heading">Assign Classrooms</h1>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="course" className="form-label custom-label">Choose Course:</label>
                                <select
                                    id="course"
                                    className="form-select custom-select"
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    value={selectedCourse}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="semester" className="form-label custom-label">Select Semester:</label>
                                <select
                                    id="semester"
                                    className="form-select custom-select"
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    value={selectedSemester}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map(semester => (
                                        <option key={semester} value={semester}>{semester}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="classroom" className="form-label custom-label">Choose Classroom:</label>
                                <select
                                    id="classroom"
                                    className="form-select custom-select"
                                    onChange={(e) => setSelectedClassroom(JSON.parse(e.target.value))}
                                    value={selectedClassroom ? JSON.stringify(selectedClassroom) : ''}
                                >
                                    <option value="">Select Classroom</option>
                                    {filteredClassrooms.map(classroom => (
                                        <option key={classroom._id} value={JSON.stringify(classroom)}>
                                            {classroom.classroomCode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-primary" onClick={handleAssign}>Assign</button>
                            </div>
                        </div>
                        <div className="container-fluid mt-5">
                            <div className="row">
                                <div className="col">
                                    <h2 className="text-center">Assigned Classrooms</h2>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Course</th>
                                                <th>Semester</th>
                                                <th>Classroom</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.map((item, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'table-light' : 'table-secondary'}>
                                                    <td>{item.course}</td>
                                                    <td>{item.semester}</td>
                                                    <td>{item.classroom}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AssignClassrooms;

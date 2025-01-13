import React, { useState, useEffect } from "react";
import SideNavbar from "../../Components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddRooms() {

  const [refereshToken, setRefereshToken] = useState(null);

  const [classrooms, setClassrooms] = useState([]);

  const [formData, setFormData] = useState({
    classroomCode: ""
  });

  useEffect(() => {
    fetchClassroom();
  }, [refereshToken]);

  const fetchClassroom = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/classrooms");
      setClassrooms(response?.data.data);
    } catch (error) {
      toast.error("Error fetching classrooms:", error);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this classroom?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axios.delete(`http://localhost:5000/api/classrooms/${id}`);
              if (response.status === 200) {
                toast.success('Classroom deleted successfully');
                setRefereshToken(response);
              } else {
                console.error('Failed to delete classroom');
                setRefereshToken(response);
              }
            } catch (error) {
              console.error('Error:', error);
            }
          },
          className: 'confirm-button-yes' 
        },
        {
          label: 'No',
          onClick: () => {}, 
          className: 'confirm-button-no' 
        }
      ],
      overlayClassName: 'confirm-overlay' 
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/classrooms', formData);
      if (response.status === 201) {
        toast.success('Classroom added successfully', { autoClose: 5000 });
        setRefereshToken(response)
      } else {
        console.error('Failed to add classroom');
        setRefereshToken(response)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="col-auto col-sm-3.2 bg-dark d-flex flex-column justify-content-between min-vh-100">
            <SideNavbar />
          </div>
          <div className="col">
            <h1 className="text-center mt-5 mb-4">Add Classroom</h1>

            <div className="d-flex justify-content-center">
              <div className="col-sm-6 p-4" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="classroomCode" className="form-label">
                      <FontAwesomeIcon icon={faChalkboard} className="me-2" />
                      <span style={{ fontSize: "1.3rem", fontWeight: "bold" }}>Classroom Code:</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="classroomCode"
                      name="classroomCode"
                      placeholder="Type Classroom Code (e.g.,CSL001,Nano1)"
                      value={formData.classroomCode}
                      onChange={handleChange}
                      style={{ fontWeight: "bold", borderColor: "#77757c" }}
                    />
                  </div>

                  <div className="mb-3 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#5c3bcc" }}>
                      ADD
                    </button>
                  </div>
                </form>

              </div>
            </div>
            <div>
              <h2 className="mt-5 mb-3 text-center">Added Classrooms</h2>
              <table className="table table-striped">
                <thead className="thead-light">
                  <tr>
                    <th className="tables" scope="col">#</th>
                    <th className="tables" scope="col">Classroom Code</th>
                    <th className="tables" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classrooms.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.classroomCode}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AddRooms;

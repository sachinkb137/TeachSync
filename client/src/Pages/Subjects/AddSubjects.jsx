import React, { useEffect, useState } from "react";
import SideNavbar from "../../Components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChalkboard, faFlask, faCode, faClock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import "./AddSubject.css";

function AddSubjects() {
  const [refreshToken, setRefreshToken] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [formData, setFormData] = useState({
    subjectType: "",
    subjectName: "",
    subjectCode: "",
    semester: "",
    teachingHoursPerWeek: "",
    credits: "",
    department: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/subjects");
        setSubjectData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchData();
  }, [refreshToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check for missing required fields
      const requiredFields = ["subjectType", "subjectName", "subjectCode", "semester", "teachingHoursPerWeek", "credits", "department"];
      for (const field of requiredFields) {
        if (!formData[field]) {
          toast.error(`Missing required field: ${field}`);
          return;
        }
      }

      const response = await axios.post("http://localhost:5000/api/subjects", formData);
      if (response.status === 201) {
        toast.success("Subject added successfully");
        setRefreshToken(response);
        setFormData({
          subjectType: "",
          subjectName: "",
          subjectCode: "",
          semester: "",
          teachingHoursPerWeek: "",
          credits: "",
          department: "",
        });
      } else {
        console.error("Failed to add subject");
      }
    } catch (error) {
      toast.error('Error adding subject: ' + (error.response?.data?.message || "Unexpected error"));
      console.error("Error adding subject:", error);
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this subject?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.delete(`http://localhost:5000/api/subjects/${id}`);
              if (response.status === 200) {
                toast.success("Subject deleted successfully");
                setRefreshToken(response);
              } else {
                console.error("Failed to delete subject");
              }
            } catch (error) {
              console.error("Error deleting subject:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
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
            <h2 className="text-center mt-5 mb-2">Add Subjects</h2>

            <div className="d-flex justify-content-center">
              <div
                className="col-sm-6 p-4"
                style={{ boxShadow: "0 5px 19px rgba(134, 108, 212, 0.4)" }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                      Subject Type:
                    </label>
                    <select
                      className="form-select"
                      name="subjectType"
                      value={formData.subjectType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Subject Type</option>
                      <option value="Theory">Theory</option>
                      <option value="Lab">Lab</option>
                      <option value="Elective">Elective</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faBook} className="me-2" /> Subject Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faCode} className="me-2" /> Subject Code:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="subjectCode"
                      value={formData.subjectCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faChalkboard} className="me-2" /> Semester:
                    </label>
                    <select
                      className="form-select"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faClock} className="me-2" /> Teaching Hours per Week:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="teachingHoursPerWeek"
                      value={formData.teachingHoursPerWeek}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faBook} className="me-2" /> No. of Credits:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="credits"
                      value={formData.credits}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faFlask} className="me-2" /> Department:
                    </label>
                    <select
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {["Computer-A", "Computer-B", "Computer-C", "AIML","AIDS"].map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ backgroundColor: "#5c3bcc", color: "white" }}
                    >
                      Add Subject
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <table className="table table-striped table-bordered mt-4">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Subject Code</th>
                  <th>Subject Type</th>
                  <th>Semester</th>
                  <th>Teaching Hours</th>
                  <th>Credits</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjectData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.subjectName}</td>
                    <td>{item.subjectCode}</td>
                    <td>{item.subjectType}</td>
                    <td>{item.semester}</td>
                    <td>{item.teachingHoursPerWeek}</td>
                    <td>{item.credits}</td>
                    <td>{item.department}</td>
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
    </>
  );
}

export default AddSubjects;
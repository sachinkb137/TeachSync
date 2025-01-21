import React, { useState, useEffect } from "react";
import SideNavbar from "../../Components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faIdCard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTeacher.css";

function AddTeachers() {
  const [refereshToken, setRefereshToken] = useState(null);

  const [formData, setFormData] = useState({
    teacherName: "",
    teacherID: "",
    designation: "",
    subjectSpecialization: "", // Subject specialization is optional
  });

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, [refereshToken]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(response?.data.data);
    } catch (error) {
      toast.error("Error fetching teachers: " + error.message);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this teacher?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.delete(
                `http://localhost:5000/api/teachers/${id}`
              );
              if (response.status === 200) {
                toast.success("Teacher deleted successfully");
                setRefereshToken(response);
              }
            } catch (error) {
              console.error("Error:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/teachers", {
        teacherName: formData.teacherName,
        teacherID: formData.teacherID,
        designation: formData.designation,
        subjectSpecialization: formData.subjectSpecialization || null,  // If not provided, send null
      });
      if (response.status === 201) {
        toast.success("Teacher added successfully");
        setRefereshToken(response);
      }
    } catch (error) {
      toast.error(
        "Error adding teacher: " + error.response?.data?.message || "Unexpected error"
      );
      console.error("Error:", error);
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
            <h2 className="text-center mt-5 mb-4">Add Teacher</h2>
            <div className="d-flex justify-content-center">
              <div
                className="col-sm-6 p-4"
                style={{ boxShadow: "0 5px 19px rgba(134, 108, 212, 0.4)" }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="teacherName" className="form-label">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Teacher Name:
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="teacherName"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleChange}
                      style={{ fontWeight: "bold", borderColor: "#77757c" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="teacherID" className="form-label">
                      <FontAwesomeIcon icon={faIdCard} className="me-2" />
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Teacher ID:
                      </span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="teacherID"
                      name="teacherID"
                      value={formData.teacherID}
                      onChange={handleChange}
                      style={{ fontWeight: "bold", borderColor: "#77757c" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="designation" className="form-label">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Designation:
                      </span>
                    </label>
                    <select
                      className="form-select"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      style={{ fontWeight: "bold", borderColor: "#77757c" }}
                    >
                      <option value="">Select Designation</option>
                      <option value="Assistant Professor">
                        Assistant Professor
                      </option>
                      <option value="Associate Professor">
                        Associate Professor
                      </option>
                      <option value="Professor">Professor</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subjectSpecialization" className="form-label">
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        Subject Specialization:
                      </span>
                    </label>
                    <select
                      className="form-select"
                      id="subjectSpecialization"
                      name="subjectSpecialization"
                      value={formData.subjectSpecialization}
                      onChange={handleChange}
                      style={{ fontWeight: "bold", borderColor: "#77777c" }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject.subjectName}>
                          {subject.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3 d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ backgroundColor: "#5c3bcc" }}
                    >
                      ADD
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h2 className="text-center mt-5 mb-4">Teachers</h2>
              <table className="table table-striped table-bordered mt-4">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Teacher Name</th>
                    <th scope="col">Teacher ID</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Subject Specialization</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "table-light" : "table-secondary"}
                    >
                      <td>{item.teacherName}</td>
                      <td>{item.teacherID}</td>
                      <td>{item.designation}</td>
                      <td>{item.subjectSpecialization || "No Subject specialization"}</td>
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

export default AddTeachers;

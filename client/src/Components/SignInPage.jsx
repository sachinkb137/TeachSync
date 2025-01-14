import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faIdBadge, faUserGraduate, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/SignInPage.css";
import { useNavigate } from "react-router-dom";

function SignInPage() {
    const [signInType, setSignInType] = useState("admin");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {};
        let validationError = null;

        if (signInType === "admin") {
            const email = e.target.elements.email.value.trim();
            const password = e.target.elements.password.value.trim();

            if (!email || !password) {
                validationError = "Email and password are required.";
            } else {
                formData.email = email;
                formData.password = password;
                formData.signInType = "admin";
            }
        } else if (signInType === "teacher") {
            const teacherID = e.target.elements.teacherID.value.trim();

            if (!teacherID) {
                validationError = "Teacher ID is required.";
            } else {
                formData.teacherID = teacherID;
                formData.signInType = "teacher";
            }
        } else if (signInType === "student") {
            const usn = e.target.elements.usn.value.trim();
            const dob = e.target.elements.dob.value;

            if (!usn || !dob) {
                validationError = "USN and Date of Birth are required.";
            } else {
                formData.usn = usn;
                formData.dob = dob;
                formData.signInType = "student";
            }
        }

        if (validationError) {
            toast.error(validationError, { position: "top-right", autoClose: 3000 });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Save user details (including teacherID) if provided
                const username = data.user?.username || data.user?.teacherName || data.user?.studentName || "User";
                const teacherID = data.user?.teacherID || null;  // For teachers, we store teacherID
                const token = data.token || null;

                localStorage.setItem("username", username);
                 
                if (teacherID) {
                    localStorage.setItem("teacherId", teacherID);  // Store teacherID in localStorage
                }
                
                if (token) {
                    localStorage.setItem("authToken", token);  // Store the auth token in localStorage
                }

                toast.success(`Welcome, ${username}!`, {
                    position: "top-right",
                    autoClose: 3000,
                });

                if (signInType === "admin") {
                    navigate("/");
                } else if (signInType === "teacher") {
                    navigate("/teacher-dashboard");
                } else if (signInType === "student") {
                    navigate("/student-dashboard");
                }
            } else {
                toast.error(data.message || "An error occurred. Please try again.", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            console.error("Sign-In Error:", error);
            toast.error("An error occurred. Please try again.", { position: "top-right", autoClose: 3000 });
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Sign In</h2>
            <div className="buttons-container">
                <button
                    className={`button ${signInType === "admin" ? "active" : ""}`}
                    onClick={() => setSignInType("admin")}
                >
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    <span>Admin</span>
                </button>
                <button
                    className={`button ${signInType === "teacher" ? "active" : ""}`}
                    onClick={() => setSignInType("teacher")}
                >
                    <FontAwesomeIcon icon={faIdBadge} className="icon" />
                    <span>Teacher</span>
                </button>
                <button
                    className={`button ${signInType === "student" ? "active" : ""}`}
                    onClick={() => setSignInType("student")}
                >
                    <FontAwesomeIcon icon={faUserGraduate} className="icon" />
                    <span>Student</span>
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {signInType === "admin" && (
                    <div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faEnvelope} className="icon" />
                            <input className="input-field" type="email" name="email" placeholder="Email" />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faLock} className="icon" />
                            <input className="input-field" type="password" name="password" placeholder="Password" />
                        </div>
                    </div>
                )}
                {signInType === "teacher" && (
                    <div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faIdBadge} className="icon" />
                            <input className="input-field" type="text" name="teacherID" placeholder="Teacher ID" />
                        </div>
                    </div>
                )}
                {signInType === "student" && (
                    <div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faUserGraduate} className="icon" />
                            <input className="input-field" type="text" name="usn" placeholder="USN" />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                            <input className="input-field" type="date" name="dob" placeholder="Date of Birth" />
                        </div>
                    </div>
                )}
                <button className="submit-button" type="submit">
                    Sign In
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default SignInPage;

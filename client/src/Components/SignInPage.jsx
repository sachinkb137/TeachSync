import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faIdBadge, faUserGraduate, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/SignInPage.css";
import { useNavigate } from "react-router-dom";

function SignInPage() {
    const [signInType, setSignInType] = useState("admin");
    const [userName, setUserName] = useState(""); // To store the user's name (admin, teacher, or student)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = {};

        // Validate the form data based on the sign-in type
        if (signInType === "admin") {
            const email = e.target.elements.email.value.trim();
            const password = e.target.elements.password.value.trim();

            if (!email || !password) {
                toast.error("Email and password are required", { position: "top-right", autoClose: 3000 });
                return;
            }

            formData = { email, password, signInType: "admin" };
        } else if (signInType === "teacher") {
            const teacherID = e.target.elements.teacherID.value.trim();

            if (!teacherID ) {
                toast.error("Teacher ID are required", { position: "top-right", autoClose: 3000 });
                return;
            }

            formData = { teacherID, signInType: "teacher" };
        } else if (signInType === "student") {
            const usn = e.target.elements.usn.value.trim();

            if (!usn) {
                toast.error("USN and Date of Birth are required", { position: "top-right", autoClose: 3000 });
                return;
            }

            formData = { usn, signInType: "student" };
        }

        try {
            const response = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                const username = data.user?.username || data.user?.teacherName || data.user?.studentName || "Unknown User";
                localStorage.setItem("username", username);

                if (signInType === "admin") {
                    navigate("/");
                } else if (signInType === "teacher") {
                    navigate("/teacher-dashboard");
                } else if (signInType === "student") {
                    navigate("/student-dashboard");
                }

                toast.success(`Welcome, ${username}!`, {
                    position: "top-right",
                    autoClose: 400,
                });
            } else {
                toast.error(data.message || "An error occurred. Please try again later.", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again later.", { position: "top-right", autoClose: 3000 });
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Sign In</h2>
            <div className="buttons-container">
                <button className={`button ${signInType === "admin" ? "active" : ""}`} onClick={() => setSignInType("admin")}>
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    <span>Admin</span>
                </button>
                <button className={`button ${signInType === "teacher" ? "active" : ""}`} onClick={() => setSignInType("teacher")}>
                    <FontAwesomeIcon icon={faIdBadge} className="icon" />
                    <span>Teacher</span>
                </button>
                <button className={`button ${signInType === "student" ? "active" : ""}`} onClick={() => setSignInType("student")}>
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
                <button className="submit-button" type="submit">Sign In</button>
            </form>
            {userName && <p>Welcome, {userName}!</p>}
            <ToastContainer />
        </div>
    );
}

export default SignInPage;

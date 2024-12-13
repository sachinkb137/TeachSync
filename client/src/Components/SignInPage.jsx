// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faLock, faIdBadge } from "@fortawesome/free-solid-svg-icons";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import "../styling/SignInPage.css";
// import { useNavigate } from 'react-router-dom';

// function SignInPage() {
//     const [signInType, setSignInType] = useState("admin");
//     const [teacherName, setTeacherName] = useState(""); // To store the teacher's name
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         let formData = {};
    
//         // Validate the form data based on the sign-in type
//         if (signInType === "admin") {
//             const email = e.target.elements.email.value.trim();
//             const password = e.target.elements.password.value.trim();
    
//             // Ensure email and password are provided
//             if (!email || !password) {
//                 toast.error("Email and password are required", {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//                 return;
//             }
    
//             formData = { email, password, signInType: "admin" };
//         } else if (signInType === "teacher") {
//             const teacherID = e.target.elements.teacherID.value.trim();
    
//             // Ensure teacherID is provided
//             if (!teacherID) {
//                 toast.error("Teacher ID is required", {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//                 return;
//             }
    
//             formData = { teacherID, signInType: "teacher" };
//         }
    
//         try {
//             const response = await fetch('http://localhost:5000/api/signin', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });
    
//             const data = await response.json();
    
//             // Check if the response is successful
//             if (response.ok) {
//                 // Safely store the username from the response (either admin or teacher)
//                 const username = data.user?.username || data.user?.teacherName || "Unknown User";
//                 localStorage.setItem('username', username);
    
//                 // If it's a teacher, fetch teacher details
//                 if (signInType === "teacher" && data.user?.teacherID) {
//                     const teacherResponse = await fetch(`http://localhost:5000/api/fetchteachers/${formData.teacherID}`);
//                     const teacherData = await teacherResponse.json();
//                     setTeacherName(teacherData.teacherName);  // Assuming you have this state already defined
//                 }
    
//                 toast.success("You have successfully signed in!", {
//                     position: "top-right",
//                     autoClose: 400,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     onClose: () => navigate("/") // Redirect to home after successful sign-in
//                 });
//             } else {
//                 toast.error(data.message || "An error occurred. Please try again later.", {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                 });
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             toast.error("An error occurred. Please try again later.", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//             });
//         }
//     };
    
    

//     return (
//         <div className="form-container">
//             <h2 className="form-title">Sign In</h2>
//             <div className="buttons-container">
//                 <button className={`button ${signInType === "admin" ? "active" : ""}`} onClick={() => setSignInType("admin")}>
//                     <FontAwesomeIcon icon={faEnvelope} className="icon" />
//                     <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "10px" }}>Admin</span>
//                 </button>
//                 <button className={`button ${signInType === "teacher" ? "active" : ""}`} onClick={() => setSignInType("teacher")}>
//                     <FontAwesomeIcon icon={faIdBadge} className="icon" />
//                     <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "10px" }}>Teacher</span>
//                 </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//                 {signInType === "admin" && (
//                     <div>
//                         <div className="input-group">
//                             <FontAwesomeIcon icon={faEnvelope} className="icon me-2" />
//                             <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "10px" }}>Email</span>
//                             <input style={{ margin: "10px" }} className="input-field" type="email" name="email" placeholder="Email" />
//                         </div>
//                         <div className="input-group">
//                             <FontAwesomeIcon icon={faLock} className="icon me-2" />
//                             <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "10px" }}>Password</span>
//                             <input style={{ margin: "10px" }} className="input-field" type="password" name="password" placeholder="Password" />
//                         </div>
//                     </div>
//                 )}
//                 {signInType === "teacher" && (
//                     <div>
//                         <div className="input-group">
//                             <FontAwesomeIcon icon={faIdBadge} className="icon me-2" />
//                             <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "10px" }}>Teacher ID</span>
//                             <input
//                                 className="input-field"
//                                 type="text"
//                                 name="teacherID"
//                                 placeholder="Teacher ID"
//                                 style={{ fontWeight: "bold", borderColor: "#77757c", margin: "10px" }}
//                             />
//                         </div>
//                     </div>
//                 )}
//                 <button className="submit-button" style={{ margin: "10px", boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }} type="submit">Sign In</button>
//             </form>
//             {teacherName && <p>Welcome, {teacherName}!</p>}
//             <ToastContainer />
//         </div>
//     );
// }

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faIdBadge, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
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

            // Ensure email and password are provided
            if (!email || !password) {
                toast.error("Email and password are required", { position: "top-right", autoClose: 3000 });
                return;
            }

            formData = { email, password, signInType: "admin" };
        } else if (signInType === "teacher") {
            const teacherID = e.target.elements.teacherID.value.trim();

            // Ensure teacherID is provided
            if (!teacherID) {
                toast.error("Teacher ID is required", { position: "top-right", autoClose: 3000 });
                return;
            }

            formData = { teacherID, signInType: "teacher" };
        } else if (signInType === "student") {
            const usn = e.target.elements.usn.value.trim();

            // Ensure USN is provided
            if (!usn) {
                toast.error("USN is required", { position: "top-right", autoClose: 3000 });
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
                // Store the username (admin, teacher, or student)
                const username = data.user?.username || data.user?.teacherName || data.user?.studentName || "Unknown User";
                localStorage.setItem("username", username);

                // Navigate to appropriate dashboard based on the sign-in type
                if (signInType === "admin") {
                    navigate("/");
                } else if (signInType === "teacher") {
                    navigate("/teacherdashboard");
                } else if (signInType === "student") {
                    navigate("/studentdashboard");
                }

                // Show success notification
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
                    <div className="input-group">
                        <FontAwesomeIcon icon={faIdBadge} className="icon" />
                        <input className="input-field" type="text" name="teacherID" placeholder="Teacher ID" />
                    </div>
                )}
                {signInType === "student" && (
                    <div className="input-group">
                        <FontAwesomeIcon icon={faUserGraduate} className="icon" />
                        <input className="input-field" type="text" name="usn" placeholder="USN" />
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

import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Demo credentials
  const demoTeacher = { username: "teacher1", password: "pass123" };
  const demoStudent = { username: "student1", password: "pass123" };

  const selectRole = (role) => {
    setSelectedRole(role);
    setUsername("");
    setPassword("");
  };

  const continueToPoll = () => {
    if (!selectedRole) {
      alert("⚠ Please select a role before continuing.");
      return;
    }

    if (username.trim() === "" || password.trim() === "") {
      alert("⚠ Please enter both username and password.");
      return;
    }

    if (selectedRole === "teacher") {
      if (username === demoTeacher.username && password === demoTeacher.password) {
        sessionStorage.setItem("username", `teacher-${username}`);
        navigate("/teacher-home-page");
      } else {
        alert("❌ Invalid username or password.");
      }
    } else if (selectedRole === "student") {
      if (username === demoStudent.username && password === demoStudent.password) {
        sessionStorage.setItem("username", `student-${username}`);
        navigate("/student-home-page");
      } else {
        alert("❌ Invalid username or password.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="poll-container text-center">
        <button className="btn btn-sm intervue-btn mb-5">
          <img src={stars} className="px-1" alt="spark" />
          Intervue Poll
        </button>

        <h3 className="poll-title">
          Welcome to the <b>Live Polling System</b>
        </h3>
        <p className="poll-description">
          Please select the role that best describes you to begin using the live polling system
        </p>

        {/* Role Selection */}
        <div className="d-flex justify-content-around mb-4">
          <div
            className={`role-btn ${selectedRole === "student" ? "active" : ""}`}
            onClick={() => selectRole("student")}
          >
            <p>I'm a Student</p>
            <span>Join polls and submit your answers.</span>
          </div>
          <div
            className={`role-btn ${selectedRole === "teacher" ? "active" : ""}`}
            onClick={() => selectRole("teacher")}
          >
            <p>I'm a Teacher</p>
            <span>Submit questions and view results in real-time.</span>
          </div>
        </div>

        {/* Login Fields */}
        {selectedRole && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              className="form-control mb-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <button className="btn continue-btn" onClick={continueToPoll}>
          Continue
        </button>

        {/* Demo Credentials Note */}
        <div style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
          <p>💡 <b>Teacher</b>: teacher1 / pass123</p>
          <p>💡 <b>Student</b>: student1 / pass123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

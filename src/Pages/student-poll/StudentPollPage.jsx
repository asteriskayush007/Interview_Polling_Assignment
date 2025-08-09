import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentPollPage.css";
import stopwatch from "../../assets/stopwatch.svg";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/spark.svg";

const StudentPollPage = () => {
  const [votes, setVotes] = useState({});
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [kickedOut, setKickedOut] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Initial poll data load once
  useEffect(() => {
    loadPollData();
  }, []);

  // Load poll data function
  const loadPollData = () => {
    const pollData = JSON.parse(localStorage.getItem("currentPoll"));
    const storedVotes = JSON.parse(localStorage.getItem("votes")) || {};

    if (pollData) {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes(storedVotes);
      setTimeLeft(pollData.timer);
      setSubmitted(false);
      setSelectedOptionIndex(null);
    } else {
      setPollQuestion("");
      setPollOptions([]);
      setVotes({});
      setTimeLeft(0);
      setSubmitted(false);
      setSelectedOptionIndex(null);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, submitted]);

  const handleOptionSelect = (index) => {
    if (!submitted && timeLeft > 0) {
      setSelectedOptionIndex(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionIndex === null) {
      alert("Please select an option before submitting!");
      return;
    }

    const username = sessionStorage.getItem("username");
    if (!username) {
      alert("No user logged in!");
      navigate("/");
      return;
    }

    const optionText = pollOptions[selectedOptionIndex]?.text;
    if (!optionText) {
      alert("Invalid option selected!");
      return;
    }

    const storedVotes = JSON.parse(localStorage.getItem("votes")) || {};
    storedVotes[optionText] = (storedVotes[optionText] || 0) + 1;
    localStorage.setItem("votes", JSON.stringify(storedVotes));
    setVotes(storedVotes);
    setSubmitted(true);
  };

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <>
      <ChatPopover />
      {kickedOut ? (
        <div>kicked</div>
      ) : (
        <>
          {pollQuestion === "" && timeLeft === 0 && (
            <div className="d-flex justify-content-center align-items-center vh-100 w-75 mx-auto">
              <div className="student-landing-container text-center">
                <button className="btn btn-sm intervue-btn mb-5">
                  <img src={stars} className="px-1" alt="" />
                  Intervue Poll
                </button>
                <div className="spinner-border spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="landing-title">
                  <b>Wait for the teacher to ask questions..</b>
                </h3>
              </div>
            </div>
          )}
          {pollQuestion !== "" && (
            <div className="container mt-5 w-50">
              <div className="d-flex align-items-center mb-4">
                <h5 className="m-0 pe-5">Question</h5>
                <img src={stopwatch} width="15px" alt="Stopwatch" />
                <span className="ps-2 text-danger">{timeLeft}s</span>
              </div>
              <div className="card">
                <div className="card-body">
                  <h6 className="question py-2 ps-2 rounded text-white">
                    {pollQuestion}?
                  </h6>
                  <div className="list-group mt-4">
                    {pollOptions.map((option, index) => (
                      <div
                        key={option.id || option.text || index}
                        className={`list-group-item rounded m-1 ${
                          selectedOptionIndex === index
                            ? "border option-border"
                            : ""
                        }`}
                        style={{
                          padding: "10px",
                          cursor:
                            submitted || timeLeft === 0
                              ? "not-allowed"
                              : "pointer",
                        }}
                        onClick={() => handleOptionSelect(index)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            className={`ml-2 ${
                              submitted ? "font-weight-bold" : ""
                            }`}
                          >
                            {option.text}
                          </span>
                          {submitted && (
                            <span>
                              {Math.round(
                                calculatePercentage(votes[option.text] || 0)
                              )}
                              %
                            </span>
                          )}
                        </div>
                        {submitted && (
                          <div className="progress mt-2">
                            <div
                              className="progress-bar progress-bar-bg"
                              role="progressbar"
                              style={{
                                width: `${calculatePercentage(
                                  votes[option.text] || 0
                                )}%`,
                              }}
                              aria-valuenow={votes[option.text] || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!submitted && selectedOptionIndex !== null && timeLeft > 0 && (
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn continue-btn my-3 w-25"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mt-5">
                  <h6 className="text-center">
                    Wait for the teacher to ask a new question...
                  </h6>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StudentPollPage;

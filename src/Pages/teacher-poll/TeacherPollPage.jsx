import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";

const TeacherPollPage = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const navigate = useNavigate();

  // Function to load poll data from localStorage
  const loadPollData = () => {
    const pollData = JSON.parse(localStorage.getItem("currentPoll"));
    if (pollData) {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      const storedVotes = JSON.parse(localStorage.getItem("votes")) || {};
      setVotes(storedVotes);
      setTotalVotes(Object.values(storedVotes).reduce((a, b) => a + b, 0));
    } else {
      setPollQuestion("");
      setPollOptions([]);
      setVotes({});
      setTotalVotes(0);
    }
  };

  useEffect(() => {
    loadPollData();

    // Listen to storage event to update votes in real-time
    const handleStorageChange = (event) => {
      if (event.key === "votes" || event.key === "currentPoll") {
        loadPollData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <>
      <button
        className="btn rounded-pill ask-question poll-history px-4 m-2"
        onClick={handleViewPollHistory}
      >
        <img src={eyeIcon} alt="" />
        View Poll history
      </button>
      <br />
      <div className="container mt-5 w-50">
        <h3 className="mb-4 text-center">Poll Results</h3>

        {pollQuestion ? (
          <>
            <div className="card">
              <div className="card-body">
                <h6 className="question py-2 ps-2 text-left rounded text-white">
                  {pollQuestion} ?
                </h6>
                <div className="list-group mt-4">
                  {pollOptions.map((option, i) => (
                    <div key={i} className="list-group-item rounded m-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{option.text}</span>
                        <span>
                          {Math.round(calculatePercentage(votes[option.text] || 0))}%
                        </span>
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-bg"
                          role="progressbar"
                          style={{ width: `${calculatePercentage(votes[option.text] || 0)}%` }}
                          aria-valuenow={votes[option.text] || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <button
                className="btn rounded-pill ask-question px-4 m-2"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </>
        ) : (
          <div className="text-muted">Waiting for the teacher to start a new poll...</div>
        )}
        <ChatPopover />
      </div>
    </>
  );
};

export default TeacherPollPage;

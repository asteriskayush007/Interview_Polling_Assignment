import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/back.svg";

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Dummy poll data for frontend testing
    const dummyPolls = [
      {
        _id: "1",
        question: "What is your favorite programming language",
        options: [
          { _id: "1", text: "JavaScript", votes: 10 },
          { _id: "2", text: "Python", votes: 15 },
          { _id: "3", text: "Java", votes: 5 },
        ],
      },
      {
        _id: "2",
        question: "Which frontend framework do you prefer",
        options: [
          { _id: "1", text: "React", votes: 20 },
          { _id: "2", text: "Vue", votes: 8 },
          { _id: "3", text: "Angular", votes: 6 },
        ],
      },
    ];
    setPolls(dummyPolls);
  }, []);

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const handleBack = () => {
    navigate("/teacher-home-page");
  };

  let questionCount = 0;

  return (
    <div className="container mt-5 w-50">
      <div className="mb-4 text-left">
        <img
          src={backIcon}
          alt="Back"
          width="25"
          style={{ cursor: "pointer" }}
          onClick={handleBack}
        />{" "}
        View <b>Poll History</b>
      </div>

      {polls.length > 0 ? (
        polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          return (
            <div key={poll._id}>
              <div className="pb-3">{`Question ${++questionCount}`}</div>
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="question py-2 ps-2 text-left rounded text-white bg-primary">
                    {poll.question} ?
                  </h6>
                  <div className="list-group mt-4">
                    {poll.options.map((option) => (
                      <div
                        key={option._id}
                        className="list-group-item rounded m-2"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{option.text}</span>
                          <span>
                            {Math.round(
                              calculatePercentage(option.votes, totalVotes)
                            )}
                            %
                          </span>
                        </div>
                        <div className="progress mt-2">
                          <div
                            className="progress-bar progress-bar-bg"
                            role="progressbar"
                            style={{
                              width: `${calculatePercentage(
                                option.votes,
                                totalVotes
                              )}%`,
                            }}
                            aria-valuenow={option.votes}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-muted">Polls not found</div>
      )}
    </div>
  );
};

export default PollHistoryPage;

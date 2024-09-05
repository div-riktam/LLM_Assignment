import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "./Candidate.css"; // Import the CSS file for styling
import DoubtForum from "./DoubtForum";

const JOBS = [
  {
    _id: "60d0fe4f5311236168a109ca",
    jobTitle: "Software Engineer",
    skills: "JavaScript, React, Node.js",
    experience: "3",
    difficultyLevel: "7",
    programmingLanguage: "JavaScript",
  },
  {
    _id: "60d0fe4f5311236168a109cb",
    jobTitle: "Frontend Developer",
    skills: "HTML, CSS, JavaScript",
    experience: "2",
    difficultyLevel: "5",
    programmingLanguage: "JavaScript",
  },
  {
    _id: "60d0fe4f5311236168a109cc",
    jobTitle: "Backend Developer",
    skills: "Node.js, Express, MongoDB",
    experience: "4",
    difficultyLevel: "8",
    programmingLanguage: "JavaScript",
  },
];

const Candidate = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setEditorValue] = useState(""); // To store editor value
  const [language, setLanguage] = useState("javascript"); // Default language
  const [resetDoubtForum, setResetDoubtForum] = useState(false); // State to reset DoubtForum

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // const response = await axios.get("/api/candidate/getJobs");
        // setJobs(response.data);
        setJobs(JOBS);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };
    fetchJobs();
  }, []);

  const handleJobSelect = async (job) => {
    try {
      setLoading(true);
      setSelectedJob(job);
      const response = await axios.post(
        "http://localhost:4000/interview/questions",
        job
      );
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error("Error generating questions", error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    setEditorValue(value); // Update editor value
  };

  const handleSubmit = async () => {
    const currentQuestionData = questions[currentQuestion];
    const answer =
      currentQuestionData.type === 2
        ? currentAnswer
        : answers[currentQuestion]?.answer;

    const updatedAnswers = [
      ...answers,
      { question: currentQuestionData, answer },
    ];
    setAnswers(updatedAnswers);

    try {
      // await axios.post("/api/candidate/saveAnswer", {
      //   jobId: selectedJob._id,
      //   questionId: currentQuestionData.questionId,
      //   answer,
      // });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setEditorValue(""); // Clear editor value
        setResetDoubtForum(true); // Trigger reset for DoubtForum
      } else {
        submitAnswers(updatedAnswers);
      }
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  };

  const submitAnswers = async (answers) => {
    try {
      await axios.post("/api/candidate/submitAnswers", {
        jobId: selectedJob._id,
        answers,
      });
      alert("Interview completed. Your answers have been submitted.");
    } catch (error) {
      console.error("Error submitting answers", error);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const renderQuestion = (question) => {
    switch (Number(question.type)) {
      case 0: // Text question
        return (
          <div className="question-card">
            <h3>{question.question}</h3>
            <input
              type="text"
              onChange={(e) => handleAnswerChange(e.target.value)}
              value={currentAnswer}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        );
      case 1: // Multiple choice question
        return (
          <div className="question-card">
            <h3>{question.question}</h3>
            {question.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="multipleChoice"
                  value={option}
                  onClick={() => handleAnswerChange(option)}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        );
      case 2: // Coding question
        return (
          <div className="question-card">
            <h3>{question.question}</h3>
            <label htmlFor="language-select">Select Language: </label>
            <select id="language-select" onChange={handleLanguageChange}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              {/* Add more languages as needed */}
            </select>
            <Editor
              height="60vh"
              language={language}
              defaultValue="// Write your code below"
              onChange={handleAnswerChange}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        );
      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div className="candidate-container">
      {!selectedJob ? (
        <div className="job-list">
          <h2>Select a Job</h2>
          <ul>
            {jobs.map((job) => (
              <li
                key={job._id}
                onClick={() => handleJobSelect(job)}
                className="job-card"
              >
                {job.jobTitle} with {job.experience} years of experience
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="questions-container">
          {loading ? (
            <div className="spinner"></div>
          ) : questions.length > 0 ? (
            <div>
              {renderQuestion(questions[currentQuestion])}
              <DoubtForum reset={resetDoubtForum} />{" "}
              {/* Include DoubtForum below each question card */}
            </div>
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Candidate;

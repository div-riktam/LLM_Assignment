import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "./Candidate.css"; // Import the CSS file for styling
import DoubtForum from "./DoubtForum";
import { useNavigate } from "react-router-dom";

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
  const [currentInterviewId, setCurrentInterviewId] = useState(null);
  const navigate = useNavigate();
  const questionCardRef = useRef(null); // Ref for the question card

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/interview/jobs");
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Scroll to the question card when the currentQuestion changes
    if (questionCardRef.current) {
      questionCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentQuestion]);

  const handleJobSelect = async (job) => {
    try {
      const newInterview = await axios.post("http://localhost:4000/interview/", {
        jobID: job._id,
      });
      setCurrentInterviewId(newInterview.data.interviewID);
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
    setEditorValue(value); // Update editor value for coding questions
  };

  const handleSubmit = async () => {
    const currentQuestionData = questions[currentQuestion];
    let answer;

    // Handle different types of questions
    if (currentQuestionData.type === 2) {
      answer = currentAnswer; // For coding questions, get the editor value
    } else {
      answer = currentAnswer || answers[currentQuestion]?.answer; // For text and multiple-choice
    }

    // Combine question and answer
    const updatedQuestionWithAnswer = {
      question: currentQuestionData.question,
      answer: answer,
    };

    const updatedAnswers = [
      ...answers,
      updatedQuestionWithAnswer,
    ];

    setAnswers(updatedAnswers); // Save the updated answers in the state

    try {
      await axios.post("http://localhost:4000/interview/answer", {
        interviewID: currentInterviewId,
        questions: updatedAnswers
      });

      // If there are more questions, move to the next one
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setEditorValue(""); // Clear editor/input for the next question
        setResetDoubtForum(true); // Reset the doubt forum
      } else {
        // When all questions are done, submit the full set of answers
        submitAnswers(updatedAnswers);
      }
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  };

  const submitAnswers = async (answers) => {
    try {
      alert("Interview completed. Your answers have been submitted.");
      navigate("/");
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
          <React.Fragment>
            <div className="question-card" ref={questionCardRef}>
              <h3>{question.question}</h3>
              <input
                type="text"
                onChange={(e) => handleAnswerChange(e.target.value)}
                value={currentAnswer}
              />
              <button onClick={handleSubmit}>Submit</button>
            </div>
            <DoubtForum reset={resetDoubtForum} question={questions[currentQuestion].question} />
          </React.Fragment>

        );
      case 1: // Multiple choice question
        return (
          <React.Fragment>
            <div className="question-card" ref={questionCardRef}>
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
            <DoubtForum reset={resetDoubtForum} question={questions[currentQuestion].question} />
          </React.Fragment>

        );
      case 2: // Coding question
        return (
          <React.Fragment>
            <div className="question-card" ref={questionCardRef}>
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
            <DoubtForum reset={resetDoubtForum} question={questions[currentQuestion].question} />
          </React.Fragment>
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

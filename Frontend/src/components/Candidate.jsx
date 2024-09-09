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
  const [resetDoubtForum, setResetDoubtForum] = useState(false); // State to reset DoubtForum
  const [currentInterviewId, setCurrentInterviewId] = useState(null);
  const navigate = useNavigate();
  const [doubt, setDoubt] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const questionCardRef = useRef(null); // Ref for the question card

  // Fetch jobs once on component mount
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

  // Scroll to the question card when the currentQuestion changes
  useEffect(() => {
    if (questionCardRef.current) {
      questionCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentQuestion]);

  // Handle job selection and fetching questions
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

  // Handle editor/input value changes
  const handleAnswerChange = (value) => {
    setEditorValue(value); // Update editor value for coding/text questions
  };

  // Handle answer submission
  const handleSubmit = async () => {
    const currentQuestionData = questions[currentQuestion];
    const answer = currentAnswer || answers[currentQuestion]?.answer;

    const updatedQuestionWithAnswer = {
      question: currentQuestionData.question,
      answer: answer,
    };

    const updatedAnswers = [...answers, updatedQuestionWithAnswer];
    setAnswers(updatedAnswers);

    try {
      const lastAnswer = updatedAnswers[updatedAnswers.length - 1];
      lastAnswer.chat = chat;

      await axios.post("http://localhost:4000/interview/answer", {
        interviewID: currentInterviewId,
        questions: updatedAnswers,
        chat,
      });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setEditorValue(""); // Clear input for next question
        setResetDoubtForum(true); // Reset DoubtForum
        setTimeout(() => setResetDoubtForum(false), 500); // Ensure reset is cleared
      } else {
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

  const renderQuestion = (question) => {
    switch (Number(question.type)) {
      case 0: // Text question
        return (
          <div className="question-card" ref={questionCardRef}>
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
          <div className="question-card" ref={questionCardRef}>
            <h3>{question.question}</h3>
            {question.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="multipleChoice"
                  value={option}
                  onChange={() => handleAnswerChange(option)}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
          </div>
        );
      case 2: // Coding question
        return (
          <div className="question-card" ref={questionCardRef}>
            <h3>{question.question}</h3>
            <div className="editor-container">
              <Editor
                height="100%" 
                language={selectedJob.programmingLanguage}
                defaultValue="// Write your code here"
                onChange={handleAnswerChange}
              />
            </div>
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
                {job.jobTitle} ({job.experience} years of experience)
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
              <DoubtForum
                doubt={doubt}
                setDoubt={setDoubt}
                setChat={setChat}
                setIsTyping={setIsTyping}
                chat={chat}
                isTyping={isTyping}
                reset={resetDoubtForum}
                question={questions[currentQuestion].question}
              />
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

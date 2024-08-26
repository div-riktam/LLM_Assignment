import React, { useState } from 'react';
import axios from 'axios'
import Editor from '@monaco-editor/react';
import './index.css'; // Import the CSS file

const App = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const fetchQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:4000/interview/questions', {
        jobTitle,
        skills,
        experience,
        difficultyLevel
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.data;
      setQuestions(result);
      setCurrentIndex(0); // Reset to the first question
      setAnswers({}); // Reset previous answers
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      questionIndex: value
    });
  };

  const handleSwipe = (direction) => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'right' && currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 0:
        return (
          <div>
            <p>{question.question}</p>
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <p>{question.question}</p>
            {question.options.map((option, optIndex) => (
              <div key={optIndex}>
                <input
                  type="radio"
                  id={`option-${optIndex}`}
                  name={`question-${index}`}
                  checked={answers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                />
                <label htmlFor={`option-${optIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div>
            <p>{question.question}</p>
            <Editor
              height="90vh"
              defaultLanguage="javascript"
              defaultValue="// Write your code below"
              onChange={handleAnswerChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <label>Interview Question Generator</label>
      <form
        onSubmit={(e) => {
          console.log("Submitted")
          e.preventDefault();
          fetchQuestions();
        }}
        className="form"
      >
        <div className="form-group">
          <label>Job Title:</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Skills:</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Experience (years):</label>
          <input
            type="number"
            step="0.1"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Difficulty Level:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Get Questions</button>
      </form>

      {questions.length > 0 && (
        <div>
          <button onClick={() => handleSwipe('left')} className="nav-button">Previous</button>
          <button onClick={() => handleSwipe('right')} className="nav-button">Next</button>
          <div className="question-card">
            {renderQuestion(questions[currentIndex], currentIndex)}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

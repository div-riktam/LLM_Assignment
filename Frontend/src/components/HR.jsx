import React, { useState } from "react";
import axios from "axios";
import "./HR.css"; // Import the CSS file for styling

const HR = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    skills: "",
    experience: "",
    difficultyLevel: "",
    programmingLanguage: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/interview/job", formData);
      alert(response.data.message);
      setFormData({
        jobTitle: "",
        skills: "",
        experience: "",
        difficultyLevel: "",
        programmingLanguage: "",
      })
    } catch (error) {
      console.error("Error posting job", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hr-form">
      <h2 className="form-title">Add a New Job Posting</h2>
      <input
        className="form-input"
        name="jobTitle"
        placeholder="Job Title"
        value={formData.jobTitle}
        onChange={handleChange}
      />
      <input
        className="form-input"
        name="skills"
        placeholder="Skills"
        value={formData.skills}
        onChange={handleChange}
      />
      <input
        className="form-input"
        name="experience"
        placeholder="Experience"
        value={formData.experience}
        onChange={handleChange}
      />
      <input
        className="form-input"
        name="difficultyLevel"
        placeholder="Difficulty Level"
        value={formData.difficultyLevel}
        onChange={handleChange}
      />
      
      <select
        className="form-input"
        name="programmingLanguage"
        value={formData.programmingLanguage}
        onChange={handleChange}
      >
        <option value="">Select Programming Language</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="php">PHP</option>
        <option value="go">Go</option>
        <option value="ruby">Ruby</option>
        <option value="sql">SQL</option>
      </select>

      <button type="submit" className="form-button">
        Add Job
      </button>
    </form>
  );
};

export default HR;

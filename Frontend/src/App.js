import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import HR from './components/HR';
import Candidate from './components/Candidate';

function App() {
  return (
    <Router>
      <div>
        <h1>Welcome to the Interview App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/candidate" element={<Candidate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

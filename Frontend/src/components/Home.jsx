import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="card-container">
      <ul>
        <li>
          <Link to="/hr" className="card-link">
            HR
          </Link>
        </li>
        <li>
          <Link to="/candidate" className="card-link">
            Candidate
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;

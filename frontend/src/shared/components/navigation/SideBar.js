// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation

import './SideBar.css'; // Import the stylesheet
import useAuth from '../../hooks/useAuth';

const SideBar = () => {
    const auth = useAuth();

  return (
    <div className="sidebar">
      <h2>welcome {auth.role}</h2>
      <nav>
        <ul>
          <li>
            <Link to="/profile" >Profile </Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;

// NotFound.js
import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import Button from '../FormElements/Button';
import './NotFound.css';
const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for might be under construction or does not exist.</p>
      
        <Button onClick={goBack}>Go Back</Button>
      
    </div>
  );
};

export default NotFound;

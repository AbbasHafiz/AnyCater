import React, { useState, useEffect } from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import { Link, Route, Routes } from 'react-router-dom';
import Profile from '../Profile';
import '../owner/OwnerDashboard.css';
import { useHttpClient } from '../../../shared/hooks/http-hook';

const OwnerDashboard = () => {
  const auth = useAuth();
  const apiEndpoints = API_ENDPOINTS();
  const [profileData, setProfileData] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  
  const handleUpdateImage = (newImage) => {
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      image: newImage,
    }));
  };
  if (!auth.isLoggedIn || auth.role !== 'Owner') {
    return <p>Please log in to access the Owner dashboard.</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="user-profile">
            {profileData && profileData.image && (
              <img
                src={`${apiEndpoints.BASE_URL}/${profileData.image}`}
                alt="User Profile"
                className="profile-image"
              />
            )}
            <h4 className="username">Welcome, {auth.username}!</h4>
          </div>
          <ul>
            <li>
              <Link to="profile">Profile</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/manage-address">Manage Restaurant</Link>
            </li>
          </ul>
        </div>
        {/* End of Sidebar */}
      </div>
      <Routes>
        <Route path="profile" element={<Profile onUpdateImage={handleUpdateImage} />} />
        {/* Add more routes for other tabs if needed */}
      </Routes>
    </div>
  );
};

export default OwnerDashboard;

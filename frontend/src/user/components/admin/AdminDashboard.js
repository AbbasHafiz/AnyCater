import React, { useState, useEffect } from 'react';

import useAuth from '../../../shared/hooks/useAuth';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import '../admin/AdminDashboard.css';
//import "../user/UserDashboard.css";
import { Link, Route, Routes} from 'react-router-dom';
import Profile from '../Profile';
import { useHttpClient } from '../../../shared/hooks/http-hook';
const AdminDashboard = () => {
  const auth = useAuth();
  const apiEndpoints = API_ENDPOINTS();
  const [profileData, setProfileData] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await sendRequest(apiEndpoints.USER_PROFILE);
        setProfileData(responseData);
      } catch (error) {
        //  console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [apiEndpoints.USER_PROFILE, sendRequest]);
  const handleUpdateImage = (newImage) => {
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      image: newImage,
    }));
  };
  if (!auth.isLoggedIn || auth.role !== 'Admin') {
    return <p>Please log in to access the user dashboard.</p>;
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
            {/* Add other links as needed */}
          </ul>
        </div>
        {/* End of Sidebar */}
      </div>

      {/* Content */}
      <Routes>
      <Route path="profile" element={<Profile onUpdateImage={handleUpdateImage} />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;

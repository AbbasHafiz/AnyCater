import React, { useState, useEffect } from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import { Link, Route, Routes } from 'react-router-dom';
import '../user/UserDashboard.css';
import Profile from '../Profile';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import ManageAddress from './ManageAddress';
const UserDashboard = () => {
  const auth = useAuth();
  const apiEndpoints = API_ENDPOINTS();
  const [profileData, setProfileData] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // State to trigger a re-render when the profile image is updated

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

  if (!auth.isLoggedIn || auth.role !== 'User') {
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
            <li>
              <Link to="dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="orders">Orders</Link>
            </li>
            <li>
              <Link to="manage-address">Manage Addres</Link>
            </li>
          
            {/* Add other links as needed */}
          </ul>
        </div>
        {/* End of Sidebar */}
      </div>

      {/* Content */}
      <Routes>
      <Route path="profile" element={<Profile onUpdateImage={handleUpdateImage} />} />
      <Route path="manage-address" element ={<ManageAddress/>}/>
      </Routes>
    </div>
  );
};

export default UserDashboard;

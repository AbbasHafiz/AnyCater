import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import Profile from '../Profile';
import '../admin/AdminDashboard.css'; // Adjust path as per your project structure
import SiteSetting from './SiteSetting';

const AdminDashboard = () => {
  const auth = useAuth();
  const apiEndpoints = API_ENDPOINTS();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [profileData, setProfileData] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await sendRequest(apiEndpoints.USER_PROFILE);
        setProfileData(responseData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [apiEndpoints.USER_PROFILE, sendRequest]);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const responseData = await sendRequest(apiEndpoints.SLIDER);
        setImages(responseData.images);
      } catch (error) {
        console.error('Error fetching slider images:', error);
      }
    };

    fetchSliderImages();
  }, [apiEndpoints.SLIDER, sendRequest]);

  const handleUpdateImage = (newImage) => {
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
      image: newImage,
    }));
  };

  if (!auth.isLoggedIn || auth.role !== 'Admin') {
    return <p>Please log in to access the admin dashboard.</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
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
              <Link to="settings">Site Settings</Link> {/* Link to Settings component */}
            </li>
          </ul>
         
        </div>
      </div>

      <Routes>
        <Route path="profile" element={<Profile onUpdateImage={handleUpdateImage} />} />
        <Route path="settings" element={<SiteSetting />} /> {/* Route to Settings component */}
      </Routes>
    </div>
  );
};

export default AdminDashboard;

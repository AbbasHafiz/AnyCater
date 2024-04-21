import React, { useState, useEffect } from "react";
import useAuth from "../../shared/hooks/useAuth";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./Profile.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import EditProfile from "./EditProfile";
import { API_ENDPOINTS } from "../../shared/util/apiConfig";

const Profile = ({ onUpdateImage }) => {
  const auth = useAuth();
  const apiEndpoints = API_ENDPOINTS();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const goToEditProfile = () => {
    setEditMode(true);
  };
  const handleUpdateProfile = () => {
    // Refresh the user profile data after a successful update
    const fetchUserProfile = async () => {
      try {
        const responseData = await sendRequest(apiEndpoints.USER_PROFILE);
        setProfileData(responseData);
        setEditMode(false);
        onUpdateImage(); // Assuming this function updates the profile image in the UserDashboard
        // Update the image URL in the state
        onUpdateImage(responseData.image);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  };

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

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  if (error) {
    return (
      <>
        Error: <ErrorModal error={error} onClear={clearError} />
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <p>Error: </p>
        <LoadingSpinner asOverlay />;
      </>
    );
  }

  return (
    <div className="profile-container">
      <Card
        className="profile-card"
        style={{ marginTop: !editMode ? "-80px" : "0px !importent" }}
      >
        <div className="profile-content">
          {profileData.image && (
            <img
              src={`${apiEndpoints.BASE_URL}/${profileData.image}`}
              alt="User Profile"
              className="profile-image"
            />
          )}
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p>User Name: {profileData.username}</p>
            <p>Email: {profileData.email}</p>
            <p>Phone: {profileData.phoneNo}</p>
          </div>
          <div className="flexGrow">
            <div>
              <Button onClick={goToEditProfile} disabled={editMode}>
                Edit Profile
              </Button>
              {/* Render the edit form conditionally */}
              {editMode && (
                <EditProfile
                  onUpdateSuccess={handleUpdateProfile}
                  onUpdateImage={onUpdateImage}
                  userProfileData={profileData}
                />
              )}
            </div>
            <br />

            <Button onClick={goBack}>Close</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

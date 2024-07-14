import React, { useState } from 'react';
import MapUtil from '../../../shared/util/MapUtil';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import './ManageAddress.css'; // Import CSS file
import useAuth from '../../../shared/hooks/useAuth';

const ManageAddress = ({ userId }) => {
  const apiEndpoints = API_ENDPOINTS();
  const { sendRequest } = useHttpClient();
  const auth = useAuth();

  // State variables to track live address, latitude, and longitude
  const [liveAddress, setLiveAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Function to handle fetching live address
  const fetchAddress = async () => {
    try {
      // Check if Geolocation is supported by the browser
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Fetch address using latitude and longitude
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              setLiveAddress(data.display_name);
              setLatitude(latitude);
              setLongitude(longitude);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        });
      } else {
        console.error('Geolocation is not supported by this browser');
      }
    } catch (error) {
      console.error('Error fetching live address:', error);
    }
  };

  // Function to handle updating user location
  const handleUpdateLocation = async () => {
    try {
      await sendRequest(apiEndpoints.updateUserLocation(auth.userId), 'PATCH', {
        latitude,
        longitude,
        address: liveAddress,
      });
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  // Function to handle adding user location
  const handleAddLocation = async () => {
    try {
      await sendRequest(apiEndpoints.addUserLocation(auth.userId), 'POST', {
        latitude,
        longitude,
        address: liveAddress,
      });
    } catch (error) {
      console.error('Error adding user location:', error);
    }
  };

  // Function to handle pin drop event
  const handlePinDrop = (droppedLatitude, droppedLongitude) => {
    setLatitude(droppedLatitude);
    setLongitude(droppedLongitude);
  };

  // Render UI
  return (
    <div className="manage-address-container">
      <h2>User Location</h2>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Address: {liveAddress}</p>

      <h2>Update User Location</h2>
      <div className="map-input-container">
        <button onClick={fetchAddress}>Fetch Live Address</button>
        <button onClick={handleUpdateLocation}>Update User Location</button>
        <button onClick={handleAddLocation}>Add User Location</button>
        <MapUtil
          latitude={latitude}
          longitude={longitude}
          onUpdateLocation={handlePinDrop} // Pass handlePinDrop function
        />
      </div>
    </div>
  );
};

export default ManageAddress;

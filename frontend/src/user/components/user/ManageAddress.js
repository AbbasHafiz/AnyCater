import React, { useState, useEffect } from 'react';
import MapUtil from '../../../shared/util/MapUtil';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import { API_ENDPOINTS } from '../../../shared/util/apiConfig';
import './ManageAddress.css'; // Import CSS file
import useAuth from '../../../shared/hooks/useAuth';

const ManageAddress = ({ userId }) => {
  const apiEndpoints = API_ENDPOINTS();
  const { sendRequest } = useHttpClient();
  const auth = useAuth();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const responseData = await sendRequest(apiEndpoints.getUserLocation(auth.userId));
        if (responseData.location) {
          setLatitude(responseData.location.latitude);
          setLongitude(responseData.location.longitude);
          setAddress(responseData.location.address);
        } else {
          await handleAddLocation(); // User has no location, add a new one
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
        console.log('Error details:', error); // Log error details
      }
    };
  
    fetchUserLocation();
  }, [apiEndpoints, auth.userId, sendRequest]);
  

  const handleUpdateLocation = async (latitude, longitude, address) => {
    setLatitude(latitude);
    setLongitude(longitude);
    setAddress(address);

    try {
      await sendRequest(apiEndpoints.updateUserLocation(auth.userId), 'PATCH', {
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  const handleAddLocation = async () => {
    try {
      await sendRequest(apiEndpoints.addUserLocation(auth.userId), 'POST', {
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      console.error('Error adding new location:', error);
    }
  };

  const handleInputChange = async (inputAddress) => {
    setAddress(inputAddress);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputAddress)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLatitude(lat);
        setLongitude(lon);
        setAddress(display_name);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };


  if (!auth.isLoggedIn || auth.role !== 'User') {
    return <p>Please log in to access the user dashboard.</p>;
  }

  return (
    <div className="manage-address-container">
      <h2>User Location</h2>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Address: {address}</p>

      <h2>Update User Location</h2>
      <div className="map-input-container">
        <input
          type="text"
          placeholder="Enter address..."
          value={address}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <button onClick={handleAddLocation}>Add Location</button>
        <MapUtil
          latitude={latitude}
          longitude={longitude}
          onUpdateLocation={handleUpdateLocation}
        />
      </div>
    </div>
  );
};

export default ManageAddress;

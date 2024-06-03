// apiConfig.js
import useAuth from "../hooks/useAuth"; 
// utils.js (or any appropriate file)
//https://fabulous-ordinary-rail.glitch.me/
const BASE_URL = 'https://fabulous-ordinary-rail.glitch.me';
const getApiEndpoints = (auth) => {
   
  
  
    return {
    BASE_URL:BASE_URL,
      GET_USERS: `${BASE_URL}/api/users`,
      GET_POSTS: `${BASE_URL}/api/orders`,
      REGISTER: `${BASE_URL}/api/users/register`,
      LOGIN: `${BASE_URL}/api/users/login`,
      DELETE_USER: (userId) => `${BASE_URL}/users/${userId}/delete`,
      EDIT_PROFILE: `${BASE_URL}/api/users/edit-profile/${auth.userId}`,
      USER_PROFILE: `${BASE_URL}/api/users/user-profile/${auth.userId}`, 
      getUserLocation: (userId) => `${BASE_URL}/api/locations/user-location/${auth.userId}`,
      updateUserLocation: (userId) => `${BASE_URL}/api/locations/update-user-location/${auth.userId}`,
      addUserLocation: (userId) => `${BASE_URL}/api/locations/add-user-location/${auth.userId}`,

    };
  };
  
export const API_ENDPOINTS = () => {
  const auth = useAuth(); 
  return getApiEndpoints(auth);
};

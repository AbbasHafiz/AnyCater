// apiConfig.js
import useAuth from "../hooks/useAuth"; 
// utils.js (or any appropriate file)
//https://fabulous-ordinary-rail.glitch.me/https://bb027c97-5d7b-4615-97ef-dc13408dad2a-00-78rjh1jf4lwo.pike.replit.dev'
const BASE_URL = 'http://localhost:6400';
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

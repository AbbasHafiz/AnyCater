const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
  // Extract the token from the request header
  if (req.method === 'OPTIONS') {
    return next();
  }
  const token = req.headers.authorization.split(' ')[1];

  // Check if the token exists
  if (!token) {
    return next(new HttpError('Authentication failed. No token provided.', 401));
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, 'yourSecretKey'); // Replace 'your-secret-key' with your actual secret key

    // Attach the decoded user data to the request
    req.userData = { userId: decodedToken.userId};

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    return next(new HttpError('Authentication failed. Invalid token.', 401));
  }
};

module.exports = checkAuth;
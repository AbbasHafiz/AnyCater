const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkRole = require('../middleware/checkRole');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const secretKey = 'yourSecretKey'; // Replace with your secret key for JWT

const userController = {
  registerUser: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { username, name, phoneNo, email, password } = req.body;
    if (!username) {
      return next(new HttpError('Username is required', 400));
    }
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return next(new HttpError('User already exists', 400));
      }
  
      // Handle image upload
      const image = req.file; // Assuming you're using multer or a similar middleware for file uploads
      if (!image) {
        return next(new HttpError('Please provide an image', 400));
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        name,
        email,
        phoneNo,
        password: hashedPassword,
        role: 'User',
        image: image.path, // Save the file path or other relevant information in your User schema
      });
  
      await newUser.save();
  
      // Generate a JWT token
      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, role: newUser.role,username:newUser.username ,image: newUser.image?.replace(/\\/g, '/'),},
        secretKey, // replace with your actual secret key
        { expiresIn: '1h' } // Token expiration time
      );
  
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error during registration:', error);
      next(new HttpError('Registration failed', 500));
    }
  },
     loginUser : async (req, res, next) => {
        const { email, password } = req.body;
      
        try {
          const user = await User.findOne({ email });
      
          if (!user) {
            return next(new HttpError('User not found', 404));
          }
      
          const passwordMatch = await bcrypt.compare(password, user.password);
      
          if (!passwordMatch) {
            return next(new HttpError('Invalid credentials', 401));
          }

        
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
              role: user.role,
              username: user.username,
              image: user.image?.replace(/\\/g, '/'), // Corrected image path
            },
            secretKey,
            { expiresIn: '1h' }
          );
          
      
          res.status(200).json({ message: 'Login successful', token, role: user.role });
        } catch (error) {
          next(new HttpError('Login failed', 500));
        }
      },

      getUserProfile: async (req, res, next) => {
        const userId = req.params.id;
    
        try {
            const user = await User.findById(userId);
    
            if (!user) {
                return next(new HttpError('User not found', 404));
            }
    
            // Assume 'Image' is a separate model
            
    
            const userProfile = {
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name,
                phoneNo: user.phoneNo,
                image: user.image,
            };
    
            res.status(200).json(userProfile);
        } catch (error) {
            return next(new HttpError('Failed to fetch user profile', 500));
        }
    },
   // Assuming you have defined your User model and required modules...

   updateUserProfile: async (req, res, next) => {
    const userId = req.params.id;
    const { name, phoneNo } = req.body;
    const errors = validationResult(req);
    const image = req.file; // Assuming you're using multer or a similar middleware for file uploads
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    try {
      // Retrieve the user ID from the token
      const tokenUserId = req.userData.userId;
  
      // Check if the user making the request is the same as the one specified in the URL
      if (userId !== tokenUserId) {
        return next(new HttpError('You are not authorized to update this profile', 403));
      }
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return next(new HttpError('User not found', 404));
      }
  
      // Handle profile picture update
      if (!image) {
        return next(new HttpError('Please provide an image', 400));
      }
  
      // Update user profile fields
      user.name = name || user.name;
      user.phoneNo = phoneNo || user.phoneNo;
      user.image = image.path; // Assuming multer saves the file path in the 'path' property
  
      // Save the updated user profile
      await user.save();
  
      // Return the updated user profile
      const updatedUserProfile = {
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        phoneNo: user.phoneNo,
        image: user.image,
      };
  
      res.status(200).json(updatedUserProfile);
    } catch (error) {
      return next(new HttpError('Failed to update user profile', 500));
    }
  },
   

  
    getUserDetails : async (req, res, next) => {
        const userId = req.params.userId;
      
        try {
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Send relevant user details, including role
          res.json({
            name: user.name,
                phoneNo: user.phoneNo,
                
            // Add other necessary user details here
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Fetching user details failed' });
        }
      },
    // Additional function specific to "user" role
    updateUserSettings: async (req, res, next) => {
        const userId = req.params.id;
        const { settings } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return next(new HttpError('User not found', 404));
            }

            // Update user settings
            user.settings = settings;
            await user.save();

            res.status(200).json({ message: 'User settings updated successfully', settings: user.settings });
        } catch (error) {
            return next(new HttpError('Failed to update user settings', 500));
        }
    }
};

module.exports = userController;

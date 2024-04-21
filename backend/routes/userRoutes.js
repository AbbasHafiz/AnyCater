const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const checkRole = require('../middleware/checkRole');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/checkAuth');
// Register a new user

router.post(
    '/register',
    fileUpload.single('image'),
    [
        check('name').not().isEmpty(),
        check('username').not().isEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        // Additional validation if needed
    ],
    userController.registerUser
);

// Login a user
router.post(
    '/login',
    [
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        // Additional validation if needed
    ],
    userController.loginUser
);
const updateUserProfileValidation = [
    check('name').optional().isLength({ min: 3 }),
    check('phoneNo').optional().isMobilePhone('any', { strictMode: false }), // Adjust this based on your validation requirements
    
  ];
  
  // Update user profile route with validation
  
// Get user profile
router.get('/profile', userController.getUserProfile);
// Route to get user profile (accessible by all roles)
router.get('/user-profile/:id', userController.getUserProfile);
router.get('/:userId', userController.getUserDetails);

// Route to update user settings (accessible only by "user" role)
router.patch('/update-user-settings/:id',checkRole('user'), userController.updateUserSettings);
router.patch(
    '/edit-profile/:id',
    checkAuth,
    fileUpload.single('image'), // Assuming 'image' is the name attribute in the form data
    [
      check('name').not().isEmpty(),
      check('email').isEmail(),
      // Additional validation if needed
    ],
    updateUserProfileValidation,
    userController.updateUserProfile
  );
module.exports = router;

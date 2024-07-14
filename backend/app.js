const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const HttpError = require('./models/http-error'); // Make sure HttpError is imported

const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static files (images)
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

// CORS setup
app.use(cors());

// Define routes
const userRoutes = require('./routes/userRoutes');
const cateringShopRoutes = require('./routes/cateringShopRoutes');
const menuRoutes = require('./routes/menuRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const driverRoutes = require('./routes/driverRoutes');
const locationRoutes = require('./routes/locationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cateringOwnerRoutes = require('./routes/cateringOwnerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const notFoundMiddleware = require('./middleware/notFound');

app.use('/api/users', userRoutes);
app.use('/api/catering-shops', cateringShopRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drivers', driverRoutes); // Include if applicable
app.use('/api/locations', locationRoutes); // Include if applicable
app.use('/api/categories', categoryRoutes); // Include if applicable
app.use('/api/admin', adminRoutes); // Include if applicable
app.use('/api/catering-owner', cateringOwnerRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api', settingsRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// Handle not found middleware
app.use(notFoundMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
  // Delete uploaded file if there was an error during file upload
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  // Respond with appropriate status code and error message
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Max size allowed is 500 KB.' });
  } else if (err.code === 'INVALID_MIME_TYPE') {
    return res.status(400).json({ message: 'Invalid file type. Only JPEG, JPG, and PNG files are allowed.' });
  } else {
    return res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect(
    `mongodb+srv://abbashafiz09:dEAmBvAdugVcQK6M@cluster0.cw37ldi.mongodb.net/mydb?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
    
  })
  .catch(err => {
    console.log(err);
  });
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
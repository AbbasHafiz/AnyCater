require('dotenv').config(); // Load environment variables

const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const HttpError = require('./models/http-error');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));

// Routes
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
app.use('/api/drivers', driverRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catering-owner', cateringOwnerRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api', settingsRoutes);

// 404 route handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// Not found middleware
app.use(notFoundMiddleware);

// Error handler middleware
app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Max size allowed is 500 KB.' });
  } else if (err.code === 'INVALID_MIME_TYPE') {
    return res.status(400).json({ message: 'Invalid file type. Only JPEG, JPG, and PNG files are allowed.' });
  } else {
    return res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  })
  .catch(err => {
    console.log(err);
  });

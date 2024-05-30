const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
// Import routes
const bodyParser = require('body-parser');
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
// Apply middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});
app.use(cors());
// Define routes
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
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});
// Other app configurations, database connections, error handling, etc.
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

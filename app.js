const express = require('express');
const mongoose = require('mongoose');
const shoppingListRoutes = require('./routes/shoppingLists');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // For parsing JSON data
app.use('/shoppingLists', shoppingListRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });
  
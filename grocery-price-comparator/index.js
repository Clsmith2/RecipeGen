const express = require('express');
const mongoose = require('mongoose');
const groceryQueries = require('./queries/queries');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.get('/api/items/store/:store', groceryQueries.getItemsByStore);
app.get('/api/items/category/:category', groceryQueries.getItemsByCategory);
app.get('/api/items/brand/:brand', groceryQueries.getItemsByBrand);
app.get('/api/items/price-range', groceryQueries.getItemsByPriceRange);
app.get('/api/items/count/:store', groceryQueries.countItemsByStore);
app.get('/api/items/autocomplete', groceryQueries.getAutocomplete);
app.get('/api/items/search', groceryQueries.searchProductsByName);

// New route for calculating total price for items
app.post('/api/items/total-price', groceryQueries.getTotalPriceForItems);

// Route for recipe price comparison
app.post('/api/items/price-compare', groceryQueries.getRecipeCost);

// Route for recipe price comparison by store
app.post('/api/items/price-compare-by-store', groceryQueries.getRecipeCostByStore);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

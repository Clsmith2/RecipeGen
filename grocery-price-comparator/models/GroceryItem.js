// models/GroceryItem.js
const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
    store: String,
    category: String,
    name: String,
    price: Number,
    embedding: [Number],
});

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);

module.exports = GroceryItem;

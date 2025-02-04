// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  link: String,
  tcin: String,
  dpci: String,
  brand: String,
  rating: Number,
  ratings_total: Number,
  main_image: String,
  page: Number,
  position_overall: Number,
  price: Number,          // New field for price
  currency: String,       // New field for currency
  symbol: String,         // New field for currency symbol
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
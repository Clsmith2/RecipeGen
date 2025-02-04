// models/WalmartProduct.js
const mongoose = require('mongoose');

const walmartProductSchema = new mongoose.Schema({
  title: String,
  link: String,
  itemId: String,
  upc: String,
  brand: String,
  rating: Number,
  ratingsTotal: Number,
  mainImage: String,
  price: Number,
  stock: Boolean,
});

const WalmartProduct = mongoose.model('WalmartProduct', walmartProductSchema);

module.exports = WalmartProduct;

// controllers/productController.js
const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get the first x products
const getFirstXProducts = async (req, res) => {
  try {
    const count = parseInt(req.params.count, 10); // Convert count to an integer
    if (isNaN(count) || count <= 0) {
      return res.status(400).json({ message: 'Invalid count parameter' });
    }

    const products = await Product.find().limit(count); // Limit the number of products
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Additional CRUD operations can be added here

module.exports = {
  getAllProducts,
  getFirstXProducts,
  // Add other exports as needed
};

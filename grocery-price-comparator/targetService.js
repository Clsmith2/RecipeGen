require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const TARGET_API_BASE_URL = 'https://api.redcircleapi.com/request';
const API_KEY = process.env.TARGET_API_KEY;
const GROCERY_CATEGORY_ID = '5xt1a';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

async function getAllGroceryProducts(zipcode) {
  const limit = 50; // Number of items per page
  const deliveryType = 'buy_at_store';
  let totalPages = 1; // Default initial value

  try {
    // Fetch the first response to determine total pages
    const initialResponse = await axios.get(TARGET_API_BASE_URL, {
      params: {
        api_key: API_KEY,
        type: 'category',
        category_id: GROCERY_CATEGORY_ID,
        delivery_type: deliveryType,
        page: 1,
        max_page: 1,
        output: 'json',
        zipcode: zipcode,
      },
    });

    // Safely check and extract total pages
    if (
      initialResponse.data.pagination &&
      initialResponse.data.pagination.pages &&
      initialResponse.data.pagination.pages.length > 0
    ) {
      const paginationInfo = initialResponse.data.pagination.pages[0];
      totalPages = paginationInfo.total_pages || 1; // Extract total pages
    } else {
      console.error('Pagination information is missing in the API response');
      return;
    }

    // Process in batches of 5 pages using max_page
    for (let batchStartPage = 1; batchStartPage <= totalPages; batchStartPage += 5) {
      const maxPages = Math.min(batchStartPage + 4, totalPages); // Fetch up to 5 pages at a time

      const response = await axios.get(TARGET_API_BASE_URL, {
        params: {
          api_key: API_KEY,
          type: 'category',
          category_id: GROCERY_CATEGORY_ID,
          delivery_type: deliveryType,
          page: batchStartPage,
          max_page: maxPages, // Set max_page to retrieve up to 5 pages in one request
          output: 'json',
          zipcode: zipcode,
        },
      });

      const products = response.data.category_results || [];

      // Save products to the database
      for (const product of products) {
        await Product.create({
          title: product.product.title,
          link: product.product.link,
          tcin: product.product.tcin,
          dpci: product.product.dpci,
          brand: product.product.brand,
          rating: product.product.rating,
          ratings_total: product.product.ratings_total,
          main_image: product.product.main_image,
          page: product.page,
          position_overall: product.position_overall,
        });
      }

      console.log(`Batch starting at page ${batchStartPage} processed with ${products.length} products.`);
    }
  } catch (error) {
    console.error('Error fetching grocery products from Target API:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Test the function
getAllGroceryProducts('95120');

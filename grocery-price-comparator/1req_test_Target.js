require('dotenv').config();
const axios = require('axios');

const TARGET_API_BASE_URL = 'https://api.redcircleapi.com/request';
const API_KEY = process.env.TARGET_API_KEY;
const GROCERY_CATEGORY_ID = '5xt1a';

async function getOnePageOfGroceryProducts(zipcode) {
  try {
    const response = await axios.get(TARGET_API_BASE_URL, {
      params: {
        api_key: API_KEY,
        type: 'category',
        category_id: GROCERY_CATEGORY_ID,
        delivery_type: 'buy_at_store',
        page: 1, // Fetch the first page
        max_page: 1, // Only fetch one page
        output: 'json',
        zipcode: zipcode,
      },
    });

    const products = response.data.category_results || [];

    if (products.length > 0) {
      const productData = products.map(product => ({
        title: product.product.title,
        link: product.product.link,
        tcin: product.product.tcin,
        dpci: product.product.dpci,
        brand: product.product.brand,
        rating: product.product.rating,
        ratings_total: product.product.ratings_total,
        main_image: product.product.main_image,
        price: product.offers?.primary?.price, // Extracting the price
        currency: product.offers?.primary?.currency,
        symbol: product.offers?.primary?.symbol,
      }));

      console.log(productData); // Display the products data in the console
    } else {
      console.log('No products found.');
    }
  } catch (error) {
    console.error('Error fetching grocery products from Target API:', error);
  }
}

// Test the function
getOnePageOfGroceryProducts('95120');

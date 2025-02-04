const GroceryItem = require('../models/GroceryItem');
const cosineSimilarity = require('compute-cosine-similarity');
const axios = require('axios');

// Find all items in a specific store
exports.getItemsByStore = (req, res) => {
    GroceryItem.find({ store: req.params.store })
        .then(items => res.json(items))
        .catch(error => res.status(500).json({ error: 'Error fetching items' }));
};

// Find all items in a specific category
exports.getItemsByCategory = (req, res) => {
    GroceryItem.find({ category: req.params.category })
        .then(items => res.json(items))
        .catch(error => res.status(500).json({ error: 'Error fetching items' }));
};

// Find all items with a specific brand
exports.getItemsByBrand = (req, res) => {
    GroceryItem.find({ name: { $regex: new RegExp('^' + req.params.brand, 'i') } })
        .then(items => res.json(items))
        .catch(error => res.status(500).json({ error: 'Error fetching items' }));
};

// Find items within a price range
exports.getItemsByPriceRange = (req, res) => {
    const minPrice = parseFloat(req.query.min);
    const maxPrice = parseFloat(req.query.max);
    GroceryItem.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .then(items => res.json(items))
        .catch(error => res.status(500).json({ error: 'Error fetching items' }));
};

// Count the number of items in a specific store
exports.countItemsByStore = (req, res) => {
    GroceryItem.countDocuments({ store: req.params.store })
        .then(count => res.json({ count }))
        .catch(error => res.status(500).json({ error: 'Error counting items' }));
};
exports.getTotalPriceForItems = async (req, res) => {
    try {
        const items = req.body.items;  // Expecting an array of item names
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items provided' });
        }

        const stores = await GroceryItem.distinct('store');  // Get all unique store names

        const storeResults = await Promise.all(stores.map(async (store) => {
            const storeItems = await GroceryItem.find({ store, name: { $in: items } });
            const totalPrice = storeItems.reduce((sum, item) => sum + item.price, 0);
            return {
                store,
                totalPrice: totalPrice.toFixed(2),
                items: storeItems,
            };
        }));

        res.json(storeResults);
    } catch (error) {
        console.error('Error fetching total prices for items:', error);
        res.status(500).json({ error: 'Error fetching total prices for items' });
    }
};
exports.getAutocomplete = async (req, res) => {
    const limit = 5; // Fixed limit of 5
    const { query } = req.query;
    try {
        // Fetch distinct product names that match the query
        const distinctNames = await GroceryItem.distinct('name', { name: { $regex: new RegExp(query, 'i') } });

        // Limit the number of distinct names returned
        const limitedNames = distinctNames.slice(0, limit);

        res.json(limitedNames); // Return the limited distinct names
    } catch (error) {
        console.error('Error fetching autocomplete results:', error);
        res.status(500).json({ error: 'Error fetching autocomplete results' });
    }
};
exports.searchProductsByName = async (req, res) => {
    const { query } = req.query;
    try {
        // Find all unique product names that match the query
        const results = await GroceryItem.distinct('name', { name: { $regex: new RegExp(query, 'i') } });
        res.json(results); // Return the unique product names
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Error fetching search results' });
    }
};




// Fetch embeddings for multiple ingredients in a single request
async function getEmbeddingsForIngredients(ingredients) {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
            model: 'text-embedding-ada-002',
            input: ingredients
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.data.map(item => item.embedding);
}

// Match ingredients to products based on embeddings
exports.matchIngredientsToProducts = async (ingredients) => {
    const ingredientEmbeddings = await getEmbeddingsForIngredients(ingredients);
    const results = [];

    for (const [index, embeddingArray] of ingredientEmbeddings.entries()) {
        const groceryItems = await GroceryItem.find({});
        let bestMatch = null;
        let highestSimilarity = -1;

        groceryItems.forEach(item => {
            if (item.embedding) {
                const similarity = cosineSimilarity(embeddingArray, item.embedding);
                if (similarity > highestSimilarity) {
                    highestSimilarity = similarity;
                    bestMatch = item.name; // Only save the product name
                }
            }
        });

        results.push(bestMatch ? bestMatch : `No suitable match found for ${ingredients[index]}`);
    }

    return results;
};

// Calculate the total cost for the ingredients in a recipe
exports.getRecipeCost = async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Ingredients must be an array' });
        }

        const results = await exports.matchIngredientsToProducts(ingredients);
        res.json({ results });
    } catch (error) {
        console.error('Error fetching recipe cost:', error);
        res.status(500).json({ error: 'Error fetching recipe cost' });
    }
};

exports.matchIngredientsToProductsByStore = async (ingredients) => {
    const ingredientEmbeddings = await getEmbeddingsForIngredients(ingredients);
    const groceryItems = await GroceryItem.find({}); // Fetch all grocery items once

    const storeResults = {}; // Object to store results grouped by store

    // Initialize results for each store
    groceryItems.forEach(item => {
        if (!storeResults[item.store]) {
            storeResults[item.store] = {
                totalCost: 0,
                items: []
            };
        }
    });

    // Find best matches for each ingredient and group by store
    for (const [index, embeddingArray] of ingredientEmbeddings.entries()) {
        let bestMatchesByStore = {};

        // Initialize best match per store for the current ingredient
        groceryItems.forEach(item => {
            if (item.embedding) {
                const similarity = cosineSimilarity(embeddingArray, item.embedding);
                
                // Check if this is the best match for the current store
                if (!bestMatchesByStore[item.store] || bestMatchesByStore[item.store].similarity < similarity) {
                    bestMatchesByStore[item.store] = {
                        name: item.name,
                        price: item.price,
                        similarity: similarity
                    };
                }
            }
        });

        // Add best matches to the store results
        Object.keys(bestMatchesByStore).forEach(store => {
            const matchedProduct = bestMatchesByStore[store];
            storeResults[store].items.push({
                ingredient: ingredients[index],
                matchedProduct: matchedProduct.name,
                price: matchedProduct.price
            });
            storeResults[store].totalCost += parseFloat(matchedProduct.price); // Calculate total cost
        });
    }

    return storeResults;
};

// Calculate the total cost for the ingredients in a recipe, grouped by store
exports.getRecipeCostByStore = async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Ingredients must be an array' });
        }

        const storeResults = await exports.matchIngredientsToProductsByStore(ingredients);
        res.json({ storeResults });
    } catch (error) {
        console.error('Error fetching recipe cost by store:', error);
        res.status(500).json({ error: 'Error fetching recipe cost by store' });
    }
};
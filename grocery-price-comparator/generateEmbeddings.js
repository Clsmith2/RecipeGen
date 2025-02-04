const axios = require('axios');
const mongoose = require('mongoose');
const GroceryItem = require('./models/GroceryItem'); // Adjust the path if needed
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

async function generateOpenAIEmbeddings() {
    // Find items that do not have embeddings
    const items = await GroceryItem.find({ "embedding": [] });
    const apiKey = process.env.OPENAI_API_KEY;
    const batchSize = 200; // Adjust batch size based on your limits

    console.log(`Found ${items.length} items to process.`);

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        const inputs = batch.map(item => item.name);
        const response = await axios.post(
            'https://api.openai.com/v1/embeddings',
            {
                model: 'text-embedding-ada-002',
                input: inputs
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const embeddings = response.data.data;

        for (let j = 0; j < batch.length; j++) {
            batch[j].embedding = embeddings[j].embedding;
            await batch[j].save();
        }

        console.log(`Processed ${i + batch.length}/${items.length} items.`);

        // Wait 20 seconds before processing the next batch
        if (i + batchSize < items.length) {
            console.log('Waiting 20 seconds before next batch...');
            await new Promise(resolve => setTimeout(resolve, 20000));
        }
    }

    console.log('Embeddings generated and saved.');
    mongoose.connection.close(); // Close the connection after processing
}

generateOpenAIEmbeddings();

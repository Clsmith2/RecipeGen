const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const parseRecipe = require('../mdtojson');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const upload = multer({ storage: multer.memoryStorage() });  // Use memory storage

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-recipe', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  try {
    // Convert the uploaded image buffer to base64
    const image = req.file.buffer.toString('base64');

    // Create the request payload
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `I am uploading an image, and I need you to generate 1 detailed recipes in the following format: Description: A short one sentence description describing the dish.Ingredients: List the necessary ingredients. Steps: Provide step-by-step instructions to prepare the dish. Extra Information: Include additional tips, variations, or serving suggestions. Conditions: If the image is of a meal: Generate 1 recipes that could be made from the meal in the image. If the image contains ingredients rather than a meal: Generate 1 recipes that use those ingredients. If the image is not of food: Provide 1 random, easy-to-cook recipes. Each recipe should strictly follow the format: Recipe Name 1) Ingredients: [list ingredients] 2) Steps: [list steps] 3) Extra Information: [add extra tips, variations, etc.]. Please generate a recipe in the following structured format:

### Recipe Name: [Recipe Name]

1) **Description**: [A brief description of the dish]

2) **Ingredients**:
   - [Ingredient 1]
   - [Ingredient 2]
   - [Ingredient 3]
   ...

3) **Steps**:
   1. [Step 1 description]
   2. [Step 2 description]
   3. [Step 3 description]
   ...

4) **Extra Information**:
   - [Additional tip or variation 1]
   - [Additional tip or variation 2]
   - [Additional tip or variation 3]
   ...
` },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    // Extract the markdown recipe from the response
    let recipeMarkdown = response.choices[0].message.content.trim();

    // Replace literal '\n' with actual newline characters for markdown formatting
    recipeMarkdown = recipeMarkdown.replace(/\\n/g, '\n');

    // Parse the Markdown into a JSON object
    const recipeJson = parseRecipe(recipeMarkdown);

    // Return the JSON content as a response
    res.json(recipeJson);
  } catch (error) {
    console.error('Error generating recipe:', error.response ? error.response.data : error.message);
    res.status(500).send('An error occurred while generating the recipe.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

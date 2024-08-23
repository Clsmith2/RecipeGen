const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
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
            { type: 'text', text: 'Generate a detailed recipe based on this image of a dish.' },
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

    // Return the markdown content as a response
    res.setHeader('Content-Type', 'text/markdown');
    res.send(recipeMarkdown);
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

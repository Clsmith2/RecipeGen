const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function sendImageToBackend(imagePath) {
  try {
    // Create a form and append the image file
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    // Send the form to the backend using axios
    const response = await axios.post('https://forava-service-tbqsewu5uq-uc.a.run.app/generate-recipe', form, {
      headers: {
        ...form.getHeaders(), // Get the correct headers for form data
      },
    });

    // Log the response from the backend
    console.log('Recipe Markdown:', response.data);
  } catch (error) {
    console.error('Error sending image to backend:', error.message);
  }
}

// Example usage:
sendImageToBackend('Chicken-Mole-Recipe-featureimg.jpg');

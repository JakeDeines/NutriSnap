// Load environment variables from .env file at the very start
require('dotenv').config();

// Temporarily log the OpenAI API key to verify it's loaded
console.log(process.env.OPENAI_API_KEY);




const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(cors());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}




// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads')); // Ensure files are saved in the backend/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Initialize OpenAI SDK
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Route to handle image upload and analysis
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    console.log(`File uploaded and saved to ${filePath}`); // Log the file path here
    
    const imageData = fs.readFileSync(filePath).toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please provide a very short description of the image first." },
            { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${imageData}` } }
          ],
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Now, based on the image, can you list estimated nutritional facts for any food items detected in the format of a table with columns for nutrients, amount per serving, and percentage of daily value?" }
          ]
        }
      ],
      max_tokens: 500 // Increase this value as needed to get a more detailed response
    });
    console.log(response.choices[0]);
    res.status(200).json(response.choices[0]);
  } catch (error) {
    console.error("Error processing the image", error);
    res.status(500).send("Error processing the image");
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

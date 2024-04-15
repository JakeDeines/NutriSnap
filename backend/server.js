// Load environment variables from .env file at the very start
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const sharp = require('sharp');
const app = express();

// Conditionally set CORS for development or production
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: 'https://nutrisnap-production.up.railway.app' }));
} else {
  app.use(cors());
}
// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Initialize OpenAI SDK
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Log the OpenAI API key only in development environment
if (process.env.NODE_ENV !== 'production') {
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY}`);
}

// Route to handle image upload and analysis
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.file.filename);
    
    // Use Sharp to compress the image
    const compressedImage = await sharp(filePath)
    .resize(100)
    .jpeg({ quality: 60 }) // Adjust compression settings as needed
      .toBuffer();
    
    const imageData = compressedImage.toString('base64');

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
      max_tokens: 500
    });
    res.status(200).json(response.choices[0]);
  } catch (error) {
    console.error("Error processing the image", error);
    res.status(500).send("Error processing the image");
  }
});

// Serve static files and SPA in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../my-food-app/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../my-food-app/build', 'index.html'));
  });
}

// Custom error handling
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
    res.status(500).send({ message: err.message, stack: err.stack });
  } else {
    res.status(500).send({ message: "An error occurred, please try again later." });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

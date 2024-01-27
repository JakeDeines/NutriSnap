require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(cors());

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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
    const imageData = fs.readFileSync(filePath).toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Provide a very short description of the image." },
            { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${imageData}` } },
            { type: "text", text: "Analyze this image and provide a list of nutritional facts for any food items detected." },
          ],
        },
      ],
      max_tokens: 200 // Increase this value as needed
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

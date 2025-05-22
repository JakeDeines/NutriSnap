require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const sharp = require('sharp');

const app = express();

// CORS setup
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: 'nutrisnap-production-2c15.up.railway.app' }));
} else {
  app.use(cors());
}

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const sanitizeFilename = (name) => name.replace(/[^a-z0-9.-]/gi, '_');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${sanitizeFilename(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// OpenAI setup
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).send('Only image uploads are allowed.');
    }

    const filePath = path.join(uploadsDir, req.file.filename);

    const compressedImage = await sharp(filePath)
      .resize({ width: 512, fit: sharp.fit.inside, withoutEnlargement: true })
      .modulate({ brightness: 1.05, saturation: 1.1 })
      .sharpen()
      .jpeg({ quality: 80 })
      .toBuffer();

    const imageData = compressedImage.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please provide a short description of the image first." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Now return both the short description and nutritional information in strict JSON format like this:

{
  "description": "A sandwich with vegetables on a white paper wrap",
  "nutrition": [
    { "nutrient": "Calories", "amount": "400 kcal", "daily_value": "20%" },
    { "nutrient": "Protein", "amount": "20g", "daily_value": "40%" }
  ]
}

Only return valid JSON. No markdown, no bullet points, no explanation.`
            }
          ]
        }
      ],
      max_tokens: 500
    });

    let cleanContent = response.choices[0].message.content;

    try {
      cleanContent = JSON.parse(
        cleanContent.replace(/^```json\s*|```$/g, '').trim()
      );

      if (typeof cleanContent === 'string' && cleanContent.trim().startsWith('{')) {
        cleanContent = JSON.parse(cleanContent);
      }
    } catch (err) {
      console.warn("Failed to parse GPT response as JSON:", err);
    }

    res.status(200).json({
      message: {
        content: cleanContent
      },
      finish_reason: response.choices[0].finish_reason
    });

  } catch (error) {
    console.error("Error processing the image", error);
    res.status(500).send("Error processing the image");
  }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../my-food-app/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../my-food-app/build', 'index.html'));
  });
}

// Global error handling
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
    res.status(500).send({ message: err.message, stack: err.stack });
  } else {
    res.status(500).send({ message: "An error occurred, please try again later." });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

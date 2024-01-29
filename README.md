# NutriSnap
![NutriSnap photo 1](https://github.com/JakeDeines/NutriSnap/assets/67669417/67d8e8ea-b09a-4aa6-aa56-f1b1daf5f7ca)

NutriSnap is an innovative application designed to utilize the power of artificial intelligence to analyze images of food and provide nutritional insights. By leveraging the OpenAI API, NutriSnap offers users a quick and informative breakdown of the food items captured in their images.

## Features

- **Image Upload**: Users can upload images of food items directly through the application interface.
- **AI-Powered Analysis**: Utilizes OpenAI's advanced GPT-4 model to interpret the contents of the image.
- **Nutritional Information**: Provides a detailed list of nutritional facts for any detected food items.
- **Responsive Design**: Encased within a simulated cell phone frame for an intuitive mobile experience.

## How It Works

1. **Upload**: Select an image of your food item.
2. **Analyze**: Click 'Upload' and the image will be sent to OpenAI's GPT-4 model for analysis.
3. **Review**: Nutritional information and other details provided by the AI will be displayed on screen.



![NutriSnap photo 2](https://github.com/JakeDeines/NutriSnap/assets/67669417/0641f14c-9dbe-41b1-a5e9-1f2fd61be3ba)



## Installation

To set up the NutriSnap application on your local machine, follow these steps:

```bash
git clone https://github.com/yourusername/NutriSnap.git
cd NutriSnap
```
## Backend Setup

Navigate to the backend directory and install the necessary dependencies:

```bash
cd backend
npm install
```
Create a .env file with your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Start the backend server:

```bash
npm start
Frontend Setup
```

Navigate to the frontend (my-food-app) directory and install the dependencies:

```bash
cd my-food-app
npm install
```

Start the frontend application:

```bash
npm start
```

The application should now be running and accessible in your browser.

## Technology Stack
Frontend: React.js, FontAwesome for icons
Backend: Node.js, Express.js for server functionality, Multer for file uploads, OpenAI SDK for AI-powered analysis

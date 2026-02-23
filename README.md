# EmpowRead (Hackher Project)

**EmpowRead** is an innovative educational technology platform designed to make reading and learning more accessible, engaging, and personalized. Originally developed as part of a hackathon (Hackher), this project combines interactive features, AI integration, and gamification to create a supportive learning environment.

## 🌟 Key Features

The platform offers a variety of tools and modules tailored to different learning needs:

- **Emotion-Adaptive AI Avatar**: An intelligent avatar (like Snowman "Snowy") that adapts to the user's emotions to provide a personalized, encouraging experience.
- **AR Reading Ruler / Reading Lens**: A visual aid to help users maintain focus and track lines of text seamlessly while reading.
- **Word Detective Mode**: A gamified, interactive mode that turns learning vocabulary into an engaging investigation.
- **Balloon Game**: A fun, interactive learning activity that incorporates speech recognition for hands-free engagement.
- **Parent Shadow Mode**: A dedicated mode allowing parents or educators to monitor progress and customize settings without disrupting the learning experience.
- **Bionic Reading / Reading Ease**: Built-in features and extensions designed to enhance reading speed and comprehension through typography adjustments.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 / Next.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI (Gemini)
- **Utilities**: Tesseract.js (for OCR), Lucide React (icons)

## 📁 Project Structure

- `frontend/`: The core application built with React and Vite.
- `BionicReader/`: Contains configuration and files related to Bionic Reading features.
- `reading-ease-extension/`: A browser extension component for enhancing reading accessibility.

## 🛠️ Getting Started

To run the application locally:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables by creating a `.env` file (refer to existing `.env` schema for required keys like API keys for Google Generative AI).

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

This project is part of a continuous learning and development journey. Feel free to explore, branch out, and submit pull requests if you have ideas for improvements!

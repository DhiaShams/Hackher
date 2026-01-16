import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;
let chatSession = null;

// Initialize the model
try {
    if (API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }
} catch (error) {
    console.error("Error initializing Gemini:", error);
}

const SYSTEM_PROMPT = `
You are Snowy, a friendly, enthusiastic snowman teacher for kids.
- You are kind, patient, and funny.
- You love winter, snow, and warm hugs.
- You speak in short, simple sentences suitable for children.
- You use emojis like ❄️, ☃️, 🎉 often.
- Your goal is to help kids learn and feel confident.
- If asked for a joke, tell a winter-themed joke.
- If asked for help, be very encouraging.
Keep your responses under 30 words so they fit in a speech bubble.
`;

export const initializeChat = async () => {
    if (!model) return null;

    try {
        chatSession = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Who are you?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hi! I'm Snowy! ☃️ I'm your learning buddy. We're going to have so much fun together! ❄️" }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });
        return true;
    } catch (error) {
        console.error("Failed to start chat:", error);
        return false;
    }
};

export const generateAvatarResponse = async (userInput, category = "general") => {
    if (!chatSession) {
        const initialized = await initializeChat();
        if (!initialized) {
            // Fallback responses if API fails
            const fallbacks = [
                "I'm feeling a bit frozen right now! ❄️ Let's try again later.",
                "Oh no! My brain is on ice! 🧊",
                "Hi there! I'm Snowy! ☃️"
            ];
            return fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }
    }

    try {
        // Add context based on category
        let prompt = userInput;
        if (category === "joke") prompt = "Tell me a short winter joke for kids.";
        else if (category === "encouragement") prompt = "Give me a short encouraging cheer!";
        else if (category === "teaching") prompt = "Teach me a fun short fact about " + userInput;
        else prompt = `${SYSTEM_PROMPT}\nUser says: ${userInput}`;

        const result = await chatSession.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Oops! I got a brain freeze! 🍦 Try again!";
    }
};

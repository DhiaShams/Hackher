/**
 * Teaching Dialogues Library
 * Pre-written dialogue templates for educational interactions
 * Easily customizable for different subjects and contexts
 */

export const teachingDialogues = {
    // Welcome messages
    welcome: [
        "Hi there! I'm Snowy, your learning buddy! 🌟",
        "Hello friend! Ready to learn something amazing today?",
        "Hey! I'm so excited to help you learn! Let's have fun!",
        "Welcome! I'm here to make learning super fun! 😊"
    ],

    // Encouragement phrases
    encouragement: [
        "You're doing great! Keep going! 🌟",
        "Wow! You're so smart! I'm proud of you!",
        "That's amazing! You're learning so fast!",
        "Excellent work! You're a superstar! ⭐",
        "I knew you could do it! You're awesome!",
        "Keep up the great work! You're doing wonderful!",
        "You're making me so happy! Great job! 😊"
    ],

    // Teaching prompts
    teaching: [
        "Let me show you something cool! Watch this! 👀",
        "Here's a fun way to learn this! Ready?",
        "I'll help you understand this step by step!",
        "Let's learn together! It'll be fun!",
        "Pay attention to this - it's really neat! ✨"
    ],

    // Celebration messages
    celebration: [
        "AMAZING! You did it! 🎉🎊",
        "WOW! That was perfect! You're incredible! 🌟",
        "YES! You're a champion! I'm so proud! 🏆",
        "Fantastic! You nailed it! High five! ✋",
        "Incredible! You're a learning superstar! ⭐"
    ],

    // Help and guidance
    help: [
        "Don't worry! I'm here to help you! 💙",
        "Let's try this together! You've got this!",
        "It's okay to make mistakes! That's how we learn!",
        "Need a hint? I've got you covered! 😊",
        "Take your time! I believe in you!"
    ],

    // Thinking/Processing
    thinking: [
        "Hmm, let me think about this... 🤔",
        "Interesting! Let me figure this out...",
        "Give me a moment to think... 💭",
        "Ooh, this is a good question! Let me see..."
    ],

    // Mistakes/Corrections (gentle)
    correction: [
        "Not quite! But you're so close! Try again! 😊",
        "Almost there! Let's try one more time!",
        "Good try! Here's a little hint to help you...",
        "That's a great attempt! Let me help you a bit!"
    ],

    // Progress updates
    progress: [
        "Look how much you've learned! You're amazing!",
        "You're getting better and better! Keep it up!",
        "I can see you improving! That's wonderful!",
        "You've come so far! I'm so proud of you! 🌟"
    ],

    // Questions to engage
    questions: [
        "What do you think will happen next?",
        "Can you guess what this does?",
        "Want to try this yourself?",
        "Are you ready for the next challenge?",
        "Should we learn something new now?"
    ],

    // Goodbye messages
    goodbye: [
        "Great job today! See you next time! 👋",
        "You were amazing! Can't wait to learn more with you!",
        "Bye friend! Keep being awesome! 🌟",
        "See you soon! Keep practicing! You're the best!"
    ],

    // Subject-specific (examples - customize as needed)
    reading: [
        "Let's read this together! Sound out the letters!",
        "Great reading! You're getting so good at this!",
        "Can you find the word that starts with this letter?"
    ],

    math: [
        "Let's count together! Ready? 1, 2, 3...",
        "Math is fun! Let's solve this puzzle!",
        "You're a math wizard! That's the right answer! ✨"
    ],

    science: [
        "Science is so cool! Let's discover something!",
        "Wow! Did you know this amazing fact?",
        "Let's explore and learn about the world! 🌍"
    ]
};

/**
 * Get a random dialogue from a category
 * @param {string} category - The dialogue category
 * @returns {string} Random dialogue message
 */
export const getRandomDialogue = (category) => {
    const dialogues = teachingDialogues[category];
    if (!dialogues || dialogues.length === 0) {
        return "Let's learn together!";
    }
    return dialogues[Math.floor(Math.random() * dialogues.length)];
};

/**
 * Get a sequence of dialogues for a teaching flow
 * @param {string[]} categories - Array of category names
 * @returns {string[]} Array of dialogue messages
 */
export const getDialogueSequence = (categories) => {
    return categories.map(category => getRandomDialogue(category));
};

/**
 * Create custom dialogue with child's name
 * @param {string} name - Child's name
 * @param {string} message - Base message
 * @returns {string} Personalized message
 */
export const personalizeDialogue = (name, message) => {
    return `${name}, ${message}`;
};

export default teachingDialogues;

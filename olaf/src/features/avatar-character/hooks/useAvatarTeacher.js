import { useState, useCallback, useEffect } from 'react';
import { getRandomDialogue } from '../utils/teachingDialogues';
import { generateAvatarResponse, initializeChat } from '../../../services/geminiService';

/**
 * useAvatarTeacher - Custom hook for managing avatar teaching interactions
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.initialEmotion - Initial emotion state
 * @param {boolean} config.autoGreet - Whether to show greeting on mount
 * @param {number} config.messageDisplayTime - How long to show each message (ms)
 * @returns {Object} Avatar state and control functions
 */
const useAvatarTeacher = ({
    initialEmotion = 'happy',
    autoGreet = true,
    messageDisplayTime = 4000
} = {}) => {
    const [emotion, setEmotion] = useState(initialEmotion);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isDialogueVisible, setIsDialogueVisible] = useState(false);
    const [messageQueue, setMessageQueue] = useState([]);
    const [currentDisplay, setCurrentDisplay] = useState(null);

    // Initialize Gemini on mount
    useEffect(() => {
        initializeChat();
    }, []);

    // Show greeting on mount
    useEffect(() => {
        if (autoGreet) {
            speak('welcome', 'happy');
        }
    }, [autoGreet]);

    // Consolidate queue processing
    useEffect(() => {
        // If we're not currently displaying anything and there are messages in the queue
        if (!currentDisplay && messageQueue.length > 0) {
            const nextMessage = messageQueue[0];
            // Create a display object from the next message
            setCurrentDisplay({
                ...nextMessage,
                id: Date.now() + Math.random() // Unique ID to force updates
            });
            // Remove it from the queue immediately
            setMessageQueue(prev => prev.slice(1));
        }
    }, [currentDisplay, messageQueue]);

    // Handle current display lifecycle
    useEffect(() => {
        if (currentDisplay) {
            // 1. Show message
            setCurrentMessage(currentDisplay.text);
            setEmotion(currentDisplay.emotion);
            setIsDialogueVisible(true);

            // 2. Add Audio Support
            speakText(currentDisplay.text);

            // 3. Set timer to hide
            const hideTimer = setTimeout(() => {
                setIsDialogueVisible(false);

                // 4. Set timer to clear current display (allowing next one)
                const clearTimer = setTimeout(() => {
                    setCurrentDisplay(null);
                }, 300); // 300ms allow for fade out animation

                return () => clearTimeout(clearTimer);
            }, currentDisplay.duration || messageDisplayTime);

            return () => clearTimeout(hideTimer);
        }
    }, [currentDisplay, messageDisplayTime]);

    const [isSpeaking, setIsSpeaking] = useState(false);

    /**
     * Helper to make the browser speak
     */
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel previous speech to avoid overlapping
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Kid-like voice settings
            utterance.pitch = 1.6; // High pitch for young voice
            utterance.rate = 1.25; // Energetic and fast

            // Animation triggers
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            // Try to find a good voice
            const voices = window.speechSynthesis.getVoices();

            // Priority: 
            // 1. Google US English (often good quality)
            // 2. Microsoft Zira (female, sounds better pitched up than David)
            // 3. Any English voice
            const preferredVoice = voices.find(voice =>
                (voice.name.includes('Google US English') || voice.name.includes('Zira')) &&
                voice.lang.includes('en')
            ) || voices.find(voice => voice.lang.includes('en'));

            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    /**
     * Make the avatar speak - now with Gemini superpowers!
     * @param {string} categoryOrMessage - Dialogue category or custom message
     * @param {string} emotionState - Emotion to display
     * @param {number} duration - How long to show message
     */
    const speak = useCallback(async (categoryOrMessage, emotionState = 'happy', duration = null) => {
        let message = categoryOrMessage;

        // Check if it's a category request, if so, ask Gemini
        if (['joke', 'encouragement', 'teaching', 'help', 'correction', 'progress', 'questions'].includes(categoryOrMessage)) {
            // Use a placeholder while loading if needed, or just wait
            // For now, let's fetch then speak
            try {
                message = await generateAvatarResponse(categoryOrMessage, categoryOrMessage);
            } catch (e) {
                message = getRandomDialogue(categoryOrMessage); // Fallback to static
            }
        } else if (typeof categoryOrMessage === 'string' &&
            ['welcome', 'goodbye', 'reading', 'math', 'science'].includes(categoryOrMessage)) {
            // Keep these instant/static for now or eventually migrate them too
            message = getRandomDialogue(categoryOrMessage);
        }

        setMessageQueue(prev => [...prev, {
            text: message,
            emotion: emotionState,
            duration: duration || messageDisplayTime
        }]);
    }, [messageDisplayTime]);

    /**
     * Speak multiple messages in sequence
     * @param {Array} messages - Array of {text, emotion, duration} objects
     */
    const speakSequence = useCallback((messages) => {
        setMessageQueue(prev => [...prev, ...messages]);
    }, []);

    /**
     * Encourage the user
     */
    const encourage = useCallback(() => {
        speak('encouragement', 'encouraging');
    }, [speak]);

    /**
     * Celebrate user success
     */
    const celebrate = useCallback(() => {
        speak('celebration', 'celebrating');
    }, [speak]);

    /**
     * Show thinking state
     */
    const think = useCallback((message = null) => {
        if (message) {
            speak(message, 'thinking');
        } else {
            speak('thinking', 'thinking');
        }
    }, [speak]);

    /**
     * Provide help
     */
    const help = useCallback((customMessage = null) => {
        if (customMessage) {
            speak(customMessage, 'encouraging');
        } else {
            speak('help', 'encouraging');
        }
    }, [speak]);

    /**
     * Teach something new
     */
    const teach = useCallback((message) => {
        speak(message || 'teaching', 'happy');
    }, [speak]);

    /**
     * Ask a question
     */
    const ask = useCallback((question = null) => {
        if (question) {
            speak(question, 'thinking');
        } else {
            speak('questions', 'thinking');
        }
    }, [speak]);

    /**
     * Provide gentle correction
     */
    const correct = useCallback((customMessage = null) => {
        if (customMessage) {
            speak(customMessage, 'encouraging');
        } else {
            speak('correction', 'encouraging');
        }
    }, [speak]);

    /**
     * Show progress update
     */
    const showProgress = useCallback(() => {
        speak('progress', 'excited');
    }, [speak]);

    /**
     * Say goodbye
     */
    const goodbye = useCallback(() => {
        speak('goodbye', 'happy');
    }, [speak]);

    /**
     * Clear message queue
     */
    const clearQueue = useCallback(() => {
        setMessageQueue([]);
        setIsDialogueVisible(false);
        setCurrentDisplay(null);
    }, []);

    /**
     * Set emotion without speaking
     */
    const setAvatarEmotion = useCallback((newEmotion) => {
        setEmotion(newEmotion);
    }, []);

    return {
        // State
        emotion,
        currentMessage,
        isDialogueVisible,
        queueLength: messageQueue.length,

        // Actions
        speak,
        speakSequence,
        encourage,
        celebrate,
        think,
        help,
        teach,
        ask,
        correct,
        showProgress,
        goodbye,
        clearQueue,
        setEmotion: setAvatarEmotion,
        // State for animation
        isSpeaking
    };
};

export default useAvatarTeacher;

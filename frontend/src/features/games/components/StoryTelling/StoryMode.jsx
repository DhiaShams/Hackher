import React, { useState, useEffect, useRef } from 'react';
import './StoryMode.css';
import SnowmanAvatar from '../SnowmanAvatar';

// Import local images
import img1 from './images/1.png';
import img2 from './images/2.png';
import img3 from './images/3.png';
import img4 from './images/4.png';
import img5 from './images/5.png';

const DEMO_SCRIPT = [
    {
        phase: 0,
        speaker: 'avatar',
        text: "Wow! I'm so excited to create a story with you! Let's make it amazing!",
        image: null, // No image for intro conversation
        actionRequired: false
    },
    {
        phase: 1,
        speaker: 'avatar',
        text: "I saw a fluffy white cloud crying because it was hungry. So sad!",
        image: img1,
        actionRequired: false
    },
    {
        phase: 2,
        speaker: 'kid',
        text: "The cloud wanted to eat a giant pizza.",
        image: img2,
        actionRequired: true // User must click mic
    },
    {
        phase: 3,
        speaker: 'avatar',
        text: "Suddenly, a pizza plane flew by and... CHOMP! The cloud turned orange! How fun!",
        image: img3,
        actionRequired: false
    },
    {
        phase: 4,
        speaker: 'kid',
        text: "It rained cheese.",
        image: img4,
        actionRequired: true // User must click mic
    },
    {
        phase: 5,
        speaker: 'avatar',
        text: "Yum! It was the most delicious rainstorm ever. What an awesome story! The End!",
        image: img5,
        actionRequired: false
    }
];

const StoryMode = () => {
    const [phase, setPhase] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [showNextBtn, setShowNextBtn] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [isTTSActive, setIsTTSActive] = useState(false);

    const currentStep = DEMO_SCRIPT[phase];

    // Voice Selection Help
    const getKidVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Try to find a specific female or child-sounding voice
        // This is heuristic as "child" voices are rarely explicitly labeled in standard APIs
        const preferredVoices = [
            'Google US English', // Often good
            'Microsoft Zira',    // Female, higher pitch
            'Samantha',          // Mac Female
        ];

        for (let name of preferredVoices) {
            const found = voices.find(v => v.name.includes(name));
            if (found) return found;
        }
        return voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    // Helper for TTS with emotion and slower pacing
    const speakText = (text) => {
        window.speechSynthesis.cancel();
        setIsTTSActive(true);

        // Detect emotional content for varied delivery
        const lowerText = text.toLowerCase();
        const isExcited = text.includes('!') ||
            text.includes('CHOMP') ||
            text.includes('Yum') ||
            lowerText.includes('wow') ||
            lowerText.includes('amazing') ||
            lowerText.includes('awesome') ||
            lowerText.includes('fun') ||
            lowerText.includes('excited');

        const isQuestion = text.includes('?');
        const isSad = text.includes('crying') || text.includes('hungry') || text.includes('sad');

        // Split into sentences for natural pauses
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

        let currentIndex = 0;

        const speakNextSentence = () => {
            if (currentIndex >= sentences.length) {
                setIsTTSActive(false);
                return;
            }

            const sentence = sentences[currentIndex].trim();
            const utterance = new SpeechSynthesisUtterance(sentence);
            const voice = getKidVoice();
            if (voice) utterance.voice = voice;

            // Emotional variation - REFINED TONE AND SPEED
            if (isExcited) {
                utterance.pitch = 1.3;  // Friendly, less squeaky
                utterance.rate = 1.1;   // Brisk and energetic
            } else if (isQuestion) {
                utterance.pitch = 1.2;  // Natural questioning
                utterance.rate = 1.0;   // Normal speed
            } else if (isSad) {
                utterance.pitch = 1.1;  // Softly lower
                utterance.rate = 0.9;   // Slightly slower than normal, but not dragging
            } else {
                utterance.pitch = 1.2;  // Cheerful base pitch
                utterance.rate = 1.05;  // Slightly faster than standard
            }

            utterance.onend = () => {
                currentIndex++;
                // Natural pause between sentences - optimize flow
                setTimeout(speakNextSentence, 800);
            };

            utterance.onerror = () => setIsTTSActive(false);

            window.speechSynthesis.speak(utterance);
        };

        speakNextSentence();
    };

    // Effect to handle Avatar turns automatically or reset for Kid turns
    useEffect(() => {
        if (!currentStep) return;

        // Cancel any existing speech when the step changes
        window.speechSynthesis.cancel();
        setIsTTSActive(false);

        if (currentStep.speaker === 'avatar') {
            // Avatar speaks immediately
            setDisplayedText(currentStep.text);
            speakText(currentStep.text);

            // Only show image if one exists
            if (currentStep.image) {
                setShowImage(true);
            } else {
                setShowImage(false);
            }
            setShowNextBtn(true);
        } else {
            // Kid's turn: Clear text and wait for input
            setDisplayedText('');
            setShowImage(false); // Hide image initially for kid
            setShowNextBtn(false);
        }

        // Cleanup function to stop speech if component unmounts or phase changes
        return () => {
            window.speechSynthesis.cancel();
            setIsTTSActive(false);
        };
    }, [phase, currentStep]);

    const handleMicClick = () => {
        if (isListening) return; // Prevent double clicks

        setIsListening(true);

        // Simulate listening delay (Increased to 3s)
        setTimeout(() => {
            setIsListening(false);
            setDisplayedText(currentStep.text);

            // Avatar reads the kid's line ("Continues dialog")
            speakText(currentStep.text);

            // Reveal image 2 seconds AFTER text appears
            setTimeout(() => {
                setShowImage(true);
                setShowNextBtn(true);
            }, 2000);

        }, 3000);
    };

    const handleNextClick = () => {
        if (phase < DEMO_SCRIPT.length - 1) {
            setShowImage(false); // Hide immediately to prevent flash
            setPhase(p => p + 1);
        }
    };

    // Save achievement when story ends
    useEffect(() => {
        if (!currentStep && phase === DEMO_SCRIPT.length) {
            const achievement = {
                id: 'story-hungry-cloud',
                title: 'The Hungry Cloud',
                completed: true,
                timestamp: new Date().toISOString(),
                stars: 3,
                type: 'Story Mode'
            };

            // Get existing achievements or init empty array
            const existing = JSON.parse(localStorage.getItem('storyAchievements') || '[]');

            // Check if already saved today to avoid duplicates (optional, but good practice)
            // For this demo, we'll just append or replace
            const others = existing.filter(a => a.id !== 'story-hungry-cloud');
            localStorage.setItem('storyAchievements', JSON.stringify([...others, achievement]));

            console.log("Story Achievement Saved!");
        }
    }, [phase, currentStep]);

    // No restart button needed in UI as requested

    if (!currentStep) return (
        <div className="story-container demo-mode" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '3rem', color: '#667eea' }}>🎉 Amazing Story! 🎉</h1>
            <p style={{ fontSize: '1.5rem', marginTop: '20px', color: '#555' }}>You've unlocked a new Badge!</p>
            <button
                onClick={() => window.location.reload()}
                className="btn next-btn"
                style={{ marginTop: '30px' }}
            >
                Play Again 🔄
            </button>
        </div>
    );

    return (
        <div className="story-container demo-mode">

            <h1>It's Story Timee 🪄</h1>

            {/* Image Area - Only render if image exists */}
            {currentStep.image && (
                <div className="illustration-frame">
                    <img
                        key={currentStep.image} // Force new element to prevent transition artifacts from previous image
                        src={currentStep.image}
                        alt={`Story Phase ${phase}`}
                        className="demo-image"
                        style={{ opacity: showImage ? 1 : 0, transition: 'opacity 1s ease' }}
                    />
                </div>
            )}

            {!currentStep.image && (
                <div className="intro-spacer" style={{ height: '50px' }}></div>
            )}

            {/* Text Bubble - Always use avatar-bubble to show Avatar is the narrator */}
            <div className="story-bubble avatar-bubble">
                {isListening ? (
                    <span className="listening-text">Listening... 🎤</span>
                ) : (
                    displayedText || <span className="placeholder-text">Tap the mic to say your line!</span>
                )}
            </div>

            {/* Always Show Avatar */}
            <div className="fixed-avatar">
                <SnowmanAvatar
                    size="xlarge"
                    isVisible={true}
                    isSpeaking={isTTSActive}
                    emotion={currentStep.actionRequired ? 'encouraging' : 'happy'}
                />
            </div>

            {/* Controls */}
            <div className="controls">
                {currentStep.actionRequired && !displayedText && (
                    <button
                        className={`mic-button ${isListening ? 'listening' : ''}`}
                        onClick={handleMicClick}
                    >
                        🎤
                    </button>
                )}

                {showNextBtn && phase < DEMO_SCRIPT.length - 1 && (
                    <button className="btn next-btn" onClick={handleNextClick}>
                        Continue ➡️
                    </button>
                )}

                {phase === DEMO_SCRIPT.length - 1 && (
                    <div className="end-message">✨ The End! ✨</div>
                )}
            </div>
        </div>
    );
};

export default StoryMode;

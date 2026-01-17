import { useState, useEffect, useRef } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { calculateLevelRisk, calculateRisk } from '../utils/riskLogic';
import { LEVELS, shuffleItems } from '../data/levels';
import SnowmanAvatar from './SnowmanAvatar';
import bgImage from '../../../../assets/bg.jpeg';

const BalloonGame = () => {
    const { startListening, stopListening, lastWord, isListening, error, hasBrowserSupport, resetTranscript } = useSpeechRecognition();

    // Game State
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [currentLevelData, setCurrentLevelData] = useState(null);

    const [foundItems, setFoundItems] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, level_completed, game_completed
    const [riskResult, setRiskResult] = useState(null);
    const [levelResult, setLevelResult] = useState(null); // Result for just the current level
    const [empathyTriggered, setEmpathyTriggered] = useState(false);

    // Track total time across levels
    const totalDurationRef = useRef(0);

    // Initialize Level
    useEffect(() => {
        console.log("--- MOUNTING BALLOON GAME ---");
        if (hasBrowserSupport) {
            startLevel(0);
        }
        return () => console.log("--- UNMOUNTING BALLOON GAME ---");
    }, [hasBrowserSupport]);

    // Effect: Listen for Matches
    useEffect(() => {
        if (gameStatus !== 'playing' || !lastWord || !currentLevelData) return;

        console.log("Detected:", lastWord);

        const cleanInput = lastWord.toLowerCase();

        // If Empathy Mode (Pause) is active, only listen for 'start'
        if (empathyTriggered) {
            if (cleanInput.includes('start') || cleanInput.includes('resume') || cleanInput.includes('play') || cleanInput.includes('go')) {
                setEmpathyTriggered(false);
                console.log("Game Resumed");
                resetTranscript(); // Clear "start" so it doesn't trigger anything else
            }
            return;
        }

        // check distress keywords
        if (cleanInput.includes('hard') || cleanInput.includes('stop') || cleanInput.includes('stuck')) {
            triggerEmpathyMode();
            return;
        }

        // Check for game matches
        const foundInThisUtterance = [];

        currentLevelData.items.forEach(item => {
            if (cleanInput.includes(item.label.toLowerCase()) && !foundItems.includes(item.id)) {
                foundInThisUtterance.push(item.id);
            }
        });

        if (foundInThisUtterance.length > 0) {
            const newFound = [...foundItems, ...foundInThisUtterance];
            setFoundItems(newFound);

            // Check Win Condition for Level
            if (newFound.length === currentLevelData.items.length) {
                finishLevel();
            }
        }

    }, [lastWord, gameStatus, foundItems, currentLevelData, empathyTriggered]);

    const startLevel = (levelIndex) => {
        resetTranscript();

        // Load Level Data
        const levelRaw = LEVELS[levelIndex];
        const shuffledItems = shuffleItems(levelRaw.items);

        setCurrentLevelData({ ...levelRaw, items: shuffledItems });
        setCurrentLevelIndex(levelIndex);

        setFoundItems([]);
        setLevelResult(null);
        setEmpathyTriggered(false);
        setGameStatus('playing');
        setStartTime(Date.now());

        // Ensure the microphone is active
        startListening();
    };

    // TTS Helpers
    const getKidVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = ['Google US English', 'Microsoft Zira', 'Samantha'];
        for (let name of preferredVoices) {
            const found = voices.find(v => v.name.includes(name));
            if (found) return found;
        }
        return voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    const speakText = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getKidVoice();
        if (voice) utterance.voice = voice;
        utterance.pitch = 1.4;
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const finishLevel = () => {
        stopListening(); // Explicitly stop to clean up session
        const duration = Date.now() - startTime;
        totalDurationRef.current += duration;

        // Calculate level-specific risk
        const result = calculateLevelRisk(duration);
        setLevelResult(result);

        // Avatar Congratulates User
        speakText("Yay! Great job! You finished the level!");

        if (currentLevelIndex < LEVELS.length - 1) {
            setGameStatus('level_completed');
        } else {
            finishGame();
        }
    };

    const nextLevel = () => {
        window.speechSynthesis.cancel(); // Stop congratulation speech when moving on
        startLevel(currentLevelIndex + 1);
    }

    const finishGame = () => {
        stopListening(); // Only stop when the whole game is done
        setGameStatus('game_completed');
        const result = calculateRisk(totalDurationRef.current);
        setRiskResult(result);
    };

    const playAgain = () => {
        totalDurationRef.current = 0;
        setRiskResult(null);
        startLevel(0);
    }

    const triggerEmpathyMode = () => {
        setEmpathyTriggered(true);
        console.log("Empathy Mode Triggered");
        resetTranscript(); // Clear the "stop" word immediately
        startListening(); // Ensure we KEEP listening
    };

    if (!hasBrowserSupport) {
        return <div className="card">Browser not supported. Please use Chrome.</div>;
    }

    if (!currentLevelData) return <div>Loading...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            padding: '2rem',
            fontFamily: "'Comic Neue', 'Comic Sans MS', cursive"
        }}>
            {/* Level Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: '#2D3748',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {currentLevelData.name}
                </div>
                {/* Mic Status Indicator */}
                <div title={isListening ? "Microphone Active" : "Microphone Off"} style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isListening ? '#22c55e' : '#ef4444',
                    boxShadow: isListening ? '0 0 12px #22c55e' : 'none',
                    transition: 'all 0.3s'
                }}></div>
            </div>

            {/* Empathy Mode Banner */}
            {empathyTriggered && (
                <div style={{
                    background: '#FEE2E2',
                    color: '#991B1B',
                    padding: '1rem 1.5rem',
                    borderRadius: '16px',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                    onClick={() => {
                        setEmpathyTriggered(false);
                        resetTranscript();
                    }}>
                    ⏸️ Paused. Click to Resume.
                </div>
            )}

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {currentLevelData.items.map(item => {
                    const isFound = foundItems.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '2.5rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '180px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease',
                                opacity: isFound ? 0.5 : 1,
                                transform: isFound ? 'scale(0.95)' : 'scale(1)'
                            }}
                        >
                            {item.type === 'color' ? (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: item.shape === 'square' ? '12px' : '50%',
                                    background: item.color,
                                    marginBottom: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}></div>
                            ) : item.type === 'shape' ? (
                                <div style={{
                                    width: item.shape === 'rectangle' ? '140px' : '100px',
                                    height: '100px',
                                    borderRadius: item.shape === 'square' || item.shape === 'rectangle' ? '12px' : '50%',
                                    background: item.color,
                                    marginBottom: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}></div>
                            ) : (
                                <div style={{
                                    fontSize: '5rem',
                                    marginBottom: '0.5rem',
                                    filter: isFound ? 'grayscale(100%)' : 'none'
                                }}>
                                    {item.emoji}
                                </div>
                            )}
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#2D3748',
                                margin: 0,
                                textAlign: 'center'
                            }}>
                                {item.label}
                            </h2>
                        </div>
                    );
                })}
            </div>

            {/* Progress Indicator */}
            <div style={{
                textAlign: 'center',
                marginTop: '2rem',
                color: '#4A5568',
                fontSize: '0.95rem',
                fontWeight: '500'
            }}>
                Current Level: {currentLevelIndex + 1}/{LEVELS.length}
            </div>

            {/* Level Complete Overlay */}
            {gameStatus === 'level_completed' && levelResult && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '3rem 2.5rem',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            color: '#2D3748'
                        }}>🎉 Level Complete!</h2>
                        <p style={{
                            fontSize: '1.2rem',
                            color: '#4A5568',
                            marginBottom: '0.5rem'
                        }}>Time: {levelResult.durationInSeconds.toFixed(1)}s</p>
                        <p style={{
                            fontWeight: 'bold',
                            color: levelResult.risk === 'High Risk' ? '#EF4444' : '#10B981',
                            fontSize: '1.1rem',
                            marginBottom: '2rem'
                        }}>
                            {levelResult.risk}
                        </p>
                        <button
                            onClick={nextLevel}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2.5rem',
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Next Level →
                        </button>
                    </div>
                </div>
            )}

            {/* Game Results Overlay */}
            {gameStatus === 'game_completed' && riskResult && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '3rem 2.5rem',
                        maxWidth: '450px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            color: '#2D3748'
                        }}>🏆 All Levels Complete!</h2>
                        <p style={{
                            fontSize: '1.2rem',
                            marginBottom: '1.5rem',
                            color: '#4A5568'
                        }}>Total Time: {riskResult.durationInSeconds.toFixed(1)}s</p>
                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '16px',
                            background: riskResult.risk === 'High Risk' ? '#FEE2E2' : '#D1FAE5',
                            color: riskResult.risk === 'High Risk' ? '#991B1B' : '#065F46',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            Overall: {riskResult.risk}
                        </div>
                        <button
                            onClick={playAgain}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2.5rem',
                                borderRadius: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            🔄 Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* Debug Info */}
            {lastWord && (
                <div style={{
                    position: 'fixed',
                    bottom: '1rem',
                    left: '1rem',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: '#4A5568',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontFamily: 'monospace'
                }}>
                    Last heard: "{lastWord}"
                    {error && <span style={{ color: '#EF4444' }}> | ERROR: {error}</span>}
                </div>
            )}
            {/* Global Avatar for Word Detective */}
            <div style={{ position: 'fixed', bottom: '0', left: '0', zIndex: 60, pointerEvents: 'none' }}>
                <SnowmanAvatar
                    size="xlarge"
                    isVisible={true}
                    isSpeaking={false}
                    emotion={gameStatus === 'playing' ? 'encouraging' : 'happy'}
                />
            </div>
        </div>
    );
};

export default BalloonGame;

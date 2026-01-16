import React, { useState, useEffect } from 'react';
import { AvatarTeacher, useAvatarTeacher } from './index';
import { Sparkles, Heart, Star, Trophy, Target, BookOpen, Brain, Zap } from 'lucide-react';

/**
 * Interactive Avatar Showcase - Duolingo-style interactive demo
 * Demonstrates all avatar features with engaging activities
 */
const InteractiveAvatarShowcase = () => {
    const avatar = useAvatarTeacher({
        autoGreet: true,
        messageDisplayTime: 3500
    });

    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [hearts, setHearts] = useState(5);
    const [showConfetti, setShowConfetti] = useState(false);

    // Activity states
    const [mathAnswer, setMathAnswer] = useState('');
    const [currentMathProblem, setCurrentMathProblem] = useState(null);
    const [wordToFind, setWordToFind] = useState('');
    const [selectedWords, setSelectedWords] = useState([]);

    // Generate random math problem
    const generateMathProblem = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return { num1, num2, answer: num1 + num2 };
    };

    // Start activity
    const startActivity = (activityType) => {
        setCurrentActivity(activityType);

        if (activityType === 'math') {
            const problem = generateMathProblem();
            setCurrentMathProblem(problem);
            avatar.teach(`What is ${problem.num1} + ${problem.num2}?`);
        } else if (activityType === 'reading') {
            const words = ['cat', 'dog', 'sun', 'moon', 'star', 'tree'];
            const word = words[Math.floor(Math.random() * words.length)];
            setWordToFind(word);
            avatar.teach(`Can you find the word "${word}"?`);
        } else if (activityType === 'greeting') {
            avatar.speak("Hi! I'm Snowy! Click me to interact! 😊", 'excited');
        }
    };

    // Check math answer
    const checkMathAnswer = () => {
        if (!currentMathProblem) return;

        if (parseInt(mathAnswer) === currentMathProblem.answer) {
            handleCorrectAnswer();
            setMathAnswer('');
            setTimeout(() => {
                const newProblem = generateMathProblem();
                setCurrentMathProblem(newProblem);
                avatar.teach(`Great! Now try: ${newProblem.num1} + ${newProblem.num2}?`);
            }, 2000);
        } else {
            handleWrongAnswer();
            setMathAnswer('');
        }
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        setScore(prev => prev + 10);
        setStreak(prev => prev + 1);
        avatar.celebrate();
        triggerConfetti();
    };

    // Handle wrong answer
    const handleWrongAnswer = () => {
        setHearts(prev => Math.max(0, prev - 1));
        setStreak(0);
        avatar.correct();
    };

    // Trigger confetti effect
    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    };

    // Interactive buttons for avatar
    const interactWithAvatar = (action) => {
        switch (action) {
            case 'wave':
                avatar.speak("Hello there! 👋", 'happy');
                break;
            case 'highfive':
                avatar.speak("High five! ✋ You're awesome!", 'celebrating');
                setScore(prev => prev + 5);
                break;
            case 'hug':
                avatar.speak("Aww, warm hugs! 🤗", 'happy');
                setHearts(prev => Math.min(5, prev + 1));
                break;
            case 'dance':
                avatar.speak("Let's dance! 💃🕺", 'celebrating');
                break;
            case 'joke':
                const jokes = [
                    "Why did the snowman go to school? To get a little cooler! ❄️😄",
                    "What do snowmen eat for breakfast? Frosted flakes! 🥣",
                    "How do snowmen get around? By riding an 'icicle'! 🚲"
                ];
                avatar.speak(jokes[Math.floor(Math.random() * jokes.length)], 'excited');
                break;
            default:
                avatar.encourage();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            fontFamily: "'Nunito', 'Comic Sans MS', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Confetti Effect */}
            {showConfetti && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 9999
                }}>
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                left: `${Math.random() * 100}%`,
                                fontSize: '24px',
                                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                                animationDelay: `${Math.random() * 0.5}s`
                            }}
                        >
                            {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>
            )}

            {/* Header Stats */}
            <div style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <StatCard icon={<Trophy size={24} color="#FFD700" />} label="Score" value={score} />
                <StatCard icon={<Zap size={24} color="#FF6B6B" />} label="Streak" value={streak} />
                <StatCard icon={<Heart size={24} color="#FF69B4" />} label="Hearts" value={hearts} />
                <StatCard icon={<Star size={24} color="#4ECDC4" />} label="Level" value={Math.floor(score / 50) + 1} />
            </div>

            {/* Main Content */}
            <div style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                maxWidth: '1200px',
                margin: '0 auto 20px'
            }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    🎓 Snowy's Learning Playground
                </h1>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '18px',
                    marginBottom: '30px'
                }}>
                    Learn, play, and have fun with your friendly snowman teacher!
                </p>

                {/* Activity Selection */}
                {!currentActivity && (
                    <div>
                        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
                            Choose an Activity:
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px'
                        }}>
                            <ActivityCard
                                icon={<Brain size={32} />}
                                title="Math Challenge"
                                description="Solve fun math problems!"
                                color="#FF6B6B"
                                onClick={() => startActivity('math')}
                            />
                            <ActivityCard
                                icon={<BookOpen size={32} />}
                                title="Word Hunt"
                                description="Find the hidden words!"
                                color="#4ECDC4"
                                onClick={() => startActivity('reading')}
                            />
                            <ActivityCard
                                icon={<Sparkles size={32} />}
                                title="Meet Snowy"
                                description="Interact with your teacher!"
                                color="#FFD93D"
                                onClick={() => startActivity('greeting')}
                            />
                            <ActivityCard
                                icon={<Target size={32} />}
                                title="Quick Practice"
                                description="Random challenges!"
                                color="#95E1D3"
                                onClick={() => {
                                    const activities = ['math', 'reading', 'greeting'];
                                    startActivity(activities[Math.floor(Math.random() * activities.length)]);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Math Activity */}
                {currentActivity === 'math' && currentMathProblem && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
                            🧮 Math Challenge
                        </h2>
                        <div style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: '#667eea',
                            marginBottom: '30px'
                        }}>
                            {currentMathProblem.num1} + {currentMathProblem.num2} = ?
                        </div>
                        <input
                            type="number"
                            value={mathAnswer}
                            onChange={(e) => setMathAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && checkMathAnswer()}
                            placeholder="Your answer"
                            style={{
                                fontSize: '24px',
                                padding: '15px 25px',
                                borderRadius: '15px',
                                border: '3px solid #667eea',
                                width: '200px',
                                textAlign: 'center',
                                marginRight: '15px'
                            }}
                        />
                        <button onClick={checkMathAnswer} style={primaryButtonStyle}>
                            Check Answer ✓
                        </button>
                        <button
                            onClick={() => setCurrentActivity(null)}
                            style={{ ...secondaryButtonStyle, marginLeft: '10px' }}
                        >
                            Back to Activities
                        </button>
                    </div>
                )}

                {/* Reading Activity */}
                {currentActivity === 'reading' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
                            📖 Word Hunt
                        </h2>
                        <p style={{ fontSize: '20px', marginBottom: '20px' }}>
                            Find the word: <strong style={{ color: '#4ECDC4', fontSize: '28px' }}>{wordToFind}</strong>
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '15px',
                            maxWidth: '400px',
                            margin: '0 auto 20px'
                        }}>
                            {['cat', 'dog', 'sun', 'moon', 'star', 'tree'].map(word => (
                                <button
                                    key={word}
                                    onClick={() => {
                                        if (word === wordToFind) {
                                            handleCorrectAnswer();
                                            setTimeout(() => {
                                                const words = ['cat', 'dog', 'sun', 'moon', 'star', 'tree'];
                                                const newWord = words[Math.floor(Math.random() * words.length)];
                                                setWordToFind(newWord);
                                                avatar.teach(`Great! Now find "${newWord}"!`);
                                            }, 2000);
                                        } else {
                                            handleWrongAnswer();
                                        }
                                    }}
                                    style={{
                                        ...primaryButtonStyle,
                                        fontSize: '20px',
                                        padding: '20px'
                                    }}
                                >
                                    {word}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentActivity(null)}
                            style={secondaryButtonStyle}
                        >
                            Back to Activities
                        </button>
                    </div>
                )}

                {/* Greeting/Interaction Activity */}
                {currentActivity === 'greeting' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
                            👋 Interact with Snowy!
                        </h2>
                        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
                            Click the buttons to see how Snowy responds!
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '15px',
                            maxWidth: '800px',
                            margin: '0 auto 20px'
                        }}>
                            <InteractionButton
                                emoji="👋"
                                label="Wave"
                                onClick={() => interactWithAvatar('wave')}
                                color="#4ECDC4"
                            />
                            <InteractionButton
                                emoji="✋"
                                label="High Five"
                                onClick={() => interactWithAvatar('highfive')}
                                color="#FFD93D"
                            />
                            <InteractionButton
                                emoji="🤗"
                                label="Hug"
                                onClick={() => interactWithAvatar('hug')}
                                color="#FF6B6B"
                            />
                            <InteractionButton
                                emoji="💃"
                                label="Dance"
                                onClick={() => interactWithAvatar('dance')}
                                color="#95E1D3"
                            />
                            <InteractionButton
                                emoji="😄"
                                label="Tell Joke"
                                onClick={() => interactWithAvatar('joke')}
                                color="#A8E6CF"
                            />
                            <InteractionButton
                                emoji="💪"
                                label="Encourage"
                                onClick={() => avatar.encourage()}
                                color="#FFB6D9"
                            />
                        </div>
                        <button
                            onClick={() => setCurrentActivity(null)}
                            style={secondaryButtonStyle}
                        >
                            Back to Activities
                        </button>
                    </div>
                )}
            </div>

            {/* Avatar Component */}
            <AvatarTeacher
                emotion={avatar.emotion}
                message={avatar.currentMessage}
                showDialogue={avatar.isDialogueVisible}
                size="xlarge"
                position="bottom-right"
                dialoguePosition="top"
                showTypingEffect={true}
                typingSpeed={25}
                isSpeaking={avatar.isSpeaking}
                onClick={() => interactWithAvatar('wave')}
            />

            {/* Floating particles background */}
            <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '15px',
        minWidth: '120px'
    }}>
        {icon}
        <div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#333' }}>{value}</div>
        </div>
    </div>
);

// Activity Card Component
const ActivityCard = ({ icon, title, description, color, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'white',
            border: `3px solid ${color}`,
            borderRadius: '20px',
            padding: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
    >
        <div style={{ color, marginBottom: '15px' }}>{icon}</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>
            {title}
        </h3>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{description}</p>
    </button>
);

// Interaction Button Component
const InteractionButton = ({ emoji, label, onClick, color }) => (
    <button
        onClick={onClick}
        style={{
            background: color,
            border: 'none',
            borderRadius: '15px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
        }}
    >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{emoji}</div>
        {label}
    </button>
);

// Button Styles
const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
};

const secondaryButtonStyle = {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

export default InteractiveAvatarShowcase;

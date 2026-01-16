import React, { useEffect, useState } from 'react';

const SnowmanSVG = ({
    emotion = 'happy',
    isSpeaking = false,
    className = '',
    mode = 'full'
}) => {
    // Mouth animation state for lip-sync
    const [mouthOpen, setMouthOpen] = useState(false);

    // Simple lip-sync interval
    useEffect(() => {
        let interval;
        if (isSpeaking) {
            interval = setInterval(() => {
                setMouthOpen(prev => !prev);
            }, 150); // Toggle every 150ms for speech effect
        } else {
            setMouthOpen(false);
        }
        return () => clearInterval(interval);
    }, [isSpeaking]);

    // Arm rotation based on emotion
    const getArmRotation = () => {
        switch (emotion) {
            case 'excited': return { left: -45, right: 45 };
            case 'encouraging': return { left: 0, right: 90 }; // Waving
            case 'celebrating': return { left: -120, right: 120 }; // Arms up
            case 'thinking': return { left: 0, right: 30 }; // Hand near face
            default: return { left: 0, right: 0 };
        }
    };

    const arms = getArmRotation();

    if (mode === 'mouth-only') {
        return (
            <svg viewBox="0 0 200 300" className={`snowman-svg ${className}`} style={{ overflow: 'visible' }}>
                <g transform="translate(100, 115)">
                    {isSpeaking ? (
                        mouthOpen ? (
                            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#333" />
                        ) : (
                            <path d="M-8 0 Q0 5 8 0" stroke="#333" strokeWidth="2" fill="none" />
                        )
                    ) : (
                        /* Neutral smile for overlay when not speaking */
                        <path d="M-10 -2 Q0 8 10 -2" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
                    )}
                </g>
            </svg>
        );
    }

    if (mode === 'arms-only') {
        return (
            <svg
                viewBox="0 0 200 300"
                className={`snowman-svg ${className}`}
                style={{ overflow: 'visible' }}
            >
                {/* --- ARMS --- */}
                <g className="arms-container">
                    {/* Left Arm - Resized and Repositioned */}
                    <g transform={`rotate(${arms.left}, 65, 165)`} style={{ transition: 'transform 0.5s ease' }}>
                        <path d="M65 165 L10 115" stroke="#8B4513" strokeWidth="9" strokeLinecap="round" />
                        <path d="M25 125 L10 100" stroke="#8B4513" strokeWidth="7" strokeLinecap="round" /> {/* Finger */}
                        <path d="M25 125 L0 135" stroke="#8B4513" strokeWidth="7" strokeLinecap="round" /> {/* Finger */}
                    </g>

                    {/* Right Arm - Resized and Repositioned */}
                    <g transform={`rotate(${arms.right}, 135, 165)`} style={{ transition: 'transform 0.5s ease' }}>
                        <path d="M135 165 L190 115" stroke="#8B4513" strokeWidth="9" strokeLinecap="round" />
                        <path d="M175 125 L190 100" stroke="#8B4513" strokeWidth="7" strokeLinecap="round" /> {/* Finger */}
                        <path d="M175 125 L200 135" stroke="#8B4513" strokeWidth="7" strokeLinecap="round" /> {/* Finger */}
                    </g>
                </g>
            </svg>
        );
    }

    if (mode === 'body-only') {
        return (
            <svg
                viewBox="0 0 200 300"
                className={`snowman-svg ${className}`}
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <radialGradient id="snowGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="90%" stopColor="#e6f0ff" />
                        <stop offset="100%" stopColor="#d0e0ff" />
                    </radialGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
                    </filter>
                </defs>

                {/* --- BODY --- */}
                {/* Bottom Snowball */}
                <circle cx="100" cy="240" r="55" fill="url(#snowGradient)" filter="url(#shadow)" />
                {/* Middle Snowball */}
                <circle cx="100" cy="160" r="45" fill="url(#snowGradient)" filter="url(#shadow)" />
                {/* Buttons */}
                <circle cx="100" cy="145" r="4" fill="#333" />
                <circle cx="100" cy="165" r="4" fill="#333" />
                <circle cx="100" cy="185" r="4" fill="#333" />

                {/* --- HEAD --- */}
                <g className="head-group" transform={emotion === 'thinking' ? 'rotate(5, 100, 90)' : ''} style={{ transition: 'transform 0.5s ease' }}>
                    <circle cx="100" cy="90" r="35" fill="url(#snowGradient)" filter="url(#shadow)" />
                    <circle cx="90" cy="85" r="3" fill="#333" />
                    <circle cx="110" cy="85" r="3" fill="#333" />
                    <path d="M100 95 L140 98 L100 105 Z" fill="orange" stroke="#cc8400" strokeWidth="1" />

                    <g className="mouth" transform="translate(100, 115)">
                        {/* Always neutral or emotion-based static mouth here. The overlay handles speech. */}
                        {emotion === 'surprised' ? (
                            <circle cx="0" cy="0" r="5" fill="#333" />
                        ) : emotion === 'thinking' ? (
                            <line x1="-5" y1="0" x2="5" y2="0" stroke="#333" strokeWidth="2" />
                        ) : (
                            <path d="M-10 -2 Q0 8 10 -2" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
                        )}
                    </g>

                    {emotion === 'thinking' && (
                        <>
                            <path d="M85 78 Q90 75 95 78" stroke="#333" strokeWidth="1" fill="none" />
                            <path d="M105 78 Q110 81 115 78" stroke="#333" strokeWidth="1" fill="none" />
                        </>
                    )}
                </g>
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 200 300"
            className={`snowman-svg ${className}`}
            style={{ overflow: 'visible' }} // Allow arms to rotate outside bounds
        >
            {/* Defs for gradients/shadows */}
            <defs>
                <radialGradient id="snowGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="90%" stopColor="#e6f0ff" />
                    <stop offset="100%" stopColor="#d0e0ff" />
                </radialGradient>
                <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
                </filter>
            </defs>

            {/* --- BODY --- */}

            {/* Bottom Snowball */}
            <circle cx="100" cy="240" r="55" fill="url(#snowGradient)" filter="url(#shadow)" />

            {/* Middle Snowball */}
            <circle cx="100" cy="160" r="45" fill="url(#snowGradient)" filter="url(#shadow)" />

            {/* Buttons (Coal) */}
            <circle cx="100" cy="145" r="4" fill="#333" />
            <circle cx="100" cy="165" r="4" fill="#333" />
            <circle cx="100" cy="185" r="4" fill="#333" />

            {/* --- ARMS --- */}
            <g className="arms-container">
                <g transform={`rotate(${arms.left}, 60, 150)`} style={{ transition: 'transform 0.5s ease' }}>
                    <path d="M60 150 L20 130" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
                    <path d="M30 135 L20 115" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
                    <path d="M30 135 L15 140" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
                </g>

                <g transform={`rotate(${arms.right}, 140, 150)`} style={{ transition: 'transform 0.5s ease' }}>
                    <path d="M140 150 L180 130" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
                    <path d="M170 135 L180 115" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
                    <path d="M170 135 L185 140" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
                </g>
            </g>

            {/* --- HEAD --- */}
            <g className="head-group" transform={emotion === 'thinking' ? 'rotate(5, 100, 90)' : ''} style={{ transition: 'transform 0.5s ease' }}>
                <circle cx="100" cy="90" r="35" fill="url(#snowGradient)" filter="url(#shadow)" />
                <circle cx="90" cy="85" r="3" fill="#333" />
                <circle cx="110" cy="85" r="3" fill="#333" />
                <path d="M100 95 L140 98 L100 105 Z" fill="orange" stroke="#cc8400" strokeWidth="1" />

                <g className="mouth" transform="translate(100, 115)">
                    {isSpeaking ? (
                        mouthOpen ? (
                            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#333" />
                        ) : (
                            <path d="M-8 0 Q0 5 8 0" stroke="#333" strokeWidth="2" fill="none" />
                        )
                    ) : (
                        emotion === 'surprised' ? (
                            <circle cx="0" cy="0" r="5" fill="#333" />
                        ) : emotion === 'thinking' ? (
                            <line x1="-5" y1="0" x2="5" y2="0" stroke="#333" strokeWidth="2" />
                        ) : (
                            <path d="M-10 -2 Q0 8 10 -2" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
                        )
                    )}
                </g>

                {emotion === 'thinking' && (
                    <>
                        <path d="M85 78 Q90 75 95 78" stroke="#333" strokeWidth="1" fill="none" />
                        <path d="M105 78 Q110 81 115 78" stroke="#333" strokeWidth="1" fill="none" />
                    </>
                )}
            </g>
        </svg>
    );
};

export default SnowmanSVG;

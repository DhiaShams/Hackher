import React, { useState, useEffect } from 'react';
import '../styles/avatarAnimations.css';
import snowmanImage from '../assets/snowman-avatar.png';
import SnowmanSVG from './SnowmanSVG';

/**
 * SnowmanAvatar - Hybrid Animated Version
 * Combines:
 * 1. Background: Animated SVG Arms
 * 2. Middle: Masked PNG Body (Static arms clipped off)
 * 3. Foreground: Animated SVG Mouth
 */
const SnowmanAvatar = ({
    emotion = 'happy',
    size = 'medium',
    position = 'bottom-right',
    isVisible = true,
    isSpeaking = false,
    onClick,
    className = ''
}) => {
    const [currentEmotion, setCurrentEmotion] = useState(emotion);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (emotion !== currentEmotion) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentEmotion(emotion);
                setIsAnimating(false);
            }, 300);
        }
    }, [emotion, currentEmotion]);

    const sizeMap = {
        small: '100px',
        medium: '150px',
        large: '300px',
        xlarge: '380px'
    };

    const positionStyles = {
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
        'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };

    const emotionAnimations = {
        happy: 'avatar-bounce',
        excited: 'avatar-jump',
        thinking: '', // No body tilt
        encouraging: 'avatar-wave',
        celebrating: 'avatar-bounce' // No spin
    };

    if (!isVisible) return null;

    return (
        <div
            className={`snowman-avatar ${className}`}
            style={{
                position: 'fixed',
                width: sizeMap[size],
                height: sizeMap[size],
                cursor: onClick ? 'pointer' : 'default',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                ...positionStyles[position]
            }}
            onClick={onClick}
        >
            <div
                className={`avatar-container ${emotionAnimations[currentEmotion]} ${isAnimating ? 'transitioning' : ''}`}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
            >
                {/* 1. BACKGROUND: Animated Arms REMOVED (Fixed double hands issue) */}


                {/* 2. MIDDLE: Static Body */}
                <img
                    src={snowmanImage}
                    alt="Friendly snowman teacher"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: currentEmotion === 'thinking' ? 'brightness(0.9)' : 'brightness(1)',
                        transition: 'filter 0.3s ease'
                    }}
                />

                {/* 3. FOREGROUND: Lipsync Mouth */}
                {isSpeaking && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '38%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40px',
                            height: '20px',
                            zIndex: 10
                        }}
                    >
                        <SnowmanSVG
                            mode="mouth-only"
                            isSpeaking={isSpeaking}
                            className="w-full h-full"
                        />
                    </div>
                )}

                {/* Emotion indicators */}
                {currentEmotion === 'excited' && (
                    <div className="emotion-sparkles" style={{ zIndex: 20 }}>
                        <span className="sparkle">✨</span>
                        <span className="sparkle">⭐</span>
                        <span className="sparkle">✨</span>
                    </div>
                )}

                {currentEmotion === 'celebrating' && (
                    <div className="emotion-confetti" style={{ zIndex: 20 }}>
                        <span className="confetti">🎉</span>
                        <span className="confetti">🎊</span>
                        <span className="confetti">🌟</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SnowmanAvatar;

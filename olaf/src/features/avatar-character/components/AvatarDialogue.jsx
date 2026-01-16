import React, { useState, useEffect } from 'react';
import '../styles/avatarAnimations.css';

/**
 * AvatarDialogue - Speech bubble component for avatar communication
 * 
 * @param {Object} props
 * @param {string} props.message - Current message to display
 * @param {boolean} props.isVisible - Whether dialogue is visible
 * @param {string} props.position - Position relative to avatar: 'top', 'left', 'right'
 * @param {boolean} props.showTypingEffect - Enable typing animation
 * @param {number} props.typingSpeed - Speed of typing in ms per character
 * @param {function} props.onComplete - Callback when message is fully displayed
 * @param {string} props.avatarEmotion - Current avatar emotion for styling
 */
const AvatarDialogue = ({
    message = '',
    isVisible = false,
    position = 'top',
    showTypingEffect = true,
    typingSpeed = 30,
    onComplete,
    avatarEmotion = 'happy'
}) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!isVisible || !message) {
            setDisplayedMessage('');
            setIsTyping(false);
            return;
        }

        if (showTypingEffect) {
            setIsTyping(true);
            setDisplayedMessage('');
            let currentIndex = 0;

            const typingInterval = setInterval(() => {
                if (currentIndex < message.length) {
                    setDisplayedMessage(message.substring(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTyping(false);
                    if (onComplete) onComplete();
                }
            }, typingSpeed);

            return () => clearInterval(typingInterval);
        } else {
            setDisplayedMessage(message);
            if (onComplete) onComplete();
        }
    }, [message, isVisible, showTypingEffect, typingSpeed, onComplete]);

    if (!isVisible || !message) return null;

    const positionStyles = {
        top: {
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '10px'
        },
        left: {
            right: '110%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: '10px'
        },
        right: {
            left: '110%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: '10px'
        }
    };

    const emotionColors = {
        happy: '#FFE5B4',
        excited: '#FFD700',
        thinking: '#E6F3FF',
        encouraging: '#FFEBCD',
        celebrating: '#FFB6C1'
    };

    return (
        <div
            className="avatar-dialogue-bubble"
            style={{
                position: 'absolute',
                backgroundColor: emotionColors[avatarEmotion] || '#FFE5B4',
                color: '#333',
                padding: '12px 16px',
                borderRadius: '16px',
                maxWidth: '250px',
                minWidth: '120px',
                fontSize: '14px',
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive",
                fontWeight: '500',
                lineHeight: '1.4',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                animation: 'dialogue-appear 0.3s ease-out',
                zIndex: 1001,
                ...positionStyles[position]
            }}
        >
            {displayedMessage}
            {isTyping && (
                <span className="typing-cursor" style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '14px',
                    backgroundColor: '#333',
                    marginLeft: '2px',
                    animation: 'blink 0.7s infinite'
                }} />
            )}

            {/* Speech bubble tail */}
            <div
                style={{
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    borderStyle: 'solid',
                    ...(position === 'top' && {
                        bottom: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderWidth: '8px 8px 0 8px',
                        borderColor: `${emotionColors[avatarEmotion] || '#FFE5B4'} transparent transparent transparent`
                    }),
                    ...(position === 'left' && {
                        right: '-8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderWidth: '8px 0 8px 8px',
                        borderColor: `transparent transparent transparent ${emotionColors[avatarEmotion] || '#FFE5B4'}`
                    }),
                    ...(position === 'right' && {
                        left: '-8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderWidth: '8px 8px 8px 0',
                        borderColor: `transparent ${emotionColors[avatarEmotion] || '#FFE5B4'} transparent transparent`
                    })
                }}
            />
        </div>
    );
};

export default AvatarDialogue;

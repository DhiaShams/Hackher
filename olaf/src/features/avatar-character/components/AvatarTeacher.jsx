import React from 'react';
import SnowmanAvatar from './SnowmanAvatar';
import AvatarDialogue from './AvatarDialogue';

/**
 * AvatarTeacher - Combined component with avatar and dialogue
 * This is the main component to use in your applications
 * 
 * @param {Object} props
 * @param {string} props.emotion - Current emotion state
 * @param {string} props.message - Current message to display
 * @param {boolean} props.showDialogue - Whether to show dialogue
 * @param {string} props.size - Avatar size
 * @param {string} props.position - Avatar position
 * @param {string} props.dialoguePosition - Dialogue position relative to avatar
 * @param {boolean} props.isVisible - Whether avatar is visible
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.showTypingEffect - Enable typing animation
 * @param {number} props.typingSpeed - Typing speed
 * @param {function} props.onMessageComplete - Callback when message completes
 */
const AvatarTeacher = ({
    emotion = 'happy',
    message = '',
    showDialogue = false,
    size = 'large', // Default to large now
    position = 'bottom-right',
    dialoguePosition = 'top',
    isVisible = true,
    onClick,
    showTypingEffect = true,
    typingSpeed = 30,
    onMessageComplete,
    className = '',
    isSpeaking = false
}) => {
    // Size mapping
    const sizeMap = {
        small: '100px',
        medium: '150px',
        large: '300px',
        xlarge: '380px' // Slightly smaller than before, still large (~10cm)
    };

    const dimension = sizeMap[size] || sizeMap.large;

    return (
        <div className={`avatar-teacher-container ${className}`}>
            <SnowmanAvatar
                emotion={emotion}
                size={size}
                position={position}
                isVisible={isVisible}
                isSpeaking={isSpeaking}
                onClick={onClick}
            />
            {isVisible && (
                <div
                    style={{
                        position: 'fixed',
                        width: dimension,
                        height: dimension,
                        zIndex: 1000,
                        pointerEvents: 'none',
                        ...(position === 'bottom-right' && { bottom: '20px', right: '20px' }),
                        ...(position === 'bottom-left' && { bottom: '20px', left: '20px' }),
                        ...(position === 'top-right' && { top: '20px', right: '20px' }),
                        ...(position === 'top-left' && { top: '20px', left: '20px' }),
                        ...(position === 'center' && { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
                    }}
                >
                    <AvatarDialogue
                        message={message}
                        isVisible={showDialogue}
                        position={dialoguePosition}
                        showTypingEffect={showTypingEffect}
                        typingSpeed={typingSpeed}
                        onComplete={onMessageComplete}
                        avatarEmotion={emotion}
                    />
                </div>
            )}
        </div>
    );
};

export default AvatarTeacher;

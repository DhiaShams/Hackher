/**
 * Avatar Character Feature - Main Export
 * 
 * A reusable, Olaf-inspired snowman avatar for educational applications
 * Designed to engage and teach children with animations and dialogue
 */

// Main Components
export { default as AvatarTeacher } from './components/AvatarTeacher';
export { default as SnowmanAvatar } from './components/SnowmanAvatar';
export { default as AvatarDialogue } from './components/AvatarDialogue';

// Hooks
export { default as useAvatarTeacher } from './hooks/useAvatarTeacher';

// Utilities
export {
    teachingDialogues,
    getRandomDialogue,
    getDialogueSequence,
    personalizeDialogue
} from './utils/teachingDialogues';

// Styles (import this in your main app)
import './styles/avatarAnimations.css';

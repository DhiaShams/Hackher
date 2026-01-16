# 🎓 Avatar Character Feature - Snowy the Snowman Teacher

A reusable, animated avatar character inspired by Olaf from Frozen, designed to engage and teach children in educational applications.

![Snowy Avatar](./assets/snowman-avatar.png)

## ✨ Features

- 🎭 **Multiple Emotion States**: Happy, excited, thinking, encouraging, celebrating
- 💬 **Animated Dialogue System**: Speech bubbles with typing effects
- 🎨 **Smooth CSS Animations**: Bounce, jump, wave, spin, and more
- 📚 **Pre-written Teaching Dialogues**: Ready-to-use educational phrases
- 🎯 **Easy Integration**: Simple React hooks and components
- 🔄 **Fully Reusable**: Standalone feature, copy to any project
- 📱 **Responsive Design**: Works on all screen sizes

## 📦 Installation

### Copy to Your Project

1. Copy the entire `avatar-character` folder to your project's `src/features/` directory
2. Import the components you need

```javascript
import { AvatarTeacher, useAvatarTeacher } from './features/avatar-character';
```

### Dependencies

This feature uses only React (no additional dependencies required).

## 🚀 Quick Start

### Basic Usage with Hook

```javascript
import React from 'react';
import { AvatarTeacher, useAvatarTeacher } from './features/avatar-character';

function MyApp() {
  const avatar = useAvatarTeacher({
    autoGreet: true,
    messageDisplayTime: 4000
  });

  return (
    <div>
      <AvatarTeacher
        emotion={avatar.emotion}
        message={avatar.currentMessage}
        showDialogue={avatar.isDialogueVisible}
        size="medium"
        position="bottom-right"
      />
      
      <button onClick={() => avatar.encourage()}>
        Encourage Me!
      </button>
      <button onClick={() => avatar.celebrate()}>
        Celebrate!
      </button>
    </div>
  );
}
```

### Manual Control

```javascript
import React, { useState } from 'react';
import { AvatarTeacher } from './features/avatar-character';

function MyApp() {
  const [emotion, setEmotion] = useState('happy');
  const [message, setMessage] = useState('');
  const [showDialogue, setShowDialogue] = useState(false);

  const handleClick = () => {
    setEmotion('excited');
    setMessage('You clicked me! That tickles! 😊');
    setShowDialogue(true);
  };

  return (
    <AvatarTeacher
      emotion={emotion}
      message={message}
      showDialogue={showDialogue}
      onClick={handleClick}
    />
  );
}
```

## 📖 API Reference

### AvatarTeacher Component

Main component combining avatar and dialogue.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `emotion` | string | `'happy'` | Emotion state: 'happy', 'excited', 'thinking', 'encouraging', 'celebrating' |
| `message` | string | `''` | Message to display in dialogue |
| `showDialogue` | boolean | `false` | Whether to show dialogue bubble |
| `size` | string | `'medium'` | Avatar size: 'small', 'medium', 'large' |
| `position` | string | `'bottom-right'` | Position: 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'center' |
| `dialoguePosition` | string | `'top'` | Dialogue position: 'top', 'left', 'right' |
| `isVisible` | boolean | `true` | Whether avatar is visible |
| `onClick` | function | - | Click handler |
| `showTypingEffect` | boolean | `true` | Enable typing animation |
| `typingSpeed` | number | `30` | Typing speed in ms per character |
| `onMessageComplete` | function | - | Callback when message completes |

### useAvatarTeacher Hook

Custom hook for managing avatar interactions.

#### Configuration

```javascript
const avatar = useAvatarTeacher({
  initialEmotion: 'happy',      // Starting emotion
  autoGreet: true,              // Show greeting on mount
  messageDisplayTime: 4000      // Message duration in ms
});
```

#### Methods

| Method | Description | Example |
|--------|-------------|---------|
| `speak(message, emotion, duration)` | Make avatar speak | `avatar.speak('Hello!', 'happy')` |
| `encourage()` | Show encouragement | `avatar.encourage()` |
| `celebrate()` | Celebrate success | `avatar.celebrate()` |
| `think(message)` | Show thinking state | `avatar.think('Hmm...')` |
| `help(message)` | Provide help | `avatar.help()` |
| `teach(message)` | Teach something | `avatar.teach('Let me show you!')` |
| `ask(question)` | Ask a question | `avatar.ask('Ready to try?')` |
| `correct(message)` | Gentle correction | `avatar.correct()` |
| `showProgress()` | Show progress update | `avatar.showProgress()` |
| `goodbye()` | Say goodbye | `avatar.goodbye()` |
| `clearQueue()` | Clear message queue | `avatar.clearQueue()` |
| `setEmotion(emotion)` | Set emotion without speaking | `avatar.setEmotion('excited')` |

#### State

| Property | Type | Description |
|----------|------|-------------|
| `emotion` | string | Current emotion state |
| `currentMessage` | string | Currently displayed message |
| `isDialogueVisible` | boolean | Whether dialogue is showing |
| `queueLength` | number | Number of queued messages |

## 🎨 Emotion States

- **happy**: Gentle bouncing animation (default)
- **excited**: Energetic jumping with sparkles ✨
- **thinking**: Tilting with thought bubble 💭
- **encouraging**: Waving motion
- **celebrating**: Spinning with confetti 🎉

## 💬 Teaching Dialogues

Pre-written dialogue categories:

- `welcome` - Greeting messages
- `encouragement` - Positive reinforcement
- `teaching` - Teaching prompts
- `celebration` - Success celebrations
- `help` - Help and guidance
- `thinking` - Processing messages
- `correction` - Gentle corrections
- `progress` - Progress updates
- `questions` - Engagement questions
- `goodbye` - Farewell messages
- `reading` - Reading-specific
- `math` - Math-specific
- `science` - Science-specific

### Custom Dialogues

```javascript
import { getRandomDialogue, personalizeDialogue } from './features/avatar-character';

// Get random dialogue from category
const message = getRandomDialogue('encouragement');

// Personalize with child's name
const personalMessage = personalizeDialogue('Emma', 'you did great!');
// Result: "Emma, you did great!"
```

## 🎯 Usage Examples

### Example 1: Reading App

```javascript
function ReadingApp() {
  const avatar = useAvatarTeacher();

  const handleWordRead = (correct) => {
    if (correct) {
      avatar.celebrate();
    } else {
      avatar.correct("Almost! Try sounding it out!");
    }
  };

  return (
    <div>
      <AvatarTeacher
        emotion={avatar.emotion}
        message={avatar.currentMessage}
        showDialogue={avatar.isDialogueVisible}
      />
      {/* Your reading content */}
    </div>
  );
}
```

### Example 2: Math Quiz

```javascript
function MathQuiz() {
  const avatar = useAvatarTeacher();

  const checkAnswer = (answer) => {
    avatar.think();
    setTimeout(() => {
      if (answer === correctAnswer) {
        avatar.celebrate();
      } else {
        avatar.help("Let's try again together!");
      }
    }, 1500);
  };

  return (
    <AvatarTeacher
      emotion={avatar.emotion}
      message={avatar.currentMessage}
      showDialogue={avatar.isDialogueVisible}
      position="bottom-left"
    />
  );
}
```

### Example 3: Message Sequence

```javascript
const avatar = useAvatarTeacher();

// Speak multiple messages in sequence
avatar.speakSequence([
  { text: "Welcome to the lesson!", emotion: 'happy', duration: 3000 },
  { text: "Today we'll learn something amazing!", emotion: 'excited', duration: 3000 },
  { text: "Are you ready?", emotion: 'thinking', duration: 3000 }
]);
```

## 🎨 Customization

### Add Custom Dialogues

Edit `utils/teachingDialogues.js`:

```javascript
export const teachingDialogues = {
  // ... existing dialogues
  
  myCustomCategory: [
    "Custom message 1",
    "Custom message 2",
    "Custom message 3"
  ]
};
```

### Modify Animations

Edit `styles/avatarAnimations.css` to customize animations.

### Change Avatar Image

Replace `assets/snowman-avatar.png` with your own character image (transparent PNG recommended).

## 📱 Responsive Design

The avatar automatically adjusts for mobile devices:
- Smaller dialogue bubbles on mobile
- Touch-friendly interactions
- Optimized animations

## 🔧 Advanced Configuration

### Custom Emotion Colors

Modify dialogue bubble colors in `AvatarDialogue.jsx`:

```javascript
const emotionColors = {
  happy: '#FFE5B4',
  excited: '#FFD700',
  // Add your custom colors
};
```

### Custom Animations

Add new animations in `avatarAnimations.css`:

```css
@keyframes my-custom-animation {
  /* Your animation keyframes */
}

.my-custom-animation {
  animation: my-custom-animation 2s ease-in-out infinite;
}
```

## 🚀 Deployment

This feature is completely self-contained. To use in another project:

1. Copy the entire `avatar-character` folder
2. Ensure React is installed in the target project
3. Import and use as shown in examples

## 📄 License

This avatar character feature is designed to be freely reusable in your educational projects.

## 🤝 Contributing

Feel free to customize and extend this feature for your specific needs!

---

**Created with ❤️ for educational applications**

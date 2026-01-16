// Text-to-Speech utility for Avatar
export class AvatarVoice {
    private synth: SpeechSynthesis | null = null;
    private voice: SpeechSynthesisVoice | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
            this.loadVoice();
        }
    }

    private loadVoice() {
        if (!this.synth) return;

        const loadVoices = () => {
            const voices = this.synth!.getVoices();
            // Prefer female voices for "Lexi"
            this.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha'))
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];
        };

        loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
    }

    speak(text: string, options: { rate?: number; pitch?: number } = {}) {
        if (!this.synth) return;

        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1.1; // Slightly higher for friendly tone

        if (this.voice) {
            utterance.voice = this.voice;
        }

        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
}

// Singleton instance
export const avatarVoice = new AvatarVoice();

// Lexi's personality responses
export const lexiResponses = {
    greeting: [
        "Hi there! I'm Lexi, your reading buddy!",
        "Hello! Ready to read together?",
        "Hey friend! Let's have fun with words today!",
    ],
    encouragement: [
        "You're doing great! Keep going!",
        "I believe in you!",
        "Don't worry, we'll figure it out together!",
        "Take your time. You've got this!",
    ],
    celebration: [
        "Wow! You're amazing!",
        "That was perfect!",
        "You're a reading superstar!",
        "I'm so proud of you!",
    ],
    frustration: [
        "It's okay to feel stuck. Let's try something easier.",
        "You're working so hard. Want to take a quick break?",
        "Remember, everyone learns at their own pace!",
        "Let's slow down and try again together.",
    ],
    help: [
        "I'm here to help! What do you need?",
        "Let's work on this together!",
        "No problem! I'll show you.",
    ],
};

export function getRandomResponse(category: keyof typeof lexiResponses): string {
    const responses = lexiResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

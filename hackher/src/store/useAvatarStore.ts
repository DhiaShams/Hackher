import { create } from "zustand";

export type Emotion = "happy" | "thinking" | "concerned" | "celebrating" | "listening";

interface AvatarState {
    emotion: Emotion;
    difficultyLevel: number; // 1 to 5
    setEmotion: (emotion: Emotion) => void;
    setDifficultyLevel: (level: number) => void;
    // Actions based on analysis
    registerStress: () => void;
    registerSuccess: () => void;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
    emotion: "happy",
    difficultyLevel: 3,

    setEmotion: (emotion) => set({ emotion }),

    setDifficultyLevel: (level) => set({ difficultyLevel: level }),

    registerStress: () => {
        const { difficultyLevel } = get();
        // Decrease difficulty if stressed, switch emotion to concerned
        set({
            emotion: "concerned",
            difficultyLevel: Math.max(1, difficultyLevel - 1)
        });

        // Auto-recover after a delay
        setTimeout(() => {
            set({ emotion: "happy" });
        }, 5000);
    },

    registerSuccess: () => {
        const { difficultyLevel } = get();
        set({
            emotion: "celebrating",
            difficultyLevel: Math.min(5, difficultyLevel + 1)
        });

        setTimeout(() => {
            set({ emotion: "happy" });
        }, 3000);
    },
}));

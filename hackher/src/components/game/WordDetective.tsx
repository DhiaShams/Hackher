"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Star } from "lucide-react";
import { useAvatarStore } from "@/store/useAvatarStore";

const LEVELS = [
    {
        target: "igh",
        hint: "I makes its name say 'I'!",
        words: [
            { id: 1, text: "light", isMatch: true },
            { id: 2, text: "lit", isMatch: false },
            { id: 3, text: "night", isMatch: true },
            { id: 4, text: "fit", isMatch: false },
            { id: 5, text: "high", isMatch: true },
            { id: 6, text: "sit", isMatch: false },
        ]
    },
    {
        target: "ph",
        hint: "P and H make the 'F' sound!",
        words: [
            { id: 1, text: "phone", isMatch: true },
            { id: 2, text: "pan", isMatch: false },
            { id: 3, text: "dolphin", isMatch: true },
            { id: 4, text: "pine", isMatch: false },
        ]
    }
];

export function WordDetective() {
    const [levelIndex, setLevelIndex] = useState(0);
    const [foundIds, setFoundIds] = useState<number[]>([]);
    const [message, setMessage] = useState("");
    const { registerSuccess } = useAvatarStore();

    const currentLevel = LEVELS[levelIndex];
    const totalMatches = currentLevel.words.filter(w => w.isMatch).length;
    const isLevelComplete = foundIds.length === totalMatches;

    const handleWordClick = (id: number, isMatch: boolean) => {
        if (foundIds.includes(id)) return;

        if (isMatch) {
            setFoundIds([...foundIds, id]);
            setMessage("Correct! 🎉");
            registerSuccess(); // Avatar celebrates
        } else {
            setMessage("Not that one! Listen for the sound.");
        }
    };

    const nextLevel = () => {
        if (levelIndex < LEVELS.length - 1) {
            setLevelIndex(levelIndex + 1);
            setFoundIds([]);
            setMessage("");
        } else {
            setMessage("You are a Master Detective! 🕵️‍♀️");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary">Mission: Find "{currentLevel.target}"</h2>
                <p className="text-muted-foreground bg-white/50 inline-block px-4 py-1 rounded-full border border-primary/20">
                    Hint: {currentLevel.hint}
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentLevel.words.map((word) => {
                    const isFound = foundIds.includes(word.id);

                    return (
                        <motion.button
                            key={word.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleWordClick(word.id, word.isMatch)}
                            disabled={isFound}
                            className={`h-32 rounded-2xl text-2xl font-bold shadow-md transition-all relative overflow-hidden ${isFound
                                ? "bg-green-100 text-green-700 border-2 border-green-400"
                                : "bg-white dark:bg-slate-800 text-foreground border border-border hover:border-primary/50"
                                }`}
                        >
                            {word.text}
                            {isFound && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 text-green-500"
                                >
                                    <Check size={24} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Feedback Area */}
            <div className="h-16 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            key={message}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="text-lg font-medium text-center"
                        >
                            {message}
                            {isLevelComplete && levelIndex < LEVELS.length - 1 && (
                                <div className="mt-2">
                                    <button
                                        onClick={nextLevel}
                                        className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg animate-bounce"
                                    >
                                        Next Mission &rarr;
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(foundIds.length / totalMatches) * 100}%` }}
                />
            </div>
        </div>
    );
}

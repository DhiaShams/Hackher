"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Play, RotateCcw, AlertCircle } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/speech/useSpeechRecognition";
import { useAvatarStore } from "@/store/useAvatarStore";

// RAN Test Items (Colors and Objects)
const TEST_ITEMS = [
    { id: 1, word: "red", color: "#ef4444", emoji: "🔴", type: "color" },
    { id: 2, word: "blue", color: "#3b82f6", emoji: "🔵", type: "color" },
    { id: 3, word: "chair", color: "#64748b", emoji: "🪑", type: "object" },
    { id: 4, word: "dog", color: "#a855f7", emoji: "🐕", type: "object" },
];

type GameState = "intro" | "ready" | "playing" | "complete";

export function RANScreeningGame() {
    const [gameState, setGameState] = useState<GameState>("intro");
    const [detectedWords, setDetectedWords] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [riskLevel, setRiskLevel] = useState<"low" | "high" | null>(null);
    const { registerStress, setEmotion } = useAvatarStore();

    const handleKeywordDetected = useCallback((keyword: string) => {
        if (gameState !== "playing") return;

        const normalizedKeyword = keyword.toLowerCase();

        // Check if this is a valid test word and hasn't been detected yet
        const isValidWord = TEST_ITEMS.some(item => item.word === normalizedKeyword);
        const isNewWord = !detectedWords.includes(normalizedKeyword);

        if (isValidWord && isNewWord) {
            setDetectedWords(prev => [...prev, normalizedKeyword]);
        }
    }, [gameState, detectedWords]);

    const handleEmotionKeyword = useCallback((keyword: string) => {
        console.log("Emotion keyword detected:", keyword);
        // Trigger empathy mode
        registerStress();
        setEmotion("concerned");
    }, [registerStress, setEmotion]);

    const keywords = TEST_ITEMS.map(item => item.word);

    const { isListening, transcript, isSupported, startListening, stopListening } =
        useSpeechRecognition({
            keywords,
            onKeywordDetected: handleKeywordDetected,
            onEmotionKeyword: handleEmotionKeyword,
        });

    // Check if all words detected
    useEffect(() => {
        if (gameState === "playing" && detectedWords.length === TEST_ITEMS.length) {
            const end = Date.now();
            setEndTime(end);
            stopListening();

            // Calculate time taken
            const timeTaken = (end - startTime) / 1000; // in seconds

            // Risk assessment algorithm
            const risk = timeTaken > 20 ? "high" : "low";
            setRiskLevel(risk);

            // Save to localStorage
            localStorage.setItem('screeningResult', risk);
            localStorage.setItem('screeningTime', timeTaken.toString());
            localStorage.setItem('screeningDate', new Date().toISOString());

            setGameState("complete");
        }
    }, [detectedWords, gameState, startTime, stopListening]);

    const startGame = () => {
        setGameState("playing");
        setDetectedWords([]);
        setStartTime(Date.now());
        setEndTime(0);
        setRiskLevel(null);
        startListening();
    };

    const resetGame = () => {
        setGameState("intro");
        setDetectedWords([]);
        setStartTime(0);
        setEndTime(0);
        setRiskLevel(null);
        stopListening();
    };

    if (!isSupported) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-destructive" />
                <h2 className="text-2xl font-bold">Browser Not Supported</h2>
                <p className="text-muted-foreground max-w-md">
                    Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-primary">RAN Screening Test</h2>
                <p className="text-muted-foreground">
                    Say the names of the items as fast as you can!
                </p>
            </div>

            {/* Intro Screen */}
            {gameState === "intro" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">How it works:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-left">
                            <li>Click "Start Test" and allow microphone access</li>
                            <li>Say the name of each item you see (Red, Blue, Chair, Dog)</li>
                            <li>Say them as quickly as you can!</li>
                            <li>The test ends when all 4 words are detected</li>
                        </ol>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm">
                                💡 <strong>Tip:</strong> If you're stuck, just say "help" and the Avatar will assist you!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setGameState("ready")}
                        className="w-full px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                    >
                        Start Test
                    </button>
                </motion.div>
            )}

            {/* Ready Screen */}
            {gameState === "ready" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center space-y-6"
                >
                    <div className="text-6xl">🎤</div>
                    <h3 className="text-2xl font-bold">Ready?</h3>
                    <p className="text-muted-foreground">
                        Click the button below to begin. The timer will start immediately!
                    </p>
                    <button
                        onClick={startGame}
                        className="px-12 py-4 bg-green-500 text-white rounded-full font-bold text-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
                    >
                        <Play size={24} />
                        GO!
                    </button>
                </motion.div>
            )}

            {/* Playing Screen */}
            {gameState === "playing" && (
                <div className="space-y-6">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2">
                            {isListening ? (
                                <>
                                    <Mic className="w-6 h-6 text-green-500 animate-pulse" />
                                    <span className="font-medium text-green-500">Listening...</span>
                                </>
                            ) : (
                                <>
                                    <MicOff className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-muted-foreground">Not listening</span>
                                </>
                            )}
                        </div>
                        <div className="text-sm font-mono">
                            {detectedWords.length} / {TEST_ITEMS.length} detected
                        </div>
                    </div>

                    {/* Item Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {TEST_ITEMS.map((item) => {
                            const isDetected = detectedWords.includes(item.word);

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: isDetected ? 1.05 : 1 }}
                                    className={`relative h-48 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-4 transition-all ${isDetected
                                            ? "bg-green-100 dark:bg-green-900/50 border-4 border-green-500"
                                            : "bg-white dark:bg-slate-800 border-2 border-border"
                                        }`}
                                >
                                    <div className="text-6xl">{item.emoji}</div>
                                    <div className="text-2xl font-bold capitalize" style={{ color: item.color }}>
                                        {item.word}
                                    </div>
                                    {isDetected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                                        >
                                            ✓
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Live Transcript */}
                    <div className="bg-muted p-4 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">What I heard:</p>
                        <p className="font-mono text-sm">{transcript || "..."}</p>
                    </div>
                </div>
            )}

            {/* Complete Screen */}
            {gameState === "complete" && riskLevel && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg space-y-6"
                >
                    <div className="text-center space-y-4">
                        <div className="text-6xl">🎉</div>
                        <h3 className="text-2xl font-bold">Test Complete!</h3>

                        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                            <p className="text-sm text-muted-foreground mb-2">Time Taken</p>
                            <p className="text-4xl font-bold">
                                {((endTime - startTime) / 1000).toFixed(1)}s
                            </p>
                        </div>

                        <div className={`p-6 rounded-xl ${riskLevel === "low"
                                ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                                : "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500"
                            }`}>
                            <p className="text-sm font-medium mb-2">Screening Result</p>
                            <p className="text-2xl font-bold capitalize">
                                {riskLevel === "low" ? "✅ Low Risk" : "⚠️ High Risk"}
                            </p>
                            <p className="text-sm mt-2 text-muted-foreground">
                                {riskLevel === "low"
                                    ? "Great job! Your naming speed is within normal range."
                                    : "Consider consulting with a reading specialist for further assessment."}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={resetGame}
                        className="w-full px-8 py-3 bg-primary text-white rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                        <RotateCcw size={20} />
                        Try Again
                    </button>
                </motion.div>
            )}
        </div>
    );
}

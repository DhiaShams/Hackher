"use client";

import { useEffect, useState } from "react";
import { useAudioAnalysis } from "@/hooks/useAudioAnalysis";
import { useAvatarStore } from "@/store/useAvatarStore";
import { AvatarFace } from "./AvatarFace";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { avatarVoice, getRandomResponse } from "@/utils/avatarVoice";

export function Avatar() {
    const { emotion, registerStress } = useAvatarStore();
    const { isListening, volume, hasSpeech, startListening, stopListening } = useAudioAnalysis();
    const [lastSpokenEmotion, setLastSpokenEmotion] = useState<string>("");

    // Simulate stress detection logic (simple volume threshold for V1)
    useEffect(() => {
        if (isListening && volume > 0.8) {
            // High volume/yelling trigger stress
            registerStress();
        }
    }, [volume, isListening, registerStress]);

    // Speak when emotion changes
    useEffect(() => {
        if (emotion !== lastSpokenEmotion && emotion !== "listening") {
            setLastSpokenEmotion(emotion);

            let message = "";
            switch (emotion) {
                case "happy":
                    message = getRandomResponse("greeting");
                    break;
                case "concerned":
                    message = getRandomResponse("frustration");
                    break;
                case "celebrating":
                    message = getRandomResponse("celebration");
                    break;
                case "thinking":
                    message = "Hmm, let me think about that...";
                    break;
            }

            if (message) {
                avatarVoice.speak(message);
            }
        }
    }, [emotion, lastSpokenEmotion]);

    const handleMicToggle = () => {
        if (isListening) {
            stopListening();
            avatarVoice.stop();
        } else {
            startListening();
            avatarVoice.speak(getRandomResponse("greeting"));
        }
    };

    const handleSpeak = () => {
        const message = getRandomResponse("encouragement");
        avatarVoice.speak(message);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <AvatarFace
                    emotion={emotion}
                    isSpeaking={hasSpeech}
                    volume={volume}
                />

                {/* Status Badge */}
                <div className="absolute -bottom-2 right-0 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 border border-border">
                    <span className={isListening ? "text-green-500 animate-pulse" : "text-gray-400"}>
                        ●
                    </span>
                    {isListening ? "Listening" : "Sleep"}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <button
                    onClick={handleMicToggle}
                    className={`p-3 rounded-full transition-all shadow-lg ${isListening
                            ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                    title={isListening ? "Stop Listening" : "Start Listening"}
                >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={handleSpeak}
                    className="p-3 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-all shadow-lg"
                    title="Hear Lexi Speak"
                >
                    <Volume2 size={24} />
                </button>
            </div>

            {/* Dialogue Text */}
            <div className="text-center min-h-[3rem] max-w-xs">
                <p className="text-sm text-muted-foreground italic">
                    {emotion === "concerned" && "💙 Take a deep breath... We'll go slower."}
                    {emotion === "happy" && "😊 I'm Lexi, your reading buddy!"}
                    {emotion === "celebrating" && "🎉 You're doing amazing!"}
                    {emotion === "thinking" && "🤔 Hmm, let me think..."}
                    {emotion === "listening" && "👂 I'm listening!"}
                </p>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { Emotion } from "@/store/useAvatarStore";

interface AvatarFaceProps {
    emotion: Emotion;
    isSpeaking: boolean;
    volume: number;
}

export function AvatarFace({ emotion, isSpeaking, volume }: AvatarFaceProps) {
    // Eye variations
    const eyeVariants = {
        happy: { scaleY: 1, rotate: 0 },
        thinking: { scaleY: 0.8, rotate: -10 },
        concerned: { scaleY: 0.9, rotate: 0, skewX: -10 },
        celebrating: { scaleY: 1.2, scaleX: 1.1 },
        listening: { scaleY: 1, rotate: 0 },
    };

    // Mouth variations
    const getMouthPath = () => {
        // Simple SVG path interpolation could go here, but using CSS border-radius is easier for V1
        switch (emotion) {
            case "happy":
            case "celebrating":
                return "rounded-b-[40px]"; // Smile
            case "concerned":
                return "rounded-t-[20px] translate-y-2"; // Frown-ish
            case "thinking":
                return "rounded-full w-4 h-4"; // O shape
            default:
                return "rounded-b-[20px]";
        }
    };

    return (
        <div className="relative w-48 h-48 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-500 border-4 border-white/20">
            {/* Eyes Container */}
            <div className="absolute top-1/3 left-0 right-0 flex justify-center gap-8 px-8">
                <motion.div
                    animate={eyeVariants[emotion]}
                    className="w-4 h-8 bg-white rounded-full shadow-sm"
                />
                <motion.div
                    animate={eyeVariants[emotion]}
                    className="w-4 h-8 bg-white rounded-full shadow-sm"
                />
            </div>

            {/* Cheeks (visible when happy) */}
            {(emotion === "happy" || emotion === "celebrating") && (
                <>
                    <div className="absolute top-[45%] left-10 w-4 h-2 bg-pink-400/50 rounded-full blur-sm" />
                    <div className="absolute top-[45%] right-10 w-4 h-2 bg-pink-400/50 rounded-full blur-sm" />
                </>
            )}

            {/* Mouth */}
            <motion.div
                className={`absolute bottom-10 bg-white shadow-inner ${getMouthPath()}`}
                animate={{
                    height: isSpeaking ? 10 + volume * 50 : 10,
                    width: isSpeaking ? 40 + volume * 20 : 40,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
        </div>
    );
}

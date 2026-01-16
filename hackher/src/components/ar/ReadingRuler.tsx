"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ReadingRulerProps {
    isActive: boolean;
}

export function ReadingRuler({ isActive }: ReadingRulerProps) {
    const [rulerY, setRulerY] = useState(50); // Percentage

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {/* Top Blur */}
            <div
                className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-sm transition-all duration-100"
                style={{ height: `${rulerY - 10}%` }}
            />

            {/* The Ruler / Focus Area */}
            <motion.div
                className="absolute left-0 right-0 h-[20%] border-y-2 border-yellow-400/50 bg-transparent flex items-center justify-center"
                style={{ top: `${rulerY - 10}%` }}
            >
                <span className="text-white/50 text-xs font-mono absolute right-2 top-1">Focus Mode</span>
            </motion.div>

            {/* Bottom Blur */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm transition-all duration-100"
                style={{ height: `${100 - (rulerY + 10)}%` }}
            />

            {/* Draggable Handle (Overlay interaction needs pointer-events-auto) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto">
                <input
                    type="range"
                    min="15"
                    max="85"
                    value={rulerY}
                    onChange={(e) => setRulerY(Number(e.target.value))}
                    className="h-48 -rotate-180 writing-mode-vertical"
                    style={{ writingMode: "vertical-lr" }}
                    aria-label="Adjust Ruler Position"
                />
            </div>
        </div>
    );
}

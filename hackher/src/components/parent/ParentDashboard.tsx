"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, BookOpen, Clock, Heart, Shield } from "lucide-react";
import { useAvatarStore } from "@/store/useAvatarStore";

export function ParentDashboard() {
    const { emotion, difficultyLevel } = useAvatarStore();
    const [timeReading, setTimeReading] = useState(12); // Minutes

    // Simulate time ticking
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeReading(prev => prev + 1);
        }, 60000); // Every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-border">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm">Live Session Active</h2>
                        <p className="text-xs text-muted-foreground">Updated just now</p>
                    </div>
                </div>
                <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 transition-colors">
                    End Session
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Emotion Card */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-100 dark:border-pink-800"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/50 rounded-lg">
                            <Heart className="text-pink-500" size={24} />
                        </div>
                        <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Emotion</span>
                    </div>
                    <h3 className="text-2xl font-bold capitalize mb-1">{emotion}</h3>
                    <p className="text-sm text-muted-foreground">
                        Maya is currently feeling {emotion}. The AI is {emotion === 'concerned' ? 'adjusting difficulty down' : 'challenging her'}.
                    </p>
                </motion.div>

                {/* Activity Card */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/50 rounded-lg">
                            <BookOpen className="text-blue-500" size={24} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Current Task</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Magic Lens</h3>
                    <p className="text-sm text-muted-foreground">
                        Reading "The Little Prince". Detected 5 difficult words.
                    </p>
                </motion.div>

                {/* Stats Card */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/50 rounded-lg">
                            <Activity className="text-amber-500" size={24} />
                        </div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Progress</span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                        <h3 className="text-2xl font-bold">Lvl {difficultyLevel}</h3>
                        <span className="text-sm text-muted-foreground mb-1">Difficulty</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(difficultyLevel / 5) * 100}%` }} />
                    </div>
                </motion.div>
            </div>

            {/* Screening Results */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={20} className="text-purple-500" />
                    <h3 className="font-bold">Latest Screening Result</h3>
                </div>
                {(() => {
                    const result = typeof window !== 'undefined' ? localStorage.getItem('screeningResult') : null;
                    const time = typeof window !== 'undefined' ? localStorage.getItem('screeningTime') : null;
                    const date = typeof window !== 'undefined' ? localStorage.getItem('screeningDate') : null;

                    if (!result) {
                        return (
                            <p className="text-sm text-muted-foreground">No screening test completed yet.</p>
                        );
                    }

                    return (
                        <div className="space-y-3">
                            <div className={`p-4 rounded-lg ${result === 'low'
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-orange-100 dark:bg-orange-900/30'
                                }`}>
                                <p className="font-bold text-lg capitalize">
                                    {result === 'low' ? '✅ Low Risk' : '⚠️ High Risk'}
                                </p>
                                <p className="text-sm mt-1">
                                    Completed in {parseFloat(time || '0').toFixed(1)}s
                                </p>
                                {date && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(date).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            {result === 'high' && (
                                <p className="text-sm text-muted-foreground">
                                    💡 Consider scheduling a follow-up with a reading specialist.
                                </p>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Conversation Starters */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <Shield size={20} />
                    <h3 className="font-bold">Conversation Starters</h3>
                </div>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-sm p-3 bg-muted/50 rounded-lg">
                        <span className="select-none">💡</span>
                        <span>"I saw you mastered the 'igh' sound today! Can you teach me a word with that sound?"</span>
                    </li>
                    <li className="flex gap-3 text-sm p-3 bg-muted/50 rounded-lg">
                        <span className="select-none">💡</span>
                        <span>"The Avatar said you were super confident. What was your favorite part?"</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

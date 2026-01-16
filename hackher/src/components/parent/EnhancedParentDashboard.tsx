"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, BookOpen, Heart, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { useAvatarStore } from "@/store/useAvatarStore";

interface ScreeningData {
    result: "low" | "high" | null;
    time: number;
    date: string;
}

export function EnhancedParentDashboard() {
    const { emotion, difficultyLevel } = useAvatarStore();
    const [screeningData, setScreeningData] = useState<ScreeningData>({
        result: null,
        time: 0,
        date: "",
    });

    useEffect(() => {
        // Load screening data from localStorage
        const result = localStorage.getItem('screeningResult') as "low" | "high" | null;
        const time = parseFloat(localStorage.getItem('screeningTime') || '0');
        const date = localStorage.getItem('screeningDate') || '';

        setScreeningData({ result, time, date });
    }, []);

    const getRecommendedPlan = () => {
        if (!screeningData.result) return null;

        if (screeningData.result === "low") {
            return {
                title: "Maintenance Plan",
                icon: "✅",
                color: "green",
                steps: [
                    "Continue regular reading practice (15-20 min/day)",
                    "Use the Magic Lens for challenging texts",
                    "Play Word Detective 2-3 times per week",
                    "Celebrate progress and build confidence",
                ],
            };
        } else {
            return {
                title: "Intervention Plan",
                icon: "⚠️",
                color: "orange",
                steps: [
                    "Schedule assessment with reading specialist",
                    "Daily practice with Magic Lens (20-30 min)",
                    "Complete RAN screening monthly to track progress",
                    "Use Word Detective daily for phonics practice",
                    "Consider multisensory reading programs",
                ],
            };
        }
    };

    const plan = getRecommendedPlan();

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

            {/* Screening Results with Chart */}
            {screeningData.result && (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-purple-500" />
                        <h3 className="font-bold">RAN Screening Results</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Result Display */}
                        <div className={`p-6 rounded-xl ${screeningData.result === 'low'
                                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                : 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                            }`}>
                            <p className="text-sm font-medium mb-2">Risk Level</p>
                            <p className="text-3xl font-bold capitalize mb-2">
                                {screeningData.result === 'low' ? '✅ Low Risk' : '⚠️ High Risk'}
                            </p>
                            <p className="text-lg font-semibold mb-1">
                                {screeningData.time.toFixed(1)}s
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Completed: {new Date(screeningData.date).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Simple Bar Chart */}
                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-medium mb-3">Performance vs. Threshold</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-20">Your Time:</span>
                                    <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                                        <div
                                            className={`h-full ${screeningData.result === 'low' ? 'bg-green-500' : 'bg-orange-500'}`}
                                            style={{ width: `${Math.min((screeningData.time / 30) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono">{screeningData.time.toFixed(1)}s</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs w-20">Threshold:</span>
                                    <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                                        <div className="h-full bg-gray-400" style={{ width: '66.67%' }} />
                                    </div>
                                    <span className="text-xs font-mono">20.0s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommended Plan */}
            {plan && (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={20} className={`text-${plan.color}-500`} />
                        <h3 className="font-bold">{plan.icon} {plan.title}</h3>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        {plan.steps.map((step, i) => (
                            <li key={i} className="text-muted-foreground">{step}</li>
                        ))}
                    </ol>
                </div>
            )}

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
                        <span>"Lexi said you were super confident. What was your favorite part?"</span>
                    </li>
                    {screeningData.result === 'low' && (
                        <li className="flex gap-3 text-sm p-3 bg-muted/50 rounded-lg">
                            <span className="select-none">💡</span>
                            <span>"Your screening test was great! How did it feel to name all those items so quickly?"</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

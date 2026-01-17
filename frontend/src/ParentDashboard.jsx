import React, { useEffect, useState } from 'react';
import { Activity, Clock, Calendar, AlertTriangle, CheckCircle, BookOpen, Trophy, Star } from 'lucide-react';

export default function ParentDashboard() {
    const [result, setResult] = useState(null);
    const [storyAchievements, setStoryAchievements] = useState([]);

    useEffect(() => {
        // Fetch screening result from localStorage
        const storedResult = localStorage.getItem('screeningResult');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
        }

        // Fetch story achievements
        const storedStories = localStorage.getItem('storyAchievements');
        if (storedStories) {
            setStoryAchievements(JSON.parse(storedStories));
        }
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Parent Dashboard</h2>
                <p className="text-gray-600">Overview of your child's recent activities and screening results.</p>
            </div>

            {/* Screening Result Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-purple-700 flex items-center gap-3">
                        <Activity className="w-8 h-8" />
                        Latest RAN Screening
                    </h3>
                    <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold">
                        RAN Task
                    </span>
                </div>

                {!result ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No screening data available yet.</p>
                        <p className="text-gray-400 text-sm mt-2">Have your child complete the "Word Detective" game to see results here.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Risk Level Badge */}
                        <div className={`col-span-2 p-6 rounded-2xl flex items-center justify-between ${result.riskLevel === 'High Risk'
                            ? 'bg-red-50 border-l-8 border-red-500'
                            : 'bg-green-50 border-l-8 border-green-500'
                            }`}>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-1">Risk Assessment</h4>
                                <p className={`text-3xl font-bold ${result.riskLevel === 'High Risk' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {result.riskLevel}
                                </p>
                            </div>
                            <div className={`p-4 rounded-full ${result.riskLevel === 'High Risk' ? 'bg-red-100' : 'bg-green-100'
                                }`}>
                                {result.riskLevel === 'High Risk' ? (
                                    <AlertTriangle className={`w-10 h-10 ${result.riskLevel === 'High Risk' ? 'text-red-500' : 'text-green-500'}`} />
                                ) : (
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                )}
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="bg-blue-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-gray-600 font-medium">Time Taken</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 ml-16">
                                {result.timeTaken} <span className="text-lg text-gray-500 font-normal">seconds</span>
                            </p>
                            <p className="text-sm text-gray-500 ml-16 mt-1">Threshold: 20 seconds</p>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                </div>
                                <span className="text-gray-600 font-medium">Date Completed</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 ml-16">
                                {formatDate(result.timestamp)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Story Weaver Achievements Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-pink-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-pink-600 flex items-center gap-3">
                        <BookOpen className="w-8 h-8" />
                        Story Weaver Adventures
                    </h3>
                    <span className="bg-pink-100 text-pink-800 px-4 py-1 rounded-full text-sm font-semibold">
                        Creative Writing
                    </span>
                </div>

                {storyAchievements.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No stories completed yet.</p>
                        <p className="text-gray-400 text-sm mt-2">Encourage your child to create their first story with the Avatar!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {storyAchievements.map((story, index) => (
                            <div key={index} className="flex items-center justify-between bg-pink-50 p-6 rounded-2xl border border-pink-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white rounded-full shadow-sm">
                                        <Trophy className="w-8 h-8 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-800">{story.title}</h4>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            Completed on {formatDate(story.timestamp)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(story.stars || 3)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-3 bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold text-sm">
                                        COMPLETED
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Additional Placeholders */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-800 mb-2">Progress Report</h4>
                    <p className="text-gray-500 text-sm">Detailed learning analytics coming soon.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-800 mb-2">Recommendations</h4>
                    <p className="text-gray-500 text-sm">Personalized reading lists based on performance.</p>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Award, Star, Trophy, Target } from 'lucide-react';

const AchievementsTab = () => {
    // Dummy Data
    const achievements = [
        { id: 1, title: 'Word Wizard', desc: 'Learned 50 new words', icon: <Star size={32} className="text-yellow-500" />, color: 'bg-yellow-100', progress: 100 },
        { id: 2, title: 'Storyteller', desc: 'Completed 3 stories', icon: <BookOpen size={32} className="text-blue-500" />, color: 'bg-blue-100', progress: 75 },
        { id: 3, title: 'Eagle Eye', desc: 'Used Reading Lens 10 times', icon: <Target size={32} className="text-green-500" />, color: 'bg-green-100', progress: 40 },
        { id: 4, title: 'Super Speaker', desc: 'Recorded 5 minutes of speech', icon: <Mic size={32} className="text-purple-500" />, color: 'bg-purple-100', progress: 90 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-300">
                        <Trophy size={40} className="text-amber-600" />
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-amber-800" style={{ fontFamily: "'Fredoka', cursive" }}>Your Trophy Room 🏆</h2>
                <p className="text-amber-700 text-lg mt-2">Look at all the amazing things you've done!</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-orange-200 text-center">
                    <div className="text-3xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-gray-600 font-bold">Badges</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-yellow-200 text-center">
                    <div className="text-3xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-gray-600 font-bold">Level</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-green-200 text-center">
                    <div className="text-3xl font-bold text-green-600">850</div>
                    <div className="text-sm text-gray-600 font-bold">Points</div>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-4 shadow-lg border-2 border-slate-100 hover:scale-105 transition-transform">
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 rounded-xl ${item.color}`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-orange-400 to-amber-500 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                        <div className="text-right text-xs font-bold text-slate-400 mt-1">{item.progress}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Missing icons helper
const BookOpen = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);

const Mic = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
);

export default AchievementsTab;

import React from 'react';
import { X, User, Award, BookOpen, Clock, Settings } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, onViewAchievements }) => {
    if (!isOpen) return null;

    const profileData = {
        name: "Little Explorer",
        avatar: "👦",
        level: 5,
        points: 450,
        wordsLearned: 127,
        gamesPlayed: 23,
        timeSpent: "12h 30m"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div
                className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 shadow-2xl border-4 border-orange-300 max-w-md w-full mx-4 animate-in zoom-in duration-300"
                style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-orange-200 rounded-full transition-colors"
                >
                    <X size={24} className="text-orange-600" />
                </button>

                {/* Profile Header */}
                <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full flex items-center justify-center text-6xl mx-auto mb-4 border-4 border-orange-400 shadow-xl">
                        {profileData.avatar}
                    </div>
                    <h2 className="text-3xl font-bold text-orange-800 mb-1">
                        {profileData.name}
                    </h2>
                    <p className="text-lg text-orange-600 font-semibold">
                        Level {profileData.level} Explorer 🌟
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/80 rounded-2xl p-4 text-center border-2 border-orange-200">
                        <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-700">{profileData.points}</p>
                        <p className="text-sm text-gray-600">Points</p>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-4 text-center border-2 border-orange-200">
                        <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-700">{profileData.wordsLearned}</p>
                        <p className="text-sm text-gray-600">Words Learned</p>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-4 text-center border-2 border-orange-200">
                        <span className="text-3xl block mb-2">🎮</span>
                        <p className="text-2xl font-bold text-orange-700">{profileData.gamesPlayed}</p>
                        <p className="text-sm text-gray-600">Games Played</p>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-4 text-center border-2 border-orange-200">
                        <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-700">{profileData.timeSpent}</p>
                        <p className="text-sm text-gray-600">Time Spent</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white py-3 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                        <Settings size={20} />
                        Settings
                    </button>
                    <button
                        onClick={onViewAchievements}
                        className="w-full bg-white hover:bg-orange-50 text-orange-700 py-3 rounded-2xl font-bold text-lg border-2 border-orange-300 transition-all duration-200"
                    >
                        View Achievements
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;

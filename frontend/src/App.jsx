import React, { useState } from 'react';
import { Search, Bell, Home, Award, Users } from 'lucide-react';

export default function Dashboard() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    const handleCourseClick = (courseName) => {
        setSelectedCourse(courseName);
        setTimeout(() => setSelectedCourse(null), 2000);
    };

    const courses = [
        {
            id: 1,
            title: 'Word Detective',
            color: 'bg-[#C5D89D]',
            hoverColor: 'hover:bg-[#B5C88D]',
            icon: '🔍',
            size: 'text-6xl'
        },
        {
            id: 2,
            title: 'Reading Lens',
            color: 'bg-[#EEEEEE]',
            hoverColor: 'hover:bg-[#E0E0E0]',
            icon: '👓',
            size: 'text-6xl'
        },
        {
            id: 3,
            title: 'Story Weaver',
            color: 'bg-[#EDEDCE]',
            hoverColor: 'hover:bg-[#EBEBC0]',
            icon: '📖',
            size: 'text-6xl'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 relative overflow-hidden pb-24">
            {/* Decorative Clouds - More Faded */}
            <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-30 blur-md"></div>
            <div className="absolute top-20 right-20 w-40 h-24 bg-white rounded-full opacity-25 blur-md"></div>
            <div className="absolute top-40 left-1/4 w-28 h-16 bg-white rounded-full opacity-20 blur-md"></div>
            <div className="absolute top-60 right-1/3 w-36 h-20 bg-white rounded-full opacity-25 blur-md"></div>
            <div className="absolute bottom-40 left-1/2 w-32 h-18 bg-white rounded-full opacity-20 blur-md"></div>
            <div className="absolute top-32 right-10 w-24 h-16 bg-white rounded-full opacity-20 blur-md"></div>

            {/* Trees */}
            <div className="absolute bottom-24 left-10 opacity-30">
                <div className="text-8xl">🌳</div>
            </div>
            <div className="absolute bottom-24 right-16 opacity-30">
                <div className="text-7xl">🌲</div>
            </div>
            <div className="absolute bottom-32 left-32 opacity-25">
                <div className="text-6xl">🌳</div>
            </div>
            <div className="absolute bottom-28 right-40 opacity-25">
                <div className="text-6xl">🌲</div>
            </div>

            {/* Kids Props */}
            <div className="absolute top-1/4 left-5 opacity-40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <div className="text-5xl">🎈</div>
            </div>
            <div className="absolute top-1/3 right-10 opacity-40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
                <div className="text-4xl">⭐</div>
            </div>
            <div className="absolute bottom-1/3 left-16 opacity-35">
                <div className="text-5xl">🎨</div>
            </div>
            <div className="absolute top-1/2 right-24 opacity-35 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
                <div className="text-4xl">🎭</div>
            </div>
            <div className="absolute bottom-1/2 left-1/4 opacity-30">
                <div className="text-5xl">✏️</div>
            </div>
            <div className="absolute top-2/3 right-1/3 opacity-35 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>
                <div className="text-4xl">🌈</div>
            </div>
            <div className="absolute bottom-1/4 right-12 opacity-30">
                <div className="text-5xl">🎪</div>
            </div>
            <div className="absolute top-1/4 left-1/3 opacity-35">
                <div className="text-4xl">🦋</div>
            </div>

            {/* Desktop Layout */}
            {/* Desktop Layout */}
            <div className="max-w-5xl mx-auto p-4 relative z-10">
                {/* Header */}
                <header className="flex items-center justify-end mb-8 bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <button className="p-3 hover:bg-purple-100 rounded-full transition-colors">
                            <Search size={24} className="text-purple-600" />
                        </button>
                        <button className="p-3 hover:bg-purple-100 rounded-full transition-colors">
                            <Bell size={24} className="text-purple-600" />
                        </button>
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg"></div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    {/* Title Section */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-lime-300 to-emerald-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                                <span className="text-5xl">✦</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Creative</h1>
                        <h2 className="text-3xl font-serif italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kids Academy</h2>
                        <p className="text-gray-600 text-xl mt-6 max-w-2xl mx-auto">
                            Where young minds flourish and explore! 🌟
                        </p>
                    </div>

                    {/* Course Cards - Centered Square Buttons */}
                    <div className="flex justify-center gap-8 mb-8">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => handleCourseClick(course.title)}
                                className={`${course.color} ${course.hoverColor} rounded-3xl p-4 relative overflow-hidden w-48 h-48 flex flex-col items-center justify-center text-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl group`}
                            >
                                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    <span className={course.size}>{course.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{course.title}</h3>
                            </button>
                        ))}
                    </div>

                    {/* Selected Course Indicator */}
                    {selectedCourse && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl text-center animate-bounce shadow-lg">
                            <p className="text-2xl font-bold text-purple-600">🎉 Great choice! You selected: {selectedCourse} 🎉</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-2xl border-t-4 border-purple-200 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex justify-center gap-12">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center justify-center px-8 py-3 rounded-full transition-all duration-300 ${activeTab === 'home'
                                ? 'bg-[#EDEDCE] text-purple-900 scale-110 shadow-xl border-4 border-purple-300'
                                : 'bg-[#EDEDCE] text-purple-700 hover:bg-[#EBEBC0]'
                                }`}
                        >
                            <Home size={28} strokeWidth={2.5} />
                            <span className="text-lg font-bold mt-2">Home</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={`flex flex-col items-center justify-center px-8 py-3 rounded-full transition-all duration-300 ${activeTab === 'achievements'
                                ? 'bg-[#EEEEEE] text-amber-900 scale-110 shadow-xl border-4 border-amber-300'
                                : 'bg-[#EEEEEE] text-amber-700 hover:bg-[#E0E0E0]'
                                }`}
                        >
                            <Award size={28} strokeWidth={2.5} />
                            <span className="text-lg font-bold mt-2">Achievements</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('parents')}
                            className={`flex flex-col items-center justify-center px-8 py-3 rounded-full transition-all duration-300 ${activeTab === 'parents'
                                ? 'bg-[#C5D89D] text-emerald-900 scale-110 shadow-xl border-4 border-emerald-300'
                                : 'bg-[#C5D89D] text-emerald-700 hover:bg-[#B5C88D]'
                                }`}
                        >
                            <Users size={28} strokeWidth={2.5} />
                            <span className="text-lg font-bold mt-2">Parents</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

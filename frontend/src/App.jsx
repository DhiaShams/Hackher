import React, { useState } from 'react';
import { Home, Award, Users, ArrowLeft, User } from 'lucide-react';
import BalloonGame from './features/games/components/BalloonGame';
import StoryMode from './features/games/components/StoryTelling/StoryMode';
import BionicReaderApp from './features/bionic-reader/BionicReaderApp';
import SnowmanAvatar from './features/games/components/SnowmanAvatar';
import AchievementsTab from './components/AchievementsTab';
import ParentsTab from './components/ParentsTab';
import WordOfTheDay from './components/WordOfTheDay';
import ProfileModal from './components/ProfileModal';
import bgImage from '../assets/bg.jpeg';

export default function Dashboard() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null); // null, 'word-detective', 'reading-lens', 'story-weaver'
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

    const handleCourseClick = (courseName, featureId) => {
        setSelectedCourse(courseName);
        setTimeout(() => {
            setSelectedCourse(null);
            setActiveFeature(featureId);
        }, 1500);
    };

    const handleBackToDashboard = () => {
        setActiveFeature(null);
        setActiveTab('home');
    };

    const courses = [
        {
            id: 1,
            title: 'Word Detective',
            featureId: 'word-detective',
            color: 'bg-[#C5D89D]',
            hoverColor: 'hover:bg-[#B5C88D]',
            icon: '🔍',
            size: 'text-6xl'
        },
        {
            id: 2,
            title: 'Reading Lens',
            featureId: 'reading-lens',
            color: 'bg-[#EEEEEE]',
            hoverColor: 'hover:bg-[#E0E0E0]',
            icon: '👓',
            size: 'text-6xl'
        },
        {
            id: 3,
            title: 'Story Weaver',
            featureId: 'story-weaver',
            color: 'bg-[#EDEDCE]',
            hoverColor: 'hover:bg-[#EBEBC0]',
            icon: '📖',
            size: 'text-6xl'
        }
    ];

    // Render active feature
    if (activeFeature === 'word-detective') {
        return (
            <div className="min-h-screen">
                <button
                    onClick={handleBackToDashboard}
                    className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <BalloonGame />
            </div>
        );
    }

    if (activeFeature === 'reading-lens') {
        return <BionicReaderApp onBack={handleBackToDashboard} />;
    }

    if (activeFeature === 'story-weaver') {
        return (
            <div
                className="min-h-screen p-6 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <button
                    onClick={handleBackToDashboard}
                    className="mb-6 flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
                <StoryMode />
            </div>
        );
    }

    // Dashboard View
    return (
        <div
            className="min-h-screen relative pb-40 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
                backgroundImage: `url(${bgImage})`
            }}
        >
            {/* Desktop Layout */}
            <div className="max-w-5xl mx-auto p-4 relative z-10">
                {/* Header - Proper Navbar */}
                <header className="relative flex items-center justify-center mb-8 bg-gradient-to-r from-orange-100 to-yellow-100 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-lg border-2 border-orange-200">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">🌟</div>
                        <h1 className="text-2xl font-bold text-orange-800" style={{ fontFamily: "'Fredoka', 'Comic Neue', cursive" }}>
                            Ollie Reads
                        </h1>
                    </div>
                    <div className="absolute right-6 flex items-center gap-4">
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full shadow-lg border-2 border-orange-300 hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                        >
                            <User size={24} className="text-white" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-orange-200">

                    {/* HOME TAB CONTENT */}
                    {activeTab === 'home' && (
                        <div className="animate-in fade-in duration-500">
                            {/* Title Section */}
                            <div className="text-center mb-12">
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full flex items-center justify-center shadow-xl">
                                        <span className="text-5xl">✨</span>
                                    </div>
                                </div>
                                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: "'Fredoka', 'Comic Neue', cursive" }}>
                                    Welcome to Ollie Reads!
                                </h1>
                                <p className="text-orange-700 text-xl mt-4 max-w-2xl mx-auto font-semibold">
                                    Where young minds flourish and explore! 🌟
                                </p>
                            </div>

                            {/* Course Cards - Centered Square Buttons */}
                            <div className="flex justify-center gap-8 mb-8">
                                {courses.map((course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => handleCourseClick(course.title, course.featureId)}
                                        className={`${course.color} ${course.hoverColor} rounded-3xl p-4 relative overflow-hidden w-48 h-48 flex flex-col items-center justify-center text-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl group border-2 border-orange-200`}
                                    >
                                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                            <span className={course.size}>{course.icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-orange-900" style={{ fontFamily: "'Fredoka', 'Comic Neue', cursive" }}>{course.title}</h3>
                                    </button>
                                ))}
                            </div>

                            {/* Selected Course Indicator */}
                            {selectedCourse && (
                                <div className="mt-6 p-6 bg-gradient-to-r from-orange-200 to-amber-200 rounded-2xl text-center shadow-lg border-2 border-orange-300">
                                    <p className="text-2xl font-bold text-orange-800" style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}>🎉 Great choice! You selected: {selectedCourse} 🎉</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACHIEVEMENTS TAB CONTENT */}
                    {activeTab === 'achievements' && <AchievementsTab />}

                    {/* PARENTS TAB CONTENT */}
                    {activeTab === 'parents' && <ParentsTab />}

                </div>
            </div>

            {/* Bottom Navigation - Fixed at bottom with warm colors */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-100 to-yellow-100 backdrop-blur-sm shadow-2xl border-t-4 border-orange-300 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex justify-center gap-8">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center justify-center px-8 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'home'
                                ? 'bg-gradient-to-br from-orange-400 to-amber-400 text-white scale-110 shadow-xl border-4 border-orange-500'
                                : 'bg-orange-200 text-orange-800 hover:bg-orange-300 border-2 border-orange-300'
                                }`}
                            style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
                        >
                            <Home size={28} strokeWidth={2.5} />
                            <span className="text-lg font-bold mt-2">Home</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={`flex flex-col items-center justify-center px-8 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'achievements'
                                ? 'bg-gradient-to-br from-amber-400 to-yellow-400 text-white scale-110 shadow-xl border-4 border-amber-500'
                                : 'bg-amber-200 text-amber-800 hover:bg-amber-300 border-2 border-amber-300'
                                }`}
                            style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
                        >
                            <Award size={28} strokeWidth={2.5} />
                            <span className="text-lg font-bold mt-2">Achievements</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('parents')}
                            className={`flex flex-col items-center justify-center px-8 py-3 rounded-2xl transition-all duration-300 ${activeTab === 'parents'
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white scale-110 shadow-xl border-4 border-yellow-500'
                                : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 border-2 border-yellow-300'
                                }`}
                            style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
                        >
                            <Users size={28} strokeWidth={2.5} />
                            <span className="text-lg font-bold mt-2">Parents</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Word of the Day - positioned next to avatar */}
            {activeTab === 'home' && !activeFeature && (
                <div style={{ position: 'fixed', bottom: '420px', right: '150px', zIndex: 65 }}>
                    <WordOfTheDay onSpeakingChange={setIsAvatarSpeaking} />
                </div>
            )}

            {/* Global Avatar for Homepage */}
            <div style={{ position: 'fixed', bottom: '0', right: '0', zIndex: 60, pointerEvents: 'none' }}>
                <SnowmanAvatar
                    size="xlarge"
                    isVisible={true}
                    isSpeaking={isAvatarSpeaking}
                    emotion="happy"
                />
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onViewAchievements={() => {
                    setActiveTab('achievements');
                    setIsProfileOpen(false);
                }}
            />
        </div>
    );
}

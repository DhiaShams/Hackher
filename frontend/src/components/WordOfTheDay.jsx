import React, { useState, useEffect } from 'react';
import { generateAvatarResponse } from '../services/geminiService';

const WordOfTheDay = ({ onSpeakingChange }) => {
    const [wordData, setWordData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWordOfTheDay();
    }, []);

    const fetchWordOfTheDay = async () => {
        setIsLoading(true);
        try {
            const response = await generateAvatarResponse(
                "Give me ONE simple, fun word for kids (like 'sparkle', 'brave', 'wonder'). Format: WORD: [word] | PRONUNCIATION: [phonetic like SPAR-kul] | MEANING: [one short sentence]",
                "teaching"
            );

            const wordMatch = response.match(/WORD:\s*([^\|]+)/i);
            const pronMatch = response.match(/PRONUNCIATION:\s*([^\|]+)/i);
            const meaningMatch = response.match(/MEANING:\s*(.+)/i);

            if (wordMatch && pronMatch && meaningMatch) {
                const word = wordMatch[1].trim();
                const pronunciation = pronMatch[1].trim();
                const meaning = meaningMatch[1].trim();

                const newData = { word, pronunciation, meaning };
                setWordData(newData);

                // Speak after a slight delay to ensure render
                setTimeout(() => {
                    try {
                        speakWord(word, pronunciation);
                    } catch (e) {
                        console.error("Speech error", e);
                    }
                }, 100);
            } else {
                throw new Error("Invalid format");
            }
        } catch (error) {
            console.error("Error fetching word of the day:", error);
            // Fallback data so box never disappears
            setWordData({
                word: "Sparkle",
                pronunciation: "SPAR-kul",
                meaning: "Shine brightly! ✨"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const speakWord = (word, pronunciation) => {
        if (!('speechSynthesis' in window)) return;

        try {
            window.speechSynthesis.cancel();

            if (onSpeakingChange) onSpeakingChange(true);

            // Robust voice selection
            const getKidVoice = () => {
                const voices = window.speechSynthesis.getVoices();
                const preferredVoices = ['Google US English', 'Microsoft Zira', 'Samantha'];

                for (let name of preferredVoices) {
                    const found = voices.find(v => v.name.includes(name));
                    if (found) return found;
                }
                return voices.find(v => v.lang.startsWith('en')) || voices[0];
            };

            const voice = getKidVoice();
            // KID VOICE SETTINGS: Higher Pitch + Energetic Rate
            const kidPitch = 1.6;
            const kidRate = 1.1;

            const utterance1 = new SpeechSynthesisUtterance(`Today's word is`);
            if (voice) utterance1.voice = voice;
            utterance1.pitch = kidPitch;
            utterance1.rate = kidRate;

            const utterance2 = new SpeechSynthesisUtterance(word);
            if (voice) utterance2.voice = voice;
            utterance2.pitch = kidPitch;
            utterance2.rate = 1.0;

            const utterance3 = new SpeechSynthesisUtterance(`Say it with me: ${pronunciation}`);
            if (voice) utterance3.voice = voice;
            utterance3.pitch = kidPitch;
            utterance3.rate = kidRate;

            utterance1.onend = () => setTimeout(() => window.speechSynthesis.speak(utterance2), 800);
            utterance2.onend = () => setTimeout(() => window.speechSynthesis.speak(utterance3), 1000);
            utterance3.onend = () => {
                if (onSpeakingChange) onSpeakingChange(false);
            };

            utterance1.onerror = () => {
                if (onSpeakingChange) onSpeakingChange(false);
            };

            window.speechSynthesis.speak(utterance1);
        } catch (e) {
            console.error("Speech synthesis failed", e);
            if (onSpeakingChange) onSpeakingChange(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl p-4 shadow-xl border-3 border-blue-300 max-w-xs animate-pulse relative">
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-l-[20px] border-l-white"></div>
                <div className="h-4 bg-blue-200 rounded mb-2"></div>
                <div className="h-3 bg-blue-100 rounded w-2/3"></div>
            </div>
        );
    }

    if (!wordData) return null;

    return (
        <div className="relative group">
            {/* Main Cloud Bubble - Improved Oval Shape */}
            <div
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-56 h-48 shadow-2xl border-4 border-blue-400 cursor-pointer hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center p-4 text-center relative z-10"
                onClick={() => speakWord(wordData.word, wordData.pronunciation)}
                style={{ fontFamily: "'Comic Neue', 'Comic Sans MS', cursive" }}
            >
                <p className="text-blue-600 font-bold text-xs uppercase mb-1">
                    💭 Daily Word
                </p>
                <h3 className="text-5xl font-extrabold text-blue-700 mb-0.5 leading-none">
                    {wordData.word}
                </h3>
                <p className="text-lg text-purple-600 font-bold mb-0.5">
                    🔊 {wordData.pronunciation}
                </p>
                <p className="text-xs text-gray-600 italic leading-tight px-4 truncate max-w-full">
                    {wordData.meaning}
                </p>
            </div>

            {/* Thought Cloud "Sparks" (Circles) - Moved to fill gap to avatar */}
            <div className="absolute -bottom-10 right-4 flex flex-col items-center gap-1 scale-90">
                <div className="w-8 h-8 bg-blue-100 border-2 border-blue-400 rounded-full shadow-lg"></div>
                <div className="w-5 h-5 bg-blue-50 border-2 border-blue-400 rounded-full shadow-md ml-4"></div>
                <div className="w-3 h-3 bg-white border-2 border-blue-300 rounded-full shadow-sm ml-8"></div>
            </div>
        </div>
    );
};

export default WordOfTheDay;

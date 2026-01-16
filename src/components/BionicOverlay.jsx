import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { toBionic } from '../utils/bionic';
import { getSynonym } from '../utils/synonyms';
import { Star, ArrowRight, ArrowLeft } from 'lucide-react';

const BionicOverlay = ({ text }) => {
    // 1. Split Text into Sentences
    const sentences = useMemo(() => {
        if (!text) return [];
        // Split by punctuation (. ! ?), keeping punctuation attached.
        const match = text.match(/[^.!?]+[.!?]+/g);
        if (match) {
            return match.map(s => s.trim());
        }
        // Fallback if no punctuation found or just one sentence
        return [text.trim()];
    }, [text]);

    const [activeIndex, setActiveIndex] = useState(0);

    // Track simplified words per sentence
    // Structure: { [sentenceIndex]: [{ wordIndex: newBionicWord }] } is too complex.
    // Let's just store a global set of simplified words? No, indices restart per sentence.
    // Solution: Store modifications as { "sentenceIndex-wordIndex": newWordObj }
    const [simplifiedMap, setSimplifiedMap] = useState({});
    const [simplifiedCount, setSimplifiedCount] = useState(0);

    // Reset state on new text
    useEffect(() => {
        setActiveIndex(0);
        setSimplifiedMap({});
        setSimplifiedCount(0);
    }, [text]);

    // Refs for scrolling
    const activeSentenceRef = useRef(null);

    // Scroll active sentence into view
    useEffect(() => {
        if (activeSentenceRef.current) {
            activeSentenceRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [activeIndex]);

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (activeIndex < sentences.length - 1) {
            setActiveIndex(prev => prev + 1);
        }
    };

    const handleWordClick = useCallback((sentenceIndex, wordIndex, originalWord) => {
        // Only allow interaction on active sentence? Requirement says "active sentence must still support... Features".
        // It implies interaction.
        const synonym = getSynonym(originalWord);
        if (synonym) {
            const [processedSynonym] = toBionic(synonym);

            setSimplifiedMap(prev => ({
                ...prev,
                [`${sentenceIndex}-${wordIndex}`]: processedSynonym
            }));

            setSimplifiedCount(prev => prev + 1);
        }
    }, []);

    return (
        <div className="w-full h-full pb-20 relative">

            <div
                className="text-center select-none text-black leading-loose"
                style={{
                    fontFamily: "'Comic Neue', 'Comic Sans MS', cursive, system-ui, sans-serif",
                    fontSize: '1.5rem', // Increased font size
                    wordSpacing: '0.5rem', // Increased space between words
                }}
            >
                {sentences.map((sentence, sIdx) => {
                    const isActive = sIdx === activeIndex;

                    // Memoize bionic conversion for this sentence?
                    // toBionic is fast enough to run in render for distinct sentences.
                    const sentenceWords = toBionic(sentence);

                    return (
                        <div
                            key={sIdx}
                            ref={isActive ? activeSentenceRef : null}
                            onClick={() => !isActive && setActiveIndex(sIdx)}
                            className={`
                                mb-8 p-6 rounded-2xl transition-all duration-500 ease-in-out mx-auto max-w-3xl
                                ${isActive
                                    ? 'opacity-100 scale-102 bg-gradient-to-r from-[#FFE5B4] to-[#FFF4E6] border-4 border-[#FB923C] shadow-2xl transform z-10'
                                    : 'opacity-40 blur-[1px] grayscale hover:opacity-60 cursor-pointer border-4 border-transparent'
                                }
                            `}
                        >
                            {sentenceWords.map((wordObj, wIdx) => {
                                // Check if we simplified this word
                                const simplifiedWord = simplifiedMap[`${sIdx}-${wIdx}`];
                                const currentWordObj = simplifiedWord || wordObj;
                                const isSimplified = !!simplifiedWord;

                                const hasSynonym = getSynonym(currentWordObj.original);
                                const isSimplifiable = isActive && hasSynonym && !isSimplified;

                                return (
                                    <React.Fragment key={wIdx}>
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent toggling sentence focus when clicking word
                                                if (isActive) handleWordClick(sIdx, wIdx, currentWordObj.original);
                                            }}
                                            className={`
                                                transition-all duration-200
                                                ${isSimplifiable ? 'cursor-pointer border-b-2 border-dotted border-[#3182CE] hover:border-[#38A169] hover:bg-[#3182CE]/10 rounded px-1' : ''}
                                                ${isSimplified ? 'text-[#38A169] font-bold' : ''}
                                            `}
                                            title={isSimplifiable ? `Tap to simplify: "${currentWordObj.original}" → "${getSynonym(currentWordObj.original)}"` : ""}
                                        >
                                            {!isSimplified ? (
                                                <>
                                                    <b className="font-black text-black">{currentWordObj.bold}</b>
                                                    <span className="text-[#2D3748]">{currentWordObj.regular}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <b className="font-black text-[#38A169]">{currentWordObj.bold}</b>
                                                    <span className="text-[#38A169] font-bold">{currentWordObj.regular}</span>
                                                </>
                                            )}
                                        </span>
                                        {' '}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Floating Navigation Buttons */}
            <div className="fixed bottom-8 right-8 flex gap-4 z-50">
                <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className={`
                        p-4 rounded-full shadow-2xl transition-all duration-300
                        ${activeIndex === 0
                            ? 'bg-gray-300 cursor-not-allowed hidden'
                            : 'bg-[#FB923C] text-white hover:bg-[#F97316] hover:scale-110 active:scale-95'
                        }
                    `}
                    aria-label="Previous sentence"
                >
                    <ArrowLeft size={32} />
                </button>
                <button
                    onClick={handleNext}
                    disabled={activeIndex === sentences.length - 1}
                    className={`
                        p-4 rounded-full shadow-2xl transition-all duration-300
                        ${activeIndex === sentences.length - 1
                            ? 'bg-gray-300 cursor-not-allowed hidden'
                            : 'bg-[#3182CE] text-white hover:bg-[#2C5282] hover:scale-110 active:scale-95 animate-bounce-slight'
                        }
                    `}
                    aria-label="Next sentence"
                >
                    <ArrowRight size={32} />
                </button>
            </div>
        </div>
    );
};

export default BionicOverlay;

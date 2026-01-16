import React, { useState, useEffect } from 'react';
import { toBionic } from '../utils/bionic';
import { getSynonym } from '../utils/synonyms';

const BionicOverlay = ({ text }) => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        // Initial processing
        if (text) {
            setWords(toBionic(text));
        }
    }, [text]);

    const handleWordClick = (index, originalWord) => {
        const synonym = getSynonym(originalWord);
        if (synonym) {
            // Replace the word with the synonym
            // We need to 'bionic-fy' the new synonym
            const [processedSynonym] = toBionic(synonym); // toBionic returns array

            const newWords = [...words];
            newWords[index] = processedSynonym;
            setWords(newWords);
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-[#FFFFE0] p-6 text-black">
            <div
                className="text-lg leading-relaxed text-justify"
                style={{ fontFamily: 'OpenDyslexic, Verdana, sans-serif' }}
            >
                {words.map((wordObj, i) => (
                    <React.Fragment key={i}>
                        <span
                            onClick={() => handleWordClick(i, wordObj.original)}
                            className={`cursor-pointer hover:bg-yellow-200 rounded px-0.5 transition-colors ${getSynonym(wordObj.original) ? 'border-b-2 border-dotted border-gray-400' : ''}`}
                            title={getSynonym(wordObj.original) ? "Tap to simplify" : ""}
                        >
                            <b>{wordObj.bold}</b>{wordObj.regular}
                        </span>
                        {/* Add space between words */}
                        {' '}
                    </React.Fragment>
                ))}
            </div>
            <div className="h-20" /> {/* Bottom padding for FAB */}
        </div>
    );
};

export default BionicOverlay;

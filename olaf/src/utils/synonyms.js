export const synonyms = {
    "approximately": "about",
    "utilize": "use",
    "facilitate": "help",
    "construct": "build",
    "observe": "see",
    "demonstrate": "show",
    "objective": "goal",
    "initiate": "start",
    "subsequently": "later",
    "nevertheless": "however"
};

/**
 * Checks if a word has a simpler synonym.
 * @param {string} word 
 * @returns {string|null} The synonym if found, else null.
 */
export const getSynonym = (word) => {
    // Strip punctuation for lookup
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    return synonyms[cleanWord] || null;
}

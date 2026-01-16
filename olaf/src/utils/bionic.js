/**
 * Splits text into words and calculates the bionic conversion for each.
 * @param {string} text - The input text to process.
 * @returns {Array<{ original: string, bold: string, regular: string }>}
 */
export function toBionic(text) {
    if (!text) return [];

    // Split by whitespace but keep the whitespace attached or handle it?
    // Simple split by space for now as per requirements "Split text into words".
    // Handling punctuation might be tricky. Tesseract output preserves punctuation.

    return text.split(/\s+/).map(word => {
        if (!word) return null;

        // Logic: Bold first half.
        const len = word.length;
        let mid;
        if (len <= 3) mid = 1;
        else mid = Math.ceil(len / 2);

        const bold = word.slice(0, mid);
        const regular = word.slice(mid);

        return {
            original: word,
            bold,
            regular
        };
    }).filter(Boolean);
}

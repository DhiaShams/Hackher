// Word simplification dictionary for tap-to-simplify feature
export const wordSimplifications: Record<string, string> = {
    // Common complex words
    "approximately": "about",
    "immediately": "now",
    "magnificent": "great",
    "enormous": "huge",
    "difficult": "hard",
    "beautiful": "pretty",
    "delicious": "yummy",
    "exhausted": "tired",
    "frightened": "scared",
    "gigantic": "huge",
    "intelligent": "smart",
    "mysterious": "strange",
    "necessary": "needed",
    "observe": "watch",
    "purchase": "buy",
    "remarkable": "amazing",
    "terrible": "bad",
    "understand": "get",
    "wonderful": "great",
    "yesterday": "last day",

    // Story/book words
    "adventure": "trip",
    "creature": "animal",
    "discover": "find",
    "journey": "trip",
    "treasure": "prize",
    "village": "town",
    "forest": "woods",
    "mountain": "big hill",
    "ocean": "sea",
    "castle": "big house",
};

export function simplifyWord(word: string): string {
    const cleaned = word.toLowerCase().replace(/[.,!?;:]/g, '');
    return wordSimplifications[cleaned] || word;
}

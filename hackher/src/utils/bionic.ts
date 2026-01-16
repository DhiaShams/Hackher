export function toBionic(text: string): string {
    return text.split(' ').map(word => {
        const length = word.length;
        if (length <= 3) {
            return `<b>${word}</b>`;
        }
        const boldLength = Math.ceil(length / 2);
        const boldPart = word.slice(0, boldLength);
        const normalPart = word.slice(boldLength);
        return `<b>${boldPart}</b>${normalPart}`;
    }).join(' ');
}

// React component moved to src/components/shared/BionicWord.tsx

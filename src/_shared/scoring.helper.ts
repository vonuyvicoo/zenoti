export function calculateMatchScore(serviceName: string, searchWords: string[]): number {
    let score = 0;

    // Exact match of entire search phrase 
    const searchPhrase = searchWords.join(' ');
    if (serviceName === searchPhrase) {
        score += 1000;
    } else if (serviceName.includes(searchPhrase)) {
        score += 500;
    }

    // each word
    searchWords.forEach(word => {
        if (serviceName.startsWith(word)) {
            score += 100;
        }
        const wordBoundaryRegex = new RegExp(`\\b${word}\\b`);
        if (wordBoundaryRegex.test(serviceName)) {
            score += 50;
        }
        else if (serviceName.includes(word)) {
            score += 10;
        }
    });

    // shorter names are more relevant
    score -= serviceName.length * 0.1;

    return score;
} 


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringSimilarity = stringSimilarity;
/**
 * Utility: compute similarity between two strings using Levenshtein distance
 * Returns a value between 0 (completely different) and 1 (identical)
 */
function stringSimilarity(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1)
        .fill(0)
        .map((_, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] =
                    1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
            }
        }
    }
    const maxLen = Math.max(a.length, b.length);
    const distance = matrix[a.length][b.length];
    return 1 - distance / maxLen;
}
//# sourceMappingURL=string.similarity.utils.js.map
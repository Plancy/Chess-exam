export function getRookMoves(square, color, board, files, addMove) {
    const moves = [];
    const file = square[0];
    const fileIndex = files.indexOf(file);
    const rank = parseInt(square[1]);

    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (let [df, dr] of directions) {
        for (let i = 1; i < 8; i++) {
            const targetFile = df !== 0 ? files[fileIndex + df * i] : file;
            const targetRank = rank + dr * i;
            if (df !== 0 && !targetFile) break;
            if (!addMove(targetFile, targetRank, moves, color, board)) break;
        }
    }

    return moves;
}
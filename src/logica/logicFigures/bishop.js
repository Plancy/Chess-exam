export function getBishopMoves(square, color, board, files, addMove) {
    const moves = [];
    const fileIndex = files.indexOf(square[0]);
    const rank = parseInt(square[1]);

    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (let [df, dr] of directions) {
        for (let i = 1; i < 8; i++) {
            const targetFile = files[fileIndex + df * i];
            if (!targetFile) break;
            if (!addMove(targetFile, rank + dr * i, moves, color, board)) break;
        }
    }

    return moves;
}

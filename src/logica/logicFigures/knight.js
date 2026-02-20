export function getKnightMoves(square, color, board, files, addMove) {
    const moves = [];
    const fileIndex = files.indexOf(square[0]);
    const rank = parseInt(square[1]);

    const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    for (let [df, dr] of knightMoves) {
        const targetFile = files[fileIndex + df];
        if (targetFile) addMove(targetFile, rank + dr, moves, color, board);
    }

    return moves;
}

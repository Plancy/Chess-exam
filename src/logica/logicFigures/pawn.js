export function getPawnMoves(square, color, board, files) {
    const moves = [];
    const file = square[0];
    const rank = parseInt(square[1]);
    const fileIndex = files.indexOf(file);
    const direction = color === "w" ? 1 : -1;
    const nextRank = rank + direction;
    const nextSquare = file + nextRank;

    // на 1
    if (!board[nextSquare]) moves.push(nextSquare);

    // старт на 2
    if ((color === "w" && rank === 2) || (color === "b" && rank === 7)) {
        const skipSquare = file + (rank + 2 * direction);
        if (!board[nextSquare] && !board[skipSquare]) moves.push(skipSquare);
    }

    // дiагоналi
    for (let df of [-1, 1]) {
        const captureFile = files[fileIndex + df];
        if (!captureFile) continue;
        const captureSquare = captureFile + nextRank;
        if (board[captureSquare] && board[captureSquare][0] !== color)
            moves.push(captureSquare);
    }

    return moves;
}

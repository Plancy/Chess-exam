export function getKingMoves(square, color, board, addMove, moveHistory = []) {
    const moves = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const fileIndex = files.indexOf(square[0]);
    const rank = parseInt(square[1]);

    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (let [df, dr] of directions) {
        const targetFile = files[fileIndex + df];
        if (targetFile) addMove(targetFile, rank + dr, moves, color, board);
    }
    const kingInitial = color === 'w' ? 'e1' : 'e8';
    if (square === kingInitial && !hasKingMoved(color, moveHistory)) {
        const rookShort = color === 'w' ? 'h1' : 'h8';
        if (
            board[rookShort] === color + 'R' &&
            !hasRookMoved(color, rookShort, moveHistory) &&
            !board[files[5] + rank] &&
            !board[files[6] + rank] &&
            !isSquareAttacked(files[4] + rank, color, board) &&
            !isSquareAttacked(files[5] + rank, color, board) &&
            !isSquareAttacked(files[6] + rank, color, board)
        ) {
            moves.push(files[6] + rank);
        }
        const rookLong = color === 'w' ? 'a1' : 'a8';
        if (
            board[rookLong] === color + 'R' &&
            !hasRookMoved(color, rookLong, moveHistory) &&
            !board[files[1] + rank] &&
            !board[files[2] + rank] &&
            !board[files[3] + rank] &&
            !isSquareAttacked(files[4] + rank, color, board) &&
            !isSquareAttacked(files[3] + rank, color, board) &&
            !isSquareAttacked(files[2] + rank, color, board)
        ) {
            moves.push(files[2] + rank);
        }
    }

    return moves;
}

function hasKingMoved(color, moveHistory) {
    const kingFrom = color === 'w' ? 'e1' : 'e8';
    return moveHistory.some(m => m.from === kingFrom && m.piece === color + 'K');
}
function hasRookMoved(color, rookSquare, moveHistory) {
    return moveHistory.some(m => m.from === rookSquare && m.piece === color + 'R');
}
function isSquareAttacked(square, color, board) {
    const opponent = color === 'w' ? 'b' : 'w';
    for (let sq in board) {
        if (board[sq] && board[sq][0] === opponent) {.1}
    }
    return false;
}

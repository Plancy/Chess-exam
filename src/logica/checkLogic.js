import {
    getPawnMoves, getKnightMoves, getBishopMoves, getRookMoves, getQueenMoves, getKingMoves
}
    from './logicFigures';

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function findKing(board, color) {
    for (let square in board) {
        if (board[square] === color + "K") {
            return square;
        }
    }
    return null;
}

function getPossibleMovesForPiece(square, piece, board) {
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];

    const addMove = (targetFile, targetRank, moves, color, board) => {
        if (targetRank < 1 || targetRank > 8) return false;
        const targetFileIndex = files.indexOf(targetFile);
        if (targetFileIndex === -1) return false;

        const targetSquare = targetFile + targetRank;
        const targetPiece = board[targetSquare];

        if (!targetPiece) {
            moves.push(targetSquare);
            return true;
        } else if (targetPiece[0] !== color) {
            moves.push(targetSquare);
            return false;
        }
        return false;
    };

    switch (type) {
        case "P":
            return getPawnMoves(square, color, board, files);
        case "N":
            return getKnightMoves(square, color, board, files, addMove);
        case "B":
            return getBishopMoves(square, color, board, files, addMove);
        case "R":
            return getRookMoves(square, color, board, files, addMove);
        case "Q":
            return getQueenMoves(square, color, board, files, addMove);
        case "K":
            return getKingMoves(square, color, board, addMove);
        default:
            return [];
    }
}

export function isKingInCheck(board, color) {
    const kingSquare = findKing(board, color);
    if (!kingSquare) return false;

    const opponentColor = color === "w" ? "b" : "w";

    for (let square in board) {
        const piece = board[square];
        if (piece && piece[0] === opponentColor) {
            const moves = getPossibleMovesForPiece(square, piece, board);
            if (moves.includes(kingSquare)) {
                return true;
            }
        }
    }

    return false;
}

export function isMoveLegal(board, fromSquare, toSquare, color) {
    const tempBoard = { ...board };
    tempBoard[toSquare] = tempBoard[fromSquare];
    delete tempBoard[fromSquare];

    // король на шаг
    return !isKingInCheck(tempBoard, color);
}

export function getLegalMoves(board, square, piece) {
    if (!piece) return [];
    const color = piece[0];
    const possibleMoves = getPossibleMovesForPiece(square, piece, board);

    // фiльтр на доступ. ход
    return possibleMoves.filter(move => isMoveLegal(board, square, move, color));
}

// тест на тихий
export function hasLegalMoves(board, color) {
    for (let square in board) {
        const piece = board[square];
        if (piece && piece[0] === color) {
            const legalMoves = getLegalMoves(board, square, piece);
            if (legalMoves.length > 0) {
                return true;
            }
        }
    }
    return false;
}

// чек на мат
export function isCheckmate(board, color) {
    return isKingInCheck(board, color) && !hasLegalMoves(board, color);
}

// чек на пат
export function isStalemate(board, color) {
    return !isKingInCheck(board, color) && !hasLegalMoves(board, color);
}

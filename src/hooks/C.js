import { getRandomBotMove } from '../components/ChessBot';
import { pieceUnicode } from '../components/cu';

export function getSquareFromEvent(e) {
    const td = e.target.closest('td');
    if (!td) return null;
    return td.getAttribute('data-coord');
}

export function buildMove(board, from, to, turn) {
    const newBoard = { ...board };
    const movingPiece = board[from];
    const captured = board[to];
    if (!movingPiece) return null;

    const movingType = movingPiece[1];
    const targetRank = parseInt(to[1]);
    const color = movingPiece[0];

    let castlingMove = false;
    if (movingType === 'K' && (from === 'e1' || from === 'e8')) {
        if ((to === 'g1' && from === 'e1') || (to === 'g8' && from === 'e8')) {
            newBoard[to] = movingPiece;
            delete newBoard[from];
            const rookFrom = from === 'e1' ? 'h1' : 'h8';
            const rookTo = from === 'e1' ? 'f1' : 'f8';
            newBoard[rookTo] = board[rookFrom];
            delete newBoard[rookFrom];
            castlingMove = true;
        }
        if ((to === 'c1' && from === 'e1') || (to === 'c8' && from === 'e8')) {
            newBoard[to] = movingPiece;
            delete newBoard[from];
            const rookFrom = from === 'e1' ? 'a1' : 'a8';
            const rookTo = from === 'e1' ? 'd1' : 'd8';
            newBoard[rookTo] = board[rookFrom];
            delete newBoard[rookFrom];
            castlingMove = true;
        }
    }

    let isPromotion = false;
    if (movingType === 'P' && ((color === 'w' && targetRank === 8) || (color === 'b' && targetRank === 1))) {
        isPromotion = true;
    }

    let moveNotation = '';
    if (castlingMove) {
        moveNotation = `${turn === 'w' ? 'Білий' : 'Чорний'}: рокірування ${from === 'e1' || from === 'e8' ? (to[0] === 'g' ? 'коротка' : 'довга') : ''}`;
    } else if (isPromotion) {
        moveNotation = '';
    } else {
        newBoard[to] = newBoard[from];
        delete newBoard[from];
        moveNotation = `${turn === 'w' ? 'Білий' : 'Чорний'}: ${from} → ${to}${captured ? ` (б'є ${pieceUnicode[captured]})` : ''}`;
    }

    return { newBoard, moveNotation, isPromotion, castlingMove, captured, movingPiece };
}

export function applyRandomBotMove(board, color = 'b') {
    const randomMove = getRandomBotMove(board, color);
    if (!randomMove) return null;
    const { from, to } = randomMove;
    const movingPiece = board[from];
    if (!movingPiece) return null;

    const newBoard = { ...board };
    const captured = board[to];
    if (movingPiece[1] === 'P') {
        const targetRank = parseInt(to[1]);
        if ((color === 'b' && targetRank === 1) || (color === 'w' && targetRank === 8)) {
            newBoard[to] = movingPiece[0] + 'Q';
            delete newBoard[from];
            const moveNotation = `${color === 'w' ? 'Білий' : 'Чорний'}: ${from} → ${to} (underpromotion в ферзя)`;
            return { newBoard, moveNotation };
        }
    }

    newBoard[to] = newBoard[from];
    delete newBoard[from];
    const moveNotation = `${color === 'w' ? 'Білий' : 'Чорний'}: ${from} → ${to}${captured ? ` (б'є ${pieceUnicode[captured]})` : ''}`;
    return { newBoard, moveNotation };
}

export function finalizePromotionOnBoard(board, from, to, color, type) {
    const newBoard = { ...board };
    newBoard[to] = color + type;
    delete newBoard[from];
    const piecePromoted = pieceUnicode[color + type];
    const moveNotation = `${color === 'w' ? 'Білий' : 'Чорний'}: ${from} → ${to} (underpromotion в ${piecePromoted})`;
    return { newBoard, moveNotation };
}

import { getLegalMoves, isKingInCheck } from '../logica/checkLogic';
import '../css/ChessBot.css';

const val = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
const promoRanks = [1, 8];
const promoBonus = 8;
const checkBonus = 5;
const capMult = 10;
const attPenalty = 2;
const center = ['d4', 'e4', 'd5', 'e5'];
const centerBonus = 0.5;
const rand = 0.2;
const topThresh = 0.5;
export function getAllLegalMovesForColor(board, color) {
    const moves = [];
    for (let square in board) {
        const piece = board[square];
        if (piece && piece[0] === color) {
            const legalMoves = getLegalMoves(board, square, piece);
            for (let move of legalMoves) {
                moves.push({ from: square, to: move, piece });
            }
        }
    }
    return moves;
}

function applyMove(board, move) {
    const next = { ...board };
    const moving = next[move.from];
    const targetRank = parseInt(move.to[1]);
    if (moving && moving[1] === 'P' && promoRanks.includes(targetRank)) {
        next[move.to] = moving[0] + 'Q';
        delete next[move.from];
        return next;
    }
    next[move.to] = moving;
    delete next[move.from];
    return next;
}
function isSquareAttacked(board, square, byColor) {
    for (let from in board) {
        const piece = board[from];
        if (piece && piece[0] === byColor) {
            const moves = getLegalMoves(board, from, piece);
            if (moves.includes(square)) return true;
        }
    }
    return false;
}

function evaluateMove(board, move, color) {
    const opponent = color === 'w' ? 'b' : 'w';
    const targetPiece = board[move.to];
    const movingType = move.piece[1];
    const next = applyMove(board, move);
    let score = 0;
    if (targetPiece) {
        score += val[targetPiece[1]] * capMult;
    }
    const targetRank = parseInt(move.to[1]);
    if (movingType === 'P' && promoRanks.includes(targetRank)) {
        score += promoBonus;
    }
    if (isKingInCheck(next, opponent)) {
        score += checkBonus;
    }
    if (isSquareAttacked(next, move.to, opponent)) {
        score -= val[movingType] * attPenalty;
    }
    if (center.includes(move.to)) {
        score += centerBonus;
    }
    return score;
}

export function getRandomBotMove(board, color) {
    const moves = getAllLegalMovesForColor(board, color);
    if (moves.length === 0) return null;

    const scored = moves.map(move => ({
        move,
        score: evaluateMove(board, move, color) + Math.random() * rand
    }));

    const bestScore = Math.max(...scored.map(m => m.score));
    const topMoves = scored
        .filter(m => m.score >= bestScore - topThresh)
        .map(m => m.move);
    return topMoves[Math.floor(Math.random() * topMoves.length)];
}
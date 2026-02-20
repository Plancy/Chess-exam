import { getBishopMoves } from './bishop';
import { getRookMoves } from './rook';

export function getQueenMoves(square, color, board, files, addMove) {
    const bishopMoves = getBishopMoves(square, color, board, files, addMove);
    const rookMoves = getRookMoves(square, color, board, files, addMove);
    return [...bishopMoves, ...rookMoves];
}

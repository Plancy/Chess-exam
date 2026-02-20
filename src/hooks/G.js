import { useMemo } from "react";
import { isKingInCheck, isCheckmate, isStalemate } from '../logica/checkLogic';

export default function useGameStatus(board, turn, forcedWin) {
    return useMemo(() => {
        if (forcedWin === 'w') return 'forced-win-w';
        if (forcedWin === 'b') return 'forced-win-b';
        if (isCheckmate(board, turn)) {
            return "checkmate";
        } else if (isStalemate(board, turn)) {
            return "stalemate";
        } else if (isKingInCheck(board, turn)) {
            return "check";
        }
        return null;
    }, [board, turn, forcedWin]);
}

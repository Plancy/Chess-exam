import { useState, useEffect, useCallback, useRef } from "react";
import { getLegalMoves, findKing } from '../logica/checkLogic';
import { getInitialBoard, pieceUnicode } from '../components/cu';
import { buildMove, applyRandomBotMove, finalizePromotionOnBoard } from './C';
import useArrows from "./A";
import useHistory from "./H";
import useGameStatus from "./G";

export default function useUCG() {
    // стан юая
    const {
        arrows, setArrows, arrowStart, setArrowStart,
        handleBoardMouseDown, handleBoardMouseUp, handleBoardContextMenu
    } = useArrows();

    // стан гри
    const [board, setBoard] = useState(getInitialBoard());
    const [selected, setSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [turn, setTurn] = useState("w");
    const [forcedWin, setForcedWin] = useState(null);
    const [timeLoser, setTimeLoser] = useState(null);
    const [promotionPending, setPromotionPending] = useState(null);
    const [resetKey, setResetKey] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // стан бота / таймкер
    const [playWithBot, setPlayWithBot] = useState(false);
    const [whiteStart, setWhiteStart] = useState(300);
    const [blackStart, setBlackStart] = useState(300);
    const botTimerRef = useRef(null);
    const liveRef = useRef({ turn: "w", gameOver: false });

    // шсторiя
    const { history, setHistory, addHistory, resetHistory } = useHistory();

    // статус
    const gameStatus = useGameStatus(board, turn, forcedWin);
    const isCheck = gameStatus === "check";

    // ефекти
    useEffect(() => {
        const ended = forcedWin || timeLoser || ["checkmate", "stalemate", "forced-win-w", "forced-win-b"].includes(gameStatus);
        liveRef.current = { turn, gameOver: ended };
    }, [turn, forcedWin, timeLoser, gameStatus]);

    useEffect(() => {
        return () => {
            if (botTimerRef.current) clearTimeout(botTimerRef.current);
        };
    }, []);

    // обробка клiка по клiткi
    const handleSquareClick = (square) => {
        if (["checkmate", "stalemate", 'forced-win-w', 'forced-win-b'].includes(gameStatus)) return;
        if (promotionPending) return;
        const piece = board[square];

        if (selected && possibleMoves.includes(square)) {
            const moveResult = buildMove(board, selected, square, turn);
            if (!moveResult) return;

            if (moveResult.isPromotion) {
                setPromotionPending({ from: selected, to: square, color: moveResult.movingPiece[0], captured: piece });
            } else {
                addHistory(moveResult.moveNotation);
                setBoard(moveResult.newBoard);
                setSelected(null);
                setPossibleMoves([]);
                if (!gameStarted && turn === "w") setGameStarted(true);
                setTurn(turn === "w" ? "b" : "w");
            }
            return;
        }

        if (piece && piece[0] === turn) {
            setSelected(square);
            setPossibleMoves(getLegalMoves(board, square, piece));
        } else {
            setSelected(null);
            setPossibleMoves([]);
        }
    };

    // шаг бота
    const botMove = useCallback(() => {
        const botResult = applyRandomBotMove(board, 'b');
        if (!botResult) return;
        const { newBoard, moveNotation } = botResult;
        const thinkingMs = 700 + Math.floor(Math.random() * 900);
        if (botTimerRef.current) clearTimeout(botTimerRef.current);
        botTimerRef.current = setTimeout(() => {
            const live = liveRef.current;
            if (live.gameOver || live.turn !== 'b') return;
            addHistory(moveNotation);
            setBoard(newBoard);
            setTurn('w');
        }, thinkingMs);
    }, [board, addHistory]);

    // енд промо 
    const finalizePromotion = (type) => {
        if (!promotionPending) return;
        const { from, to, color } = promotionPending;
        const { newBoard, moveNotation } = finalizePromotionOnBoard(board, from, to, color, type);

        addHistory(moveNotation);
        setBoard(newBoard);
        setPromotionPending(null);
        setSelected(null);
        setPossibleMoves([]);
        if (!gameStarted && color === "w") setGameStarted(true);
        setTurn(color === 'w' ? 'b' : 'w');
    };

    useEffect(() => {
        if (
            playWithBot &&
            turn === "b" &&
            !["checkmate", "stalemate", "forced-win-w", "forced-win-b"].includes(gameStatus)
        ) {
            botMove();
        }
    }, [turn, playWithBot, gameStatus, botMove]);

    // нова гра
    const handleNewGame = () => {
        if (botTimerRef.current) clearTimeout(botTimerRef.current);
        setBoard(getInitialBoard());
        setSelected(null);
        setPossibleMoves([]);
        setTurn("w");
        resetHistory();
        setForcedWin(null);
        setTimeLoser(null);
        setGameStarted(false);
        setResetKey((prev) => prev + 1);
    };

    // вкл/выкл бота
    const handleToggleBot = () => {
        if (botTimerRef.current) clearTimeout(botTimerRef.current);
        setPlayWithBot((prev) => !prev);
    };

    // видати перемогу 
    const handleForceWin = (color) => {
        setForcedWin(color);
        addHistory(color === 'w' ? 'Адмін: Перемога білих' : 'Адмін: Перемога чорних');
    };

    // редактура часу
    const handleSetTime = ({ whiteMinutes, blackMinutes }) => {
        const nextWhite = Math.max(1, Math.floor(Number(whiteMinutes) || 0)) * 60;
        const nextBlack = Math.max(1, Math.floor(Number(blackMinutes) || 0)) * 60;
        setWhiteStart(nextWhite);
        setBlackStart(nextBlack);
        setTimeLoser(null);
        setForcedWin(null);
        setResetKey((prev) => prev + 1);
        addHistory(`Адмін: час ${whiteMinutes} хв (білі) / ${blackMinutes} хв (чорні)`);
    };

    //  час енд
    const handleFlag = (side) => {
        if (forcedWin) return;
        const winner = side === 'w' ? 'b' : 'w';
        setTimeLoser(side);
        setForcedWin(winner);
        addHistory(`Час вийшов: ${side === 'w' ? 'Білі' : 'Чорні'} програли`);
    };

    //  про статус
    const getGameStatusMessage = () => {
        if (timeLoser) {
            return `Час вийшов! ${timeLoser === 'w' ? 'Білі' : 'Чорні'} програли.`;
        } else if (gameStatus === "forced-win-w") {
            return "Перемога білих (адмін)";
        } else if (gameStatus === "forced-win-b") {
            return "Перемога чорних (адмін)";
        } else if (gameStatus === "checkmate") {
            return `Мат! ${turn === "w" ? "Чорні" : "Білі"} перемогли!`;
        } else if (gameStatus === "stalemate") {
            return "Пат! Нічия!";
        } else if (gameStatus === "check") {
            return `Шах королю ${turn === "w" ? "білих" : "чорних"}!`;
        }
        return `Шаг: ${turn === "w" ? "Білі" : "Чорні"}`;
    };


    // класс статуст короля
    const kingSquare = findKing(board, turn);
    const statusClass = gameStatus === "checkmate" || gameStatus === 'forced-win-w' || gameStatus === 'forced-win-b'
        ? 'status-danger'
        : gameStatus === "check"
            ? 'status-warning'
            : 'status-normal';


    return {
        // юай
        arrows, setArrows, arrowStart, setArrowStart,

        board, setBoard, selected, setSelected, possibleMoves, setPossibleMoves, turn, setTurn,
        forcedWin, setForcedWin, timeLoser, setTimeLoser, promotionPending, setPromotionPending, resetKey, setResetKey, gameStarted, setGameStarted,
        // Бот / таймер
        playWithBot, setPlayWithBot, whiteStart, setWhiteStart, blackStart, setBlackStart,
        // iсторiя
        history, setHistory, addHistory, resetHistory,
        handleBoardMouseDown, handleBoardMouseUp, handleBoardContextMenu,
        handleSquareClick, botMove, finalizePromotion, handleNewGame, handleToggleBot, handleForceWin, handleSetTime, handleFlag,
        gameStatus, isCheck, getGameStatusMessage, kingSquare, statusClass, pieceUnicode
    };
}

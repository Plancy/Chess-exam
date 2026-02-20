import React from "react";
import Controls from "./Controls";
import TurnTimer from "./TurnTimer";
import PromotionPicker from './PromotionPicker';
import BoardGrid from './BoardGrid';
import { files } from './cu';
import { ArrowSVG } from './row/row';
import './row/row.css';
import Footer from "./footer/footer";
import "../css/Chessboard.css";
import "../css/adaptive.css";
import useUCG from '../hooks/ucg';

const size = 8;
const botOn = "Бот активний";
const botOff = "Бот неактивний";
const blocked = ["checkmate", "stalemate", "forced-win-w", "forced-win-b"];
const viewBox = `0 0 ${size} ${size}`;

export default function Chessboard() {
    const game = useUCG();
    return (
        <div className="board-layout">
            <div style={{ position: 'relative', width: 'fit-content' }}
                onMouseDown={game.handleBoardMouseDown}
                onMouseUp={game.handleBoardMouseUp}
                onContextMenu={game.handleBoardContextMenu}
            >
                <button onClick={game.handleToggleBot} className="bot">
                    {game.playWithBot ? botOn : botOff}
                </button>
                <BoardGrid
                    board={game.board}
                    selected={game.selected}
                    possibleMoves={game.possibleMoves}
                    handleSquareClick={game.handleSquareClick}
                    pieceUnicode={game.pieceUnicode}
                    turn={game.turn}
                    isCheck={game.isCheck}
                    kingSquare={game.kingSquare}
                />
                <svg
                    className="arrow-overlay"
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 10 }}
                    width="100%" height="100%" viewBox={viewBox}
                >
                    {game.arrows.map((arrow, i) => {
                        const fileIdxFrom = files.indexOf(arrow.from[0]);
                        const rankIdxFrom = size - parseInt(arrow.from[1]);
                        const fileIdxTo = files.indexOf(arrow.to[0]);
                        const rankIdxTo = size - parseInt(arrow.to[1]);
                        if (fileIdxFrom === -1 || fileIdxTo === -1 || rankIdxFrom < 0 || rankIdxTo < 0) return null;
                        return (
                            <ArrowSVG
                                key={i}
                                x1={fileIdxFrom + 0.5}
                                y1={rankIdxFrom + 0.5}
                                x2={fileIdxTo + 0.5}
                                y2={rankIdxTo + 0.5}
                            />
                        );
                    })}
                </svg>
            </div>
            <div className="sidebar">
                <TurnTimer
                    activeSide={game.turn}
                    running={game.gameStarted && !game.promotionPending && !blocked.includes(game.gameStatus)}
                    onFlag={game.handleFlag}
                    resetKey={game.resetKey}
                    startingWhiteSeconds={game.whiteStart}
                    startingBlackSeconds={game.blackStart}
                />
                <div className="status">
                    <b className={`status-message ${game.statusClass}`}>{game.getGameStatusMessage()}</b>
                </div>
                <Controls onNewGame={game.handleNewGame} history={game.history} onForceWin={game.handleForceWin} onSetTime={game.handleSetTime} />
                <Footer />
            </div>
            {game.promotionPending && (
                <PromotionPicker color={game.promotionPending.color} onPromote={game.finalizePromotion} />
            )}
        </div>
    );
}

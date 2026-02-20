import React from "react";
import { files, ranks } from './cu';

export default function BoardGrid({ board, selected, possibleMoves, handleSquareClick, pieceUnicode, isCheck, kingSquare }) {
    return (
        <table className="chessboard">
            <tbody>
                {ranks.map(rank => (
                    <tr key={rank}>
                        {files.map(file => {
                            const square = file + rank;
                            const fileIndex = files.indexOf(file);
                            const rankIndex = rank - 1;
                            const isLight = (fileIndex + rankIndex) % 2 !== 0;
                            const isSelected = selected === square;
                            const isPossible = possibleMoves.includes(square);
                            const isKingInCheckSquare = isCheck && square === kingSquare;

                            let classNames = isLight ? "light-square" : "dark-square";
                            if (isSelected) classNames += " selected";
                            if (isPossible) classNames += " possible-move";
                            if (isKingInCheckSquare) classNames += " king-in-check";

                            return (
                                <td
                                    key={square}
                                    className={classNames}
                                    data-coord={square}
                                    onClick={() => handleSquareClick(square)}
                                >
                                    <span className="piece">
                                        {board[square] ? pieceUnicode[board[square]] : ""}
                                    </span>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

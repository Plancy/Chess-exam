import React from 'react';
import '../css/PromotionPicker.css';

const pieceUnicode = {
    wQ: "♕", wR: "♖", wB: "♗", wN: "♘",
    bQ: "♛", bR: "♜", bB: "♝", bN: "♞"
};

export default function PromotionPicker({ color = 'w', onPromote }) {
    const key = color === 'w' ? 'w' : 'b';

    return (
        <div className="promotion-overlay">
            <div className="promotion-picker">
                <div className="promotion-title">фігура для underpromotion?</div>
                <div className="promotion-buttons">
                    <button className="promotion-button" onClick={() => onPromote('Q')}>{pieceUnicode[key + 'Q']}</button>
                    <button className="promotion-button" onClick={() => onPromote('R')}>{pieceUnicode[key + 'R']}</button>
                    <button className="promotion-button" onClick={() => onPromote('B')}>{pieceUnicode[key + 'B']}</button>
                    <button className="promotion-button" onClick={() => onPromote('N')}>{pieceUnicode[key + 'N']}</button>
                </div>
            </div>
        </div>
    );
}

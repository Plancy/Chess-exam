import React from "react";
import "../css/Controls.css";
import AdminPanel from "./admin/AdminPanel";

export default function Controls({ onNewGame, history, onForceWin, onSetTime }) {
  return (
    <div className="controlsWrap">
      <button className="newGameBtn" onClick={onNewGame}>Нова партія</button>
      <AdminPanel onForceWin={onForceWin} onSetTime={onSetTime} />
      <div className="historyBlock">
        <span className="historyTitle">Історія ходів:</span>
        <ol className="historyList">
          {history.length === 0 && <li></li>}
          {history.map((move, idx) => (
            <li key={idx}>{move}</li>
          ))}
        </ol>
      </div>
      <div className="">
        <p></p>
      </div>
    </div>
  );
}

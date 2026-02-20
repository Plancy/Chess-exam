import { useState } from "react";
import "./admnim.css";

export default function AdminPanel({ onForceWin, onSetTime }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [whiteMinutes, setWhiteMinutes] = useState(5);
  const [blackMinutes, setBlackMinutes] = useState(5);

  const applyTime = () => {
    if (!onSetTime) return;
    const whiteClean = Math.max(1, Math.floor(Number(whiteMinutes) || 0));
    const blackClean = Math.max(1, Math.floor(Number(blackMinutes) || 0));
    setWhiteMinutes(whiteClean);
    setBlackMinutes(blackClean);
    onSetTime({ whiteMinutes: whiteClean, blackMinutes: blackClean });
  };

  return (
    <div>
      {!isAdmin && (
        <button className="adminBtn" onClick={() => setIsAdmin(true)}>
          Стати адміном
        </button>
      )}
      {isAdmin && (
        <div className="adminPanel">
          <button className="adminBtn" onClick={() => onForceWin('w')}>
            Перемога білих
          </button>
          <button className="adminBtn" onClick={() => onForceWin('b')}>
            Перемога чорних
          </button>
          <div className="adminTimer">
            <span className="adminTimerTitle">Контроль часу</span>
            <div className="adminTimerRow">
              <label className="adminTimerLabel" htmlFor="white-time">
                Білі (хв)
              </label>
              <input
                id="white-time"
                className="adminTimerInput"
                type="number"
                min={1}
                step={1}
                value={whiteMinutes}
                onChange={(e) => setWhiteMinutes(e.target.value)}
              />
            </div>
            <div className="adminTimerRow">
              <label className="adminTimerLabel" htmlFor="black-time">
                Чорні (хв)
              </label>
              <input
                id="black-time"
                className="adminTimerInput"
                type="number"
                min={1}
                step={1}
                value={blackMinutes}
                onChange={(e) => setBlackMinutes(e.target.value)}
              />
            </div>
            <button className="adminBtn adminTimerBtn" onClick={applyTime}>
              оедактор часу
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

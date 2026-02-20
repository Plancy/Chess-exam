import React, { useEffect, useMemo, useReducer } from "react";
import "../css/TurnTimer.css";

function formatClock(totalSeconds) {
    const safe = Math.max(0, totalSeconds);
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function TurnTimer({
    activeSide, running, onFlag, resetKey, startingWhiteSeconds = 300, startingBlackSeconds = 300, }) {
    const initialState = {
        whiteLeft: Number(startingWhiteSeconds) || 0,
        blackLeft: Number(startingBlackSeconds) || 0,
        flaggedSide: null,
    };

    function reducer(state, action) {
        switch (action.type) {
            case "reset":
                return {
                    whiteLeft: Number(action.white) || 0,
                    blackLeft: Number(action.black) || 0,
                    flaggedSide: null,
                };
            case "tick_white":
                if (state.whiteLeft <= 1) {
                    return { ...state, whiteLeft: 0, flaggedSide: "w" };
                }
                return { ...state, whiteLeft: state.whiteLeft - 1 };
            case "tick_black":
                if (state.blackLeft <= 1) {
                    return { ...state, blackLeft: 0, flaggedSide: "b" };
                }
                return { ...state, blackLeft: state.blackLeft - 1 };
            case "set_flagged":
                return { ...state, flaggedSide: action.side };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    const { whiteLeft, blackLeft, flaggedSide } = state;

    useEffect(() => {
        dispatch({
            type: "reset",
            white: startingWhiteSeconds,
            black: startingBlackSeconds,
        });
    }, [resetKey, startingWhiteSeconds, startingBlackSeconds]);

    useEffect(() => {
        if (!running || flaggedSide) return;
        const tick = setInterval(() => {
            if (activeSide === "w") {
                dispatch({ type: "tick_white" });
            } else {
                dispatch({ type: "tick_black" });
            }
        }, 1000);
        return () => clearInterval(tick);
    }, [activeSide, running, flaggedSide]);

    useEffect(() => {
        if (!flaggedSide) return;
        onFlag(flaggedSide);
    }, [flaggedSide, onFlag]);

    const whiteClass = useMemo(() => {
        return `clock-box ${activeSide === "w" && running ? "clock-live" : ""}`.trim();
    }, [activeSide, running]);

    const blackClass = useMemo(() => {
        return `clock-box ${activeSide === "b" && running ? "clock-live" : ""}`.trim();
    }, [activeSide, running]);

    return (
        <div className="clock-panel">
            <div className={whiteClass}>
                <span className="clock-label">Білі</span>
                <span className="clock-time">{formatClock(whiteLeft)}</span>
            </div>
            <div className={blackClass}>
                <span className="clock-label">Чорні</span>
                <span className="clock-time">{formatClock(blackLeft)}</span>
            </div>
        </div>
    );
}

import { useState } from "react";
import { getSquareFromEvent } from "./C";

export default function useArrows() {
    const [arrows, setArrows] = useState([]);
    const [arrowStart, setArrowStart] = useState(null);

    const handleBoardMouseDown = (e) => {
        const square = getSquareFromEvent(e);
        if (square) {
            if (e.button === 0) {
                setArrows([]);
            } else if (e.button === 2) {
                setArrowStart(square);
            }
        }
    };

    const handleBoardMouseUp = (e) => {
        if (e.button !== 2) return;
        const square = getSquareFromEvent(e);
        if (arrowStart && square && arrowStart !== square) {
            setArrows(prev => [...prev, { from: arrowStart, to: square }]);
        }
        setArrowStart(null);
    };

    const handleBoardContextMenu = (e) => {
        e.preventDefault();
    };

    return {
        arrows,
        setArrows,
        arrowStart,
        setArrowStart,
        handleBoardMouseDown,
        handleBoardMouseUp,
        handleBoardContextMenu
    };
}

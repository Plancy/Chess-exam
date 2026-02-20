export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

export function getInitialBoard() {
    const board = {};
    // чорні
    board["a8"] = "bR"; board["b8"] = "bN"; board["c8"] = "bB"; board["d8"] = "bQ";
    board["e8"] = "bK"; board["f8"] = "bB"; board["g8"] = "bN"; board["h8"] = "bR";
    for (let i = 0; i < 8; i++) board[files[i] + "7"] = "bP";
    // білі
    board["a1"] = "wR"; board["b1"] = "wN"; board["c1"] = "wB"; board["d1"] = "wQ";
    board["e1"] = "wK"; board["f1"] = "wB"; board["g1"] = "wN"; board["h1"] = "wR";
    for (let i = 0; i < 8; i++) board[files[i] + "2"] = "wP";
    return board;
}

export const pieceUnicode = {
    wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
    bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
};

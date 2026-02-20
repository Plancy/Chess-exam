import { useState } from "react";

export default function useHistory() {
    const [history, setHistory] = useState([]);

    const addHistory = (entry) => {
        setHistory(prev => [...prev, entry]);
    };

    const resetHistory = () => setHistory([]);

    return {
        history,
        setHistory,
        addHistory,
        resetHistory
    };
}

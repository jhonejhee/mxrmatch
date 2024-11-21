import React, { createContext, useState } from 'react';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const [dark, setDark] = useState(true)
    const [soundBoard, setSoundBoard] = useState([]);
    const [master, setMaster] = useState({
        "name": "master",
        "path": "",
        "global_volume": 80,
        "muted": true 
    });

    const value={
        dark, setDark,
        soundBoard, setSoundBoard,
        master, setMaster
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const [soundBoard, setSoundBoard] = useState([
        {
            "name": "Group1",
            "sounds": [
                { "name": "Applaud", "path": "", "volume": 80, "muted": true },
                { "name": "Applaud2", "path": "", "volume": 60, "muted": false }
            ]
        },
        {
            "name": "Group2",
            "sounds": [
                { "name": "Clap", "path": "", "volume": 50, "muted": true },
                { "name": "Clap2", "path": "", "volume": 100, "muted": false }
            ]
        }
    ]);

    const value={
        soundBoard, setSoundBoard
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
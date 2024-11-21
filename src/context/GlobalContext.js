import React, { createContext, useState } from 'react';

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const [dark, setDark] = useState(true)
    const [soundBoard, setSoundBoard] = useState([
        {
            "name": "Group1",
            "sounds": [
                { "name": "Applaud", "path": "", "volume": 80, "muted": true },
                // { "name": "Applaud2", "path": "", "volume": 65, "muted": false }
            ]
        },
        {
            "name": "Group2",
            "sounds": [
                // { "name": "Clap", "path": "", "volume": 55, "muted": true },
                // { "name": "Clap2", "path": "", "volume": 100, "muted": false }
            ]
        }
    ]);
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
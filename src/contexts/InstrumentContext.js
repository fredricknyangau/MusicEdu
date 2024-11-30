import React, { createContext, useContext, useState } from 'react';

const InstrumentContext = createContext();

export const InstrumentProvider = ({ children }) => {
    const [instruments, setInstruments] = useState([]);

    const addInstrument = (instrument) => {
        setInstruments((prev) => [...prev, instrument]);
    };

    return (
        <InstrumentContext.Provider value={{ instruments, addInstrument }}>
            {children}
        </InstrumentContext.Provider>
    );
};

export const useInstruments = () => useContext(InstrumentContext);

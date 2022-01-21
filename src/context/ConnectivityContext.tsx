import React, { createContext, useState, useContext } from 'react';

const defaultValue: boolean = false;

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<boolean> = [defaultValue, () => {}];

export const ConnectivityContext = createContext(defaultContextValue);

export const ConnectivityContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<boolean>(defaultValue);

    const ctxValue: ContextType<boolean> = [
        contextState,
        (value: boolean) => {
            setContextState(value);
        },
    ];
    return <ConnectivityContext.Provider value={ctxValue}>{children}</ConnectivityContext.Provider>;
};

export const useConnectivityContext = () => useContext(ConnectivityContext);

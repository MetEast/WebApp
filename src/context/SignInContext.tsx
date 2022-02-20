import React, { createContext, useState, useContext } from 'react';

interface State {
    signInDlgOpened: boolean;
    isLoggedIn: boolean;
    walletAccounts: string[];
    walletBalance: number;
    chainId: number;
}

const defaultState: State = {
    signInDlgOpened: false,
    isLoggedIn: false,
    walletAccounts: [],
    walletBalance: 0,
    chainId: 0
};

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<State> = [defaultState, () => {}];

export const SignInContext = createContext(defaultContextValue);

export const SignInContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<State>(defaultState);

    const ctxValue: ContextType<State> = [
        contextState,
        (value: State) => {
            setContextState(value);
        },
    ];

    return <SignInContext.Provider value={ctxValue}>{children}</SignInContext.Provider>;
};

export const useSignInContext = () => useContext(SignInContext);

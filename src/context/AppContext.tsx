import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

export type AppState = {
    createNFTDlgOpened: boolean;
};

export const DefaultAppState: AppState = {
    createNFTDlgOpened: false,
};

function noop() {
    return;
}

type LocalStorageReturnValue<TValue> = [TValue, (newValue: TValue) => void, () => void];

const defaultContextValue: LocalStorageReturnValue<AppState> = [DefaultAppState, noop, noop];

const AppContext = createContext(defaultContextValue);

export const AppContextProvider = ({ children }: React.PropsWithChildren<unknown>): JSX.Element => {
    const ctxValue = useLocalStorage('AppState', DefaultAppState);
    return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>;
};

export const useAppState = (): LocalStorageReturnValue<AppState> => useContext(AppContext);

import React, { createContext, useState, useContext } from 'react';

export interface SignInState {
    signInDlgOpened: boolean;
    downloadEssentialsDlgOpened: boolean;
    isLoggedIn: boolean;
    loginType: string;
    walletAccounts: string[];
    walletBalance: number;
    chainId: number;
    didUri: string;
    signOut: boolean;
    // user info
    token: string;
    address: string;
    userDid: string;
    userName: string;
    userDescription: string;
    userAvatar: string;
    userCoverImage: string;
    userRole: number;
    //
    meTokenBalance: number;
    isStakeHolder: boolean;
}

const defaultState: SignInState = {
    signInDlgOpened: false,
    downloadEssentialsDlgOpened: false,
    isLoggedIn: document.cookie
        .split('; ')
        .find((row) => row.startsWith('METEAST_LINK='))
        ?.split('=')[1]
        ? true
        : false,
    loginType:
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('METEAST_LINK='))
            ?.split('=')[1] || '',
    walletAccounts: [],
    walletBalance: 0,
    chainId: 0,
    didUri: '',
    signOut: false,
    // user info
    token:
        document.cookie
            .split('; ')
            .find((row) => row.startsWith('METEAST_TOKEN='))
            ?.split('=')[1] || '',
    address: '',
    userDid: '',
    userName: '',
    userDescription: '',
    userAvatar: '',
    userCoverImage: '',
    userRole: 2,
    //
    meTokenBalance: 0,
    isStakeHolder: false,
};

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<any> = [defaultState, () => {}];

export const SignInContext = createContext(defaultContextValue);

export const SignInContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<SignInState>(defaultState);

    const ctxValue: ContextType<SignInState> = [
        contextState,
        (value: SignInState) => {
            setContextState(value);
        },
    ];

    return <SignInContext.Provider value={ctxValue}>{children}</SignInContext.Provider>;
};

export const useSignInContext = () => useContext(SignInContext);

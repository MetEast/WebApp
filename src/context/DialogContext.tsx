import React, { useReducer, createContext, useMemo, useContext } from 'react';

export enum ActionType {
    SET_STATE = 'SET_STATE',
}

export type Actions = { type: ActionType.SET_STATE; value: State };

export interface State {
    createNFTDlgOpened: boolean;
}

const defaultState: State = {
    createNFTDlgOpened: false,
};

function noop() {
    return;
}

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<State> = [defaultState, noop];

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.SET_STATE:
            return action.value;
        default:
            return state;
    }
};

export const DialogContext = createContext(defaultContextValue);

export const DialogContextProvider: React.FC = ({ children, ...props }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const ctxValue: ContextType<State> = [
        state,
        (value: State) => {
            dispatch({ type: ActionType.SET_STATE, value });
        },
    ];

    return <DialogContext.Provider value={ctxValue}>{children}</DialogContext.Provider>;
};

export const useDialogContext = () => useContext(DialogContext);

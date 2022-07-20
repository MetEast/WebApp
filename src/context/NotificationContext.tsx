import React, { createContext, useState, useContext } from 'react';
import { TypeNotification } from 'src/types/notification-types';

export interface NotificationState {
    notesUnreadCnt: number;
    notesList: TypeNotification[];
}

const defaultState: NotificationState = {
    notesUnreadCnt: 0,
    notesList: [],
};

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<NotificationState> = [defaultState, () => {}];

export const NotificationContext = createContext(defaultContextValue);

export const NotificationContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<NotificationState>(defaultState);

    const ctxValue: ContextType<NotificationState> = [
        contextState,
        (value: NotificationState) => {
            setContextState(value);
        },
    ];

    return <NotificationContext.Provider value={ctxValue}>{children}</NotificationContext.Provider>;
};

export const useNotificationContext = () => useContext(NotificationContext);

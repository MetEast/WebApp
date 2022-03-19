export type TypeNotification = {
    id: string;
    title: string;
    content: string;
    date: string;
    isRead?: boolean;
};

export type TypeNotificationFetch = {
    _id: string;
    title: string;
    context: string;
    date: number;
    to: string;
    isRead: number;
};
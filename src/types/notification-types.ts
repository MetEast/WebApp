export type TypeNotification = {
    _id: string;
    title?: string;
    content?: string;
    type: number;
    params:NotificationParams;
    date: string;
    isRead?: boolean;
};

export type TypeNotificationFetch = {
    _id: string;
    title: string;
    context: string;
    date: number;
    to: string;
    read: number;
    type: number;
    params:NotificationParams;
};

export type TypeNotificationFSocket = {
    id?: string;
    title?: string;
    context?: string;
    type: string;
    to?: string;
};

export type NotificationParams = {
    tokenName: string;
    price?: number;
    buyer?: string;
    royaltyFee?: number;
}

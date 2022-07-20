export type AuthContextType = {
    isLoggedIn: boolean;
};

export type UserTokenType = {
    address: string;
    did: string;
    name: string;
    description: string;
    avatar: string;
    coverImage: string;
    role: string;
    exp: number;
    iat: number;
};

export type UserInfoType = {
    address: string;
    did: { did: string; description: string; name: string };
    remarks: string;
    role: number;
    _id: string;
};

export enum enumAuthType {
    NotConnected = '',
    ElastosEssentials = '1',
    MetaMask = '2',
    WalletConnect = '3',
}

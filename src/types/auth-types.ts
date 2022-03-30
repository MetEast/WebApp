export type AuthContextType = {
    isLoggedIn: boolean;
};

export type UserTokenType = {
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

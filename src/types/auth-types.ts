export type AuthContextType = {
    isLoggedIn: boolean;
};

export type UserTokenType = {
    did: string;
    name: string;
    description: string;
    avatar: string;
    exp: number;
    iat: number;
}
export type AuthContextType = {
    isLoggedIn: boolean;
};

export type UserTokenType = {
    did: string;
    name: string;
    description: string;
    avatar: string;
    email: string;
    exp: number;
    iat: number;
    type: string;
    canManageAdmins: boolean;
}
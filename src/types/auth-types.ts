export type AuthContextType = {
    isLoggedIn: boolean
};

export type UserTokenType = {
    did: string;
    email: string;
    exp: number;
    iat: number;
    name: string;
    type: string;
    canManageAdmins: boolean;
}
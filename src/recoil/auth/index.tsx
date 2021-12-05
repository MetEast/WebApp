import { atom } from "recoil";
import { AuthContextType } from "src/types/auth-types";

const authAtom = atom<AuthContextType>({
    key: "authAtom",
    default: {
        isLoggedIn: false
    },
});

export default authAtom;
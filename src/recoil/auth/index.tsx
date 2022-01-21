import { atom } from "recoil";
import { AuthContextType } from "src/types/auth-types";

const authAtom = atom<AuthContextType>({
    key: "authAtom",
    default: {
        isLoggedIn: (localStorage.getItem("token") !== undefined || localStorage.getItem("did")  !== undefined) ? false: true
    },
});

export default authAtom;
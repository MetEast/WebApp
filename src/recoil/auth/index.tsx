import { atom } from "recoil";
import { AuthContextType } from "src/types/auth-types";
import { Cookies } from 'react-cookie';

const cookie = new Cookies();
const authAtom = atom<AuthContextType>({
    key: "authAtom",
    default: {
        isLoggedIn: (cookie.get("token") !== undefined && cookie.get("did")  !== undefined) ? true: false
    }
});

export default authAtom;
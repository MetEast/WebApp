import { createContext } from 'react';

const UserContext = createContext({
    user: {},
    setUser: () => { },
    signOut: () => { }
});

export default UserContext;

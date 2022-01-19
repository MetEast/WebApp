import { createContext } from 'react';

const ConnectivityContext = createContext({
    isLinkedToEssentials: {},
    setIsLinkedToEssentials: () => { },
});

export default ConnectivityContext;

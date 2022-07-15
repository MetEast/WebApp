export const isProductEnv = () => {
    return process.env.REACT_APP_PUBLIC_ENV !== 'development';
};

export const apiConfig = {
    feedsELA2USDTUrl: process.env.REACT_APP_TRINITY_FEEDS_PRICE_API_URL || '',
    glideELA2USDTUrl: process.env.REACT_APP_GLIDE_FINANCE_PRICE_API_URL || '',
    eeGooglePlayLink: process.env.REACT_APP_EE_DOWNLOAD_GOOGLE_PLAY,
    eeAppStoreLink: process.env.REACT_APP_EE_DOWNLOAD_APP_STORE,
};

export const chainConfig = {
    name: isProductEnv() ? 'Elastos Main Network' : 'Elastos Test Network',
    id: isProductEnv() ? '0x14' : '0x15',
    rpcUrl: isProductEnv() ? process.env.REACT_APP_ESC_RPC_URL_MAIN_NET : process.env.REACT_APP_ESC_RPC_URL_TEST_NET,
    blockUrl: isProductEnv()
        ? process.env.REACT_APP_ESC_BLOCK_URL_MAIN_NET
        : process.env.REACT_APP_ESC_BLOCK_URL_TEST_NET,
};

export const serverConfig = {
    assistServiceUrl: isProductEnv()
        ? process.env.REACT_APP_SERVICE_URL_MAIN_NET
        : process.env.REACT_APP_SERVICE_URL_TEST_NET,
    metServiceUrl: isProductEnv()
        ? process.env.REACT_APP_BACKEND_URL_MAIN_NET
        : process.env.REACT_APP_BACKEND_URL_TEST_NET,
};

export const ipfsConfig = {
    ipfsNodeUrl: isProductEnv()
        ? process.env.REACT_APP_IPFS_NODE_URL_MAIN_NET
        : process.env.REACT_APP_IPFS_NODE_URL_TEST_NET,
    ipfsUploadUrl: isProductEnv()
        ? process.env.REACT_APP_IPFS_UPLOAD_URL_MAIN_NET
        : process.env.REACT_APP_IPFS_UPLOAD_URL_TEST_NET,
};

export const polrConfig = {
    polrServerUrl: process.env.REACT_APP_SHORTERN_SERVICE_URL,
    polrAPIKey: '2b495b2175ec5470d35482f524ac87',
};

export const contactConfig = {
    telegram: process.env.REACT_APP_METEAST_TELEGRAM,
    discord: process.env.REACT_APP_METEAST_DISCORD,
    twitter: process.env.REACT_APP_METEAST_TWITTER,
    instagram: process.env.REACT_APP_METEAST_INSTAGRAM,
    medium: process.env.REACT_APP_METEAST_MEDIUM,
    github: process.env.REACT_APP_METEAST_GITHUB,
};

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

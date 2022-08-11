import React, { useEffect, useRef, useState } from 'react';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/SignIn/ConnectDID';
import DownloadEssentials from 'src/components/SignIn/DownloadEssentials';
import jwtDecode from 'jwt-decode';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import {
    essentialsConnector,
    isUsingEssentialsConnector,
    initConnectivitySDK,
} from 'src/components/ConnectWallet/EssentialsConnectivity';
import { injected, walletconnect } from 'src/components/ConnectWallet/connectors';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getEssentialsWalletAddress,
    getEssentialsWalletBalance,
    getDidUri,
    resetWalletConnector,
    getWalletBalance,
    isInAppBrowser,
    isSupportedNetwork,
} from 'src/services/wallet';
import { enumAuthType, UserTokenType } from 'src/types/auth-types';
import { useDialogContext } from 'src/context/DialogContext';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';
import SnackMessage from 'src/components/SnackMessage';
import { login } from 'src/services/fetch';
import { blankUserToken } from 'src/constants/init-constants';
import { serverConfig, chainConfig, firebaseConfig } from 'src/config';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    getAnalytics(app);
}

export interface ComponentProps {}

const SignInDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState] = useDialogContext();
    const [cookies, setCookies, removeCookie] = useCookies(['METEAST_LINK', 'METEAST_TOKEN', 'METEAST_PROFILE']);
    const { enqueueSnackbar } = useSnackbar();
    const { activate, active, library, chainId, account } = useWeb3React<Web3Provider>();
    const [activatingConnector, setActivatingConnector] = useState<InjectedConnector | WalletConnectConnector | null>(
        null,
    );
    const [walletConnectProvider] = useState<WalletConnectProvider>(essentialsConnector.getWalletConnectProvider());
    let authType = cookies.METEAST_LINK;
    const refAccount = useRef();
    useEffect(() => {
        if (signInDlgState.walletAccounts.length) refAccount.current = signInDlgState.walletAccounts[0];
    }, [signInDlgState.walletAccounts]);

    const showSucceedSnackBar = () => {
        enqueueSnackbar('', {
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
            autoHideDuration: 3000,
            content: (key) => <SnackMessage id={key} message="Login succeed." variant="success" />,
        });
    };

    const showChainErrorSnackBar = async () => {
        enqueueSnackbar('', {
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
            autoHideDuration: 5000,
            content: (key) => (
                <SnackMessage id={key} message="Wrong network, only Elastos Smart Chain is supported" variant="error" />
            ),
        });
        await switchNetworkForMM();
    };

    const switchNetworkForMM = async () => {
        // Check if MetaMask is installed
        // MetaMask injects the global API into window.ethereum
        if (window.ethereum) {
            try {
                // check if the chain to connect to is installed
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainConfig.id }], // chainId must be in hexadecimal numbers
                });
            } catch (error: any) {
                // This error code indicates that the chain has not been added to MetaMask
                // if it is not, then install it into the user MetaMask
                if (error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: chainConfig.id,
                                    chainName: chainConfig.name,
                                    nativeCurrency: {
                                        name: 'Elastos',
                                        symbol: 'ELA', // 2-6 characters long
                                        decimals: 18,
                                    },
                                    rpcUrls: [chainConfig.rpcUrl],
                                    blockExplorerUrls: [chainConfig.blockUrl],
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error(addError);
                    }
                }
                console.error(error);
            }
        } else {
            // if no window.ethereum then MetaMask is not installed
            alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
        }
    };

    // ------------------------------ MM Connection ------------------------------ //
    const signInWithWallet = async (wallet: enumAuthType) => {
        await switchNetworkForMM();
        let currentConnector: any = null;
        if (wallet === enumAuthType.MetaMask) {
            currentConnector = injected;
            await activate(currentConnector);
        } else if (wallet === enumAuthType.WalletConnect) {
            currentConnector = walletconnect;
            resetWalletConnector(currentConnector);
            await activate(currentConnector);
        }
        const retAddress = await currentConnector?.getAccount();
        const injectedWeb3 = new Web3(currentConnector.getProvider());
        const checkSumAddress = injectedWeb3.utils.toChecksumAddress(retAddress);
        if (checkSumAddress) {
            let unmounted = false;
            login(wallet, checkSumAddress)
                .then((token: string) => {
                    console.log(token);
                    if (!unmounted && token) {
                        if (currentConnector === injected) {
                            authType = enumAuthType.MetaMask;
                        } else if (currentConnector === walletconnect) {
                            authType = enumAuthType.WalletConnect;
                        }
                        setActivatingConnector(currentConnector);
                        setCookies('METEAST_LINK', authType, { path: '/', sameSite: 'none', secure: true });
                        setCookies('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                        const user: UserTokenType = jwtDecode(token);
                        console.log('Sign in with MM: setting user to:', user);

                        setSignInDlgState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.isLoggedIn = true;
                            _state.loginType = enumAuthType.MetaMask;
                            _state.signInDlgOpened = false;
                            _state.walletAccounts = [checkSumAddress];
                            _state.token = token;
                            _state.address = user.address;
                            if (user.name) _state.userName = user.name;
                            if (user.description) _state.userDescription = user.description;
                            if (user.avatar) _state.userAvatar = user.avatar;
                            if (user.coverImage) _state.userCoverImage = user.coverImage;
                            _state.userRole = parseInt(user.role);
                            return _state;
                        });
                        if (!signInDlgState.walletAccounts.length) showSucceedSnackBar();
                    }
                })
                .catch((error) => {
                    if (!unmounted) {
                        console.log(error);
                        enqueueSnackbar(
                            `Failed to call the backend API. Check your connectivity and make sure ${serverConfig.metServiceUrl} is reachable.`,
                            { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
                        );
                        try {
                            currentConnector
                                .deactivate()
                                .then((res: any) => {})
                                .catch((e: any) => {
                                    console.log(e);
                                });
                        } catch (e) {
                            console.error('Error while trying to disconnect wallet connect session', e);
                        }
                    }
                });
            return () => {
                unmounted = true;
            };
        }
    };

    const signOutWithWallet = async () => {
        if (activatingConnector !== null) activatingConnector.deactivate();
        // document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        // document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        // document.cookie += `METEAST_PROFILE=; Path=/; Expires=${new Date().toUTCString()};`;
        removeCookie('METEAST_LINK');
        removeCookie('METEAST_TOKEN');
        removeCookie('METEAST_PROFILE');
        setActivatingConnector(null);
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    // ------------------------------ EE Connection ------------------------------ //
    const signInWithEssentials = async () => {
        initConnectivitySDK();
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log('Trying to sign in using the connectivity SDK');
        try {
            presentation = await didAccess.requestCredentials({
                claims: [
                    DID.simpleIdClaim('Your name', 'name', false),
                    DID.simpleIdClaim('Your description', 'description', false),
                ],
            });
        } catch (e) {
            console.warn('Error while getting credentials', e);
            try {
                await essentialsConnector.getWalletConnectProvider().disconnect();
            } catch (e) {
                console.error('Error while trying to disconnect wallet connect session', e);
            }
            return;
        }

        if (presentation) {
            let unmounted = false;
            // const did = presentation.getHolder().getMethodSpecificId() || '';
            const walletAccounts = getEssentialsWalletAddress();
            login(enumAuthType.ElastosEssentials, walletAccounts[0], presentation)
                .then((token: string) => {
                    if (!unmounted && token) {
                        authType = enumAuthType.ElastosEssentials;
                        setCookies('METEAST_LINK', authType, { path: '/', sameSite: 'none', secure: true });
                        setCookies('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                        const user: UserTokenType = jwtDecode(token);
                        console.log('Sign in with EE: setting user to:', user);
                        setSignInDlgState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.isLoggedIn = true;
                            _state.loginType = enumAuthType.ElastosEssentials;
                            _state.userDid = user.did;
                            _state.address = user.address;
                            _state.token = token;
                            if (user.name) _state.userName = user.name;
                            if (user.description) _state.userDescription = user.description;
                            if (user.avatar) _state.userAvatar = user.avatar;
                            if (user.coverImage) _state.userCoverImage = user.coverImage;
                            _state.userRole = parseInt(user.role);
                            _state.signInDlgOpened = false;
                            if (isInAppBrowser()) {
                                const inAppProvider: any = window.elastos.getWeb3Provider();
                                _state.walletAccounts = [inAppProvider.address];
                                const inAppWeb3 = new Web3(inAppProvider as any);
                                inAppWeb3.eth.getBalance(inAppProvider.address).then((balance: string) => {
                                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                                });
                                inAppWeb3.eth.getChainId().then((chainId: number) => {
                                    _state.chainId = chainId;
                                });
                            }
                            return _state;
                        });
                        if (!signInDlgState.walletAccounts.length) showSucceedSnackBar();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(
                        `Failed to call the backend API. Check your connectivity and make sure ${serverConfig.metServiceUrl} is reachable.`,
                        { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
                    );
                    try {
                        essentialsConnector
                            .getWalletConnectProvider()
                            .disconnect()
                            .then((res) => {})
                            .catch((e) => {
                                console.log(e);
                            });
                    } catch (e) {
                        console.error('Error while trying to disconnect wallet connect session', e);
                    }
                });
            return () => {
                unmounted = true;
            };
        }
    };

    const signOutWithEssentialsWithoutRefresh = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState((prevState: SignInState) => {
            const _state = { ...prevState };
            _state.isLoggedIn = false;
            return _state;
        });
        // document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        // document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        // document.cookie += `METEAST_PROFILE=; Path=/; Expires=${new Date().toUTCString()};`;
        removeCookie('METEAST_LINK');
        removeCookie('METEAST_TOKEN');
        removeCookie('METEAST_PROFILE');
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
                await essentialsConnector.getWalletConnectProvider().disconnect();
            if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
                await window.elastos.getWeb3Provider().disconnect();
        } catch (e) {
            console.error('Error while disconnecting the wallet', e);
        }
    };

    const signOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState((prevState: SignInState) => {
            const _state = { ...prevState };
            _state.isLoggedIn = false;
            _state.loginType = enumAuthType.NotConnected;
            _state.signOut = false;
            return _state;
        });
        // document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        // document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        // document.cookie += `METEAST_PROFILE=; Path=/; Expires=${new Date().toUTCString()};`;
        removeCookie('METEAST_LINK');
        removeCookie('METEAST_TOKEN');
        removeCookie('METEAST_PROFILE');
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
                await essentialsConnector.getWalletConnectProvider().disconnect();
            if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
                await window.elastos.getWeb3Provider().disconnect();
        } catch (e) {
            console.error('Error while disconnecting the wallet', e);
        }
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    // ------------------------------ Event Listener ------------------------------ //
    useEffect(() => {
        // EE
        const handleEEAccountsChanged = (accounts: string[]) => {
            // change user role
            const previousAccount = refAccount.current;
            if (previousAccount && accounts.length && previousAccount !== accounts[0]) {
                signInWithEssentials();
            }
            getEssentialsWalletBalance().then((balance: string) => {
                setSignInDlgState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.walletAccounts = accounts;
                    _state.walletBalance = parseFloat((parseInt(balance) / 1e18).toFixed(2));
                    return _state;
                });
            });
        };
        const handleEEChainChanged = (chainId: number) => {
            setSignInDlgState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.chainId = chainId;
                return _state;
            });
            if (chainId && !isSupportedNetwork(chainId)) showChainErrorSnackBar();
        };
        const handleEEDisconnect = (code: number, reason: string) => {
            console.log('Disconnect code: ', code, ', reason: ', reason);
            signOutWithEssentials();
        };
        const handleEEError = (code: number, reason: string) => {
            console.error(code, reason);
        };

        if (isInAppBrowser()) {
            setSignInDlgState((prevState: SignInState) => {
                const _state = { ...prevState };
                const inAppProvider: any = window.elastos.getWeb3Provider();
                _state.walletAccounts = [inAppProvider.address];
                const inAppWeb3 = new Web3(inAppProvider as any);
                inAppWeb3.eth.getBalance(inAppProvider.address).then((balance: string) => {
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                });
                inAppWeb3.eth.getChainId().then((chainId: number) => {
                    _state.chainId = chainId;
                    if (chainId && !isSupportedNetwork(chainId)) showChainErrorSnackBar();
                });
                return _state;
            });
        } else {
            // Subscribe to accounts change
            walletConnectProvider.on('accountsChanged', handleEEAccountsChanged);
            // Subscribe to chainId change
            walletConnectProvider.on('chainChanged', handleEEChainChanged);
            // Subscribe to session disconnection
            walletConnectProvider.on('disconnect', handleEEDisconnect);
            // Subscribe to session disconnection
            walletConnectProvider.on('error', handleEEError);
        }
        // MM
        if (authType === undefined) {
            if (active) {
                // alert('new sign in');
                if (account) {
                    // change user role
                    const timer = setTimeout(() => {
                        getWalletBalance(library, account).then((balance: string) => {
                            setSignInDlgState((prevState: SignInState) => {
                                const _state = { ...prevState };
                                _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                                clearTimeout(timer);
                                return _state;
                            });
                        });
                    }, 100);
                }
            } else {
                // alert('log out');
            }
        } else if (authType === enumAuthType.MetaMask) {
            if (!active) {
                if (activatingConnector !== null) {
                    // alert('disconnect');
                    signOutWithWallet();
                } else {
                    // alert('refresh');
                    const timer = setTimeout(async () => {
                        if (authType === enumAuthType.MetaMask) {
                            setActivatingConnector(injected);
                            await activate(injected);
                        } else if (authType === enumAuthType.WalletConnect) {
                            setActivatingConnector(walletconnect);
                            await activate(walletconnect);
                        }
                        clearTimeout(timer);
                    }, 0);
                }
            } else {
                if (library) {
                    // alert('library');
                    let token = cookies.METEAST_TOKEN;
                    const user: UserTokenType = jwtDecode(token);
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.chainId = chainId || 0;
                        _state.walletAccounts = account ? [account] : [];
                        _state.isLoggedIn = true;
                        _state.loginType = enumAuthType.MetaMask;
                        _state.userDid = user.did;
                        _state.address = user.address;
                        _state.token = token;
                        if (user.name) _state.userName = user.name;
                        if (user.description) _state.userDescription = user.description;
                        if (user.avatar) _state.userAvatar = user.avatar;
                        if (user.coverImage) _state.userCoverImage = user.coverImage;
                        _state.userRole = parseInt(user.role);

                        return _state;
                    });
                    if (account) {
                        // change user role
                        if (
                            signInDlgState.walletAccounts.length &&
                            account &&
                            signInDlgState.walletAccounts[0] !== account
                        ) {
                            signInWithWallet(enumAuthType.MetaMask);
                        }
                        // must be placed here
                        getWalletBalance(library, account).then((balance: string) => {
                            setSignInDlgState((prevState: SignInState) => {
                                const _state = { ...prevState };
                                _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                                return _state;
                            });
                        });
                    }
                } else {
                    // alert('no library');
                }
            }
        }
        if (chainId && !isSupportedNetwork(chainId)) {
            showChainErrorSnackBar();
        }
        return () => {
            if (walletConnectProvider.removeListener) {
                walletConnectProvider.removeListener('accountsChanged', handleEEAccountsChanged);
                walletConnectProvider.removeListener('chainChanged', handleEEChainChanged);
                walletConnectProvider.removeListener('disconnect', handleEEDisconnect);
                walletConnectProvider.removeListener('error', handleEEError);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletConnectProvider, chainId, account, active, library]);

    // signInDlgContext track
    useEffect(() => {
        const user: UserTokenType = cookies.METEAST_TOKEN ? jwtDecode(cookies.METEAST_TOKEN) : blankUserToken;
        getDidUri(user.did, user.description, user.name).then((didUri: string) => {
            setSignInDlgState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.token = cookies.METEAST_TOKEN;
                _state.didUri = didUri;
                _state.userDid = user.did;
                _state.address = user.address;
                _state.userName = user.name ? user.name : '';
                _state.userDescription = user.description ? user.description : '';
                _state.userAvatar = user.avatar ? user.avatar : '';
                _state.userCoverImage = user.coverImage ? user.coverImage : '';
                _state.userRole = parseInt(user.role);
                return _state;
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cookies.METEAST_TOKEN]);

    // listen for disconnect
    useEffect(() => {
        if (signInDlgState.isLoggedIn && signInDlgState.signOut) {
            if (signInDlgState.loginType === enumAuthType.ElastosEssentials) signOutWithEssentials();
            else signOutWithWallet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInDlgState]);

    // update wallet balance after every transactions
    useEffect(() => {
        if (authType === enumAuthType.ElastosEssentials) {
            getEssentialsWalletBalance().then((balance: string) => {
                setSignInDlgState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    return _state;
                });
            });
        } else {
            setSignInDlgState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.chainId = chainId || 0;
                if (!account) _state.walletBalance = 0;
                else
                    getWalletBalance(library, account).then((balance: string) => {
                        _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    });
                return _state;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        library,
        dialogState.createNFTDlgStep,
        dialogState.buyNowDlgStep,
        dialogState.changePriceDlgStep,
        dialogState.cancelSaleDlgStep,
        dialogState.acceptBidDlgStep,
        dialogState.placeBidDlgStep,
        dialogState.updateBidDlgStep,
        dialogState.cancelBidDlgStep,
        dialogState.createBlindBoxDlgStep,
        dialogState.buyBlindBoxDlgStep,
    ]);

    if (authType === enumAuthType.ElastosEssentials) initConnectivitySDK();

    return (
        <>
            <ModalDialog
                open={signInDlgState.signInDlgOpened}
                onClose={() => {
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.signInDlgOpened = false;
                        return _state;
                    });
                }}
            >
                <ConnectDID
                    onConnect={async (wallet: enumAuthType) => {
                        if (wallet === enumAuthType.ElastosEssentials) {
                            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                                await signOutWithEssentialsWithoutRefresh();
                                await signInWithEssentials();
                            } else {
                                await signInWithEssentials();
                            }
                        } else signInWithWallet(wallet);
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={signInDlgState.downloadEssentialsDlgOpened}
                onClose={() => {
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.downloadEssentialsDlgOpened = false;
                        return _state;
                    });
                }}
            >
                <DownloadEssentials />
            </ModalDialog>
        </>
    );
};

export default SignInDlgContainer;

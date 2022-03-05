import React, { useEffect, useState } from 'react';
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
    getEssentialsWalletBalance,
    getDidUri,
    resetWalletConnector,
    getWalletBalance,
    isInAppBrowser,
} from 'src/services/wallet';
import { UserTokenType } from 'src/types/auth-types';
import { useDialogContext } from 'src/context/DialogContext';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';

export interface ComponentProps {}

const SignInDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState] = useDialogContext();
    const [linkCookies, setLinkCookie] = useCookies(['METEAST_LINK']);
    const [didCookies, setDidCookie] = useCookies(['METEAST_DID']);
    const [tokenCookies, setTokenCookie] = useCookies(['METEAST_TOKEN']);
    const { enqueueSnackbar } = useSnackbar();
    // for signInContext
    const { connector, activate, deactivate, active, error, library, chainId, account } = useWeb3React<Web3Provider>();
    const [activatingConnector, setActivatingConnector] = useState<InjectedConnector | WalletConnectConnector | null>(
        null,
    );
    const [walletConnectProvider] = useState<WalletConnectProvider>(essentialsConnector.getWalletConnectProvider());
    // const [walletConnectProvider] = useState<WalletConnectProvider>(
    //     isInAppBrowser() ? window.elastos.getWeb3Provider() : essentialsConnector.getWalletConnectProvider(),
    // );

    const [_signInState, _setSignInState] = useState<SignInState>(signInDlgState);
    let linkType = linkCookies.METEAST_LINK;

    // ------------------------------ MM Connection ------------------------------ //
    const signInWithWallet = async (wallet: string) => {
        let currentConnector: any = null;
        if (wallet === 'MM') {
            currentConnector = injected;
            await activate(currentConnector);
        } else if (wallet === 'WC') {
            currentConnector = walletconnect;
            resetWalletConnector(currentConnector);
            await activate(currentConnector);
        }
        const retAddress = await currentConnector?.getAccount();
        if (retAddress !== undefined && retAddress !== null) {
            const reqBody = {
                isMetaMask: 1,
                did: retAddress,
                name: '',
                avatar: '',
                description: '',
            };
            fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        if (currentConnector === injected) {
                            setLinkCookie('METEAST_LINK', '2');
                            linkType = 2;
                        } else if (currentConnector === walletconnect) {
                            setLinkCookie('METEAST_LINK', '3');
                            linkType = 3;
                        }
                        setActivatingConnector(currentConnector);
                        const token = data.token;
                        setLinkCookie('METEAST_LINK', linkType, { path: '/', sameSite: 'none', secure: true });
                        setTokenCookie('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                        setDidCookie('METEAST_DID', retAddress, { path: '/', sameSite: 'none', secure: true });
                        const user: UserTokenType = jwtDecode(token);
                        console.log('Sign in with MM: setting user to:', user);
                        _setSignInState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.isLoggedIn = true;
                            _state.loginType = '2';
                            _state.signInDlgOpened = false;
                            _state.walletAccounts = [retAddress];
                            _state.userDid = user.did;
                            if (user.name !== '' && user.name !== undefined) _state.userName = user.name;
                            if (user.description !== '' && user.description !== undefined) _state.userDescription = user.description;
                            if (user.avatar !== '' && user.avatar !== undefined) _state.userAvatar = user.avatar;
                            if (user.coverImage !== '' && user.coverImage !== undefined) _state.userCoverImage = user.coverImage;
                            return _state;
                        });
                        enqueueSnackbar('Login succeed.', {
                            variant: 'success',
                            anchorOrigin: { horizontal: 'right', vertical: 'top' },
                        });
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(
                        `Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL} is reachable.`,
                        { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
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
                });
        }
    };

    const signOutWithWallet = async () => {
        if (activatingConnector !== null) activatingConnector.deactivate();
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_DID=; Path=/; Expires=${new Date().toUTCString()};`;
        setActivatingConnector(null);
        window.location.reload();
    };

    const disconnectWallet = async () => {
        if (activatingConnector !== null) activatingConnector.deactivate();
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_DID=; Path=/; Expires=${new Date().toUTCString()};`;
        setActivatingConnector(null);
    };

    // ------------------------------ EE Connection ------------------------------ //
    useEffect(() => {
        if (isInAppBrowser()) {
            _setSignInState((prevState: SignInState) => {
                const _state = { ...prevState };
                const inAppProvider: any = window.elastos.getWeb3Provider();
                _state.walletAccounts = [inAppProvider.address];
                const inAppWeb3 = new Web3(inAppProvider as any);
                inAppWeb3.eth.getBalance(inAppProvider.address).then((balance: string) => {
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                });
                inAppWeb3.eth.getChainId().then((chainId: number) => {
                    _state.chainId = chainId;
                });
                return _state;
            });
        } else {
            // Subscribe to accounts change
            walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
                getEssentialsWalletBalance().then((balance: string) => {
                    _setSignInState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.walletAccounts = accounts;
                        _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                        return _state;
                    });
                });
            });

            // Subscribe to chainId change
            walletConnectProvider.on('chainChanged', (chainId: number) => {
                _setSignInState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.chainId = chainId;
                    return _state;
                });
            });

            // Subscribe to session disconnection
            walletConnectProvider.on('disconnect', (code: number, reason: string) => {
                signOutWithEssentials();
            });

            // Subscribe to session disconnection
            walletConnectProvider.on('error', (code: number, reason: string) => {
                console.error(code, reason);
            });
        }

        if (linkType === undefined) {
            if (active) {
                // alert('new sign in');
                if (account) {
                    const timer = setTimeout(() => {
                        getWalletBalance(library, account).then((balance: string) => {
                            _setSignInState((prevState: SignInState) => {
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
        } else if (linkType === '2') {
            if (!active) {
                if (activatingConnector !== null) {
                    // alert('disconnect');
                    signOutWithWallet();
                } else {
                    // alert('refresh');
                    const timer = setTimeout(async () => {
                        if (linkType === '2') {
                            setActivatingConnector(injected);
                            await activate(injected);
                        } else if (linkType === '3') {
                            setActivatingConnector(walletconnect);
                            await activate(walletconnect);
                        }
                        clearTimeout(timer);
                    }, 0);
                }
            } else {
                if (library) {
                    // alert('library');
                    _setSignInState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.chainId = chainId || 0;
                        _state.walletAccounts = account ? [account] : [];
                        return _state;
                    });
                    if (account) {
                        // must be placed here
                        getWalletBalance(library, account).then((balance: string) => {
                            _setSignInState((prevState: SignInState) => {
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
    }, [walletConnectProvider, chainId, account, active, library]);

    // update wallet balance after every transactions
    useEffect(() => {
        if (linkType === '1') {
            getEssentialsWalletBalance().then((balance: string) => {
                _setSignInState((prevState: SignInState) => {
                    const _state = { ...prevState };
                    _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    return _state;
                });
            });
        } else {
            _setSignInState((prevState: SignInState) => {
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
    }, [
        dialogState.createNFTDlgStep,
        dialogState.buyNowDlgStep,
        dialogState.placeBidDlgStep,
        dialogState.updateBidDlgStep,
        dialogState.cancelBidDlgStep,
        dialogState.acceptBidDlgStep,
        dialogState.changePriceDlgStep,
        dialogState.cancelSaleDlgStep,
        dialogState.buyBlindBoxDlgStep,
    ]);

    // signInDlgContext track
    useEffect(() => {
        const userInfo: UserTokenType =
            tokenCookies.METEAST_TOKEN === undefined
                ? { did: '', name: '', description: '', avatar: '', coverImage: '', exp: 0, iat: 0 }
                : jwtDecode(tokenCookies.METEAST_TOKEN);
        getDidUri(didCookies.METEAST_DID, '', userInfo.name).then((didUri: string) => {
            setSignInDlgState({ ..._signInState, didUri: didUri });
        });
    }, [_signInState]);

    // listen for disconnect
    useEffect(() => {
        if (signInDlgState.isLoggedIn) {
            if (signInDlgState.signOut) {
                if (signInDlgState.loginType === '1') signOutWithEssentials();
                else if (signInDlgState.loginType === '2') signOutWithWallet();
            } else if (signInDlgState.disconnectWallet) {
                if (signInDlgState.loginType === '1') disconnectEssentials();
                else if (signInDlgState.loginType === '2') disconnectWallet();
            }
        }
    }, [signInDlgState]);

    useEffect(() => {
        console.log('--------accounts: ', signInDlgState, tokenCookies.METEAST_TOKEN);
    }, [signInDlgState]);

    if (linkType === '1') initConnectivitySDK();

    const signInWithEssentials = async () => {
        initConnectivitySDK();
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log('Trying to sign in using the connectivity SDK');
        try {
            // presentation = await didAccess.getCredentials({
            //     claims: {
            //         name: false,
            //         avatar: {
            //             required: false,
            //             reason: 'For test',
            //         },
            //         description: {
            //             required: false,
            //             reason: 'For test',
            //         },
            //     },
            // });
            presentation = await didAccess.requestCredentials({
                claims: [
                    DID.simpleIdClaim('Your name', 'name', false),
                    DID.simpleIdClaim('Your description', 'description', false),
                    DID.simpleIdClaim('Your avatar', 'avatar', false),
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
            const did = presentation.getHolder().getMethodSpecificId() || '';
            fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(presentation.toJSON()),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        const token = data.token;
                        linkType = '1';
                        setLinkCookie('METEAST_LINK', '1', { path: '/', sameSite: 'none', secure: true });
                        setTokenCookie('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                        setDidCookie('METEAST_DID', did, { path: '/', sameSite: 'none', secure: true });
                        const user: UserTokenType = jwtDecode(token);
                        console.log('Sign in with EE: setting user to:', user);
                        _setSignInState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.isLoggedIn = true;
                            _state.loginType = '1';
                            _state.userDid = user.did;
                            if (user.name !== '' && user.name !== undefined) _state.userName = user.name;
                            if (user.description !== '' && user.description !== undefined) _state.userDescription = user.description;
                            if (user.avatar !== '' && user.avatar !== undefined) _state.userAvatar = user.avatar;
                            if (user.coverImage !== '' && user.coverImage !== undefined) _state.userCoverImage = user.coverImage;
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
                        enqueueSnackbar('Login succeed.', {
                            variant: 'success',
                            anchorOrigin: { horizontal: 'right', vertical: 'top' },
                        });
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar(
                        `Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL} is reachable.`,
                        { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' } },
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
        }
    };

    const signOutWithEssentialsWithoutRefresh = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_DID=; Path=/; Expires=${new Date().toUTCString()};`;
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                await essentialsConnector.getWalletConnectProvider().disconnect();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const signOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false, loginType: '', signOut: false });
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_DID=; Path=/; Expires=${new Date().toUTCString()};`;
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                await essentialsConnector.getWalletConnectProvider().disconnect();
            }
        } catch (e) {
            console.log(e);
        }
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    const disconnectEssentials = async () => {
        console.log('Disconnect wallet.');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false, disconnectWallet: false });
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                await essentialsConnector.disconnectWalletConnect();
            }
        } catch (e) {
            console.log(e);
        }
    };

    // const signOutWithEssentials = async () => {
    //     removeDidCookie('METEAST_DID');
    //     removeTokenCookie('METEAST_TOKEN');
    //     try {
    //         setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
    //         if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession())
    //             await essentialsConnector.disconnectWalletConnect();
    //         if (isInAppBrowser() && (await window.elastos.getWeb3Provider().isConnected()))
    //             await window.elastos.getWeb3Provider().disconnect();
    //     } catch (error) {
    //         console.error('Error while disconnecting the wallet', error);
    //     }
    // };

    return (
        <>
            <ModalDialog
                open={signInDlgState.signInDlgOpened}
                onClose={() => {
                    setSignInDlgState({ ...signInDlgState, signInDlgOpened: false });
                }}
            >
                <ConnectDID
                    onConnect={async (wallet: string) => {
                        if (wallet === 'EE') {
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
                    setSignInDlgState({ ...signInDlgState, downloadEssentialsDlgOpened: false });
                }}
            >
                <DownloadEssentials />
            </ModalDialog>
        </>
    );
};

export default SignInDlgContainer;

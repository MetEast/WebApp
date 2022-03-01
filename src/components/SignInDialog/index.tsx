import React, { useEffect, useState } from 'react';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
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
import { isInAppBrowser } from 'src/services/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEssentialsWalletBalance, getDidUri, resetWalletConnector, getWalletBalance } from 'src/services/wallet';
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

    const [_signInState, _setSignInState] = useState<SignInState>(signInDlgState);

    const signInWithWallet = async (wallet: string) => {
        let currentConnector = null;
        if (wallet === 'MM') {
            currentConnector = injected;
            await activate(currentConnector);
        } else if (wallet === 'WC') {
            currentConnector = walletconnect;
            resetWalletConnector(currentConnector);
            await activate(currentConnector);
        }
        const retAddress = await currentConnector?.getAccount();
        if (retAddress !== undefined) {
            console.log('loged in');
            if (currentConnector === injected) {
                setLinkCookie('METEAST_LINK', '2');
            } else if (currentConnector === walletconnect) {
                setLinkCookie('METEAST_LINK', '3');
            }
            setActivatingConnector(currentConnector);
            _setSignInState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.isLoggedIn = true;
                _state.loginType = '1';
                _state.signInDlgOpened = false;
                return _state;
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

    // ------------------------------ EE Connection ------------------------------ //
    useEffect(() => {
        if (linkCookies.METEAST_LINK === '1') {
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
        } else if (linkCookies.METEAST_LINK === '2' && library) {
            _setSignInState((prevState: SignInState) => {
                const _state = { ...prevState };
                _state.isLoggedIn = active;
                _state.chainId = chainId || -1;
                _state.walletAccounts = account ? [account] : [];
                if (!account) _state.walletBalance = 0;
                else
                    getWalletBalance(library, account).then((balance: string) => {
                        _state.walletBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                    });
                return _state;
            });
        }
    }, [walletConnectProvider, chainId, account, active]);

    // update wallet balance after every transactions
    useEffect(() => {
        if (linkCookies.METEAST_LINK === '1') {
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
                _state.chainId = chainId || -1;
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
                ? { did: '', email: '', exp: 0, iat: 0, name: '', type: '', canManageAdmins: false }
                : jwtDecode(tokenCookies.METEAST_TOKEN);
        getDidUri(didCookies.METEAST_DID, '', userInfo.name).then((didUri: string) => {
            setSignInDlgState({ ..._signInState, didUri: didUri });
        });
    }, [_signInState]);

    // listen for disconnect
    useEffect(() => {
        if (signInDlgState.signOut && signInDlgState.isLoggedIn) {
            if (signInDlgState.loginType === '1') signOutWithEssentials();
            else if (signInDlgState.loginType === '2') signOutWithWallet();
        }
    }, [signInDlgState.signOut]);

    useEffect(() => {
        console.log('--------accounts: ', signInDlgState, tokenCookies.METEAST_TOKEN);
    }, [signInDlgState]);

    if (linkCookies.METEAST_LINK === '1') initConnectivitySDK();

    const signInWithEssentials = async () => {
        initConnectivitySDK();
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log('Trying to sign in using the connectivity SDK');
        try {
            presentation = await didAccess.requestCredentials({
                claims: [DID.simpleIdClaim('Your name', 'name', false)],
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
                        setLinkCookie('METEAST_LINK', '1', { path: '/', sameSite: 'none', secure: true });
                        setTokenCookie('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                        setDidCookie('METEAST_DID', did, { path: '/', sameSite: 'none', secure: true });
                        const user = jwtDecode(token);
                        console.log('Sign in: setting user to:', user);
                        _setSignInState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.isLoggedIn = true;
                            _state.loginType = '1';
                            _state.signInDlgOpened = false;
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
    );
};

export default SignInDlgContainer;

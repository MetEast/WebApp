import React, { useEffect, useState } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
import jwtDecode from 'jwt-decode';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import {
    essentialsConnector,
    isUsingEssentialsConnector,
    useConnectivitySDK,
} from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { isInAppBrowser } from 'src/services/common';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEssentialsWalletBalance, getDidUri } from 'src/services/essential';
import { UserTokenType } from 'src/types/auth-types';
import { useDialogContext } from 'src/context/DialogContext';
import { isEmpty } from '@elastosfoundation/did-js-sdk/typings/utils';

export interface ComponentProps {}

const SignInDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState] = useDialogContext();
    const [didCookies, setDidCookie] = useCookies(['METEAST_DID']);
    const [tokenCookies, setTokenCookie] = useCookies(['METEAST_TOKEN']);
    const { enqueueSnackbar } = useSnackbar();
    const [walletConnectProvider] = useState<WalletConnectProvider>(essentialsConnector.getWalletConnectProvider());
    // for signInContext
    const [_chainId, _setChainId] = useState<number>(signInDlgState.chainId);
    const [_accounts, _setAccounts] = useState<string[]>(signInDlgState.walletAccounts);
    const [_balance, _setBalance] = useState<number>(signInDlgState.walletBalance);
    const [_isLoggedIn, _setIsLoggedIn] = useState<boolean>(signInDlgState.isLoggedIn);
    const [_dlgOpened, _setDlgOpened] = useState<boolean>(signInDlgState.signInDlgOpened);

    useEffect(() => {
        // Subscribe to accounts change
        walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
            _setAccounts(accounts);
            console.log(accounts);
            getEssentialsWalletBalance().then((balance: string) => {
                _setBalance(parseFloat((parseFloat(balance) / 1e18).toFixed(2)));
                console.log(balance);
            });
        });

        // Subscribe to chainId change
        walletConnectProvider.on('chainChanged', (chainId: number) => {
            _setChainId(chainId);
            console.log(chainId);
        });

        // Subscribe to session disconnection
        walletConnectProvider.on('disconnect', (code: number, reason: string) => {
            signOutWithEssentials();
        });

        // Subscribe to session disconnection
        walletConnectProvider.on('error', (code: number, reason: string) => {
            console.error(code, reason);
        });
    }, [walletConnectProvider]);

    // wallet balance track
    useEffect(() => {
        getEssentialsWalletBalance().then((balance: string) => {
            _setBalance(parseFloat((parseFloat(balance) / 1e18).toFixed(2)));
            console.log(balance);
        });
    }, [
        dialogState.createNFTDlgStep,
        dialogState.buyNowDlgStep,
        dialogState.placeBidDlgStep,
        dialogState.updateBidDlgStep,
        dialogState.cancelBidDlgStep,
        dialogState.acceptBidDlgStep,
        dialogState.changePriceDlgStep,
        dialogState.cancelSaleDlgStep,
        dialogState.buyBlindBoxDlgStep
    ]);

    // signInDlgContext track
    useEffect(() => {
        const userInfo: UserTokenType =
            tokenCookies.METEAST_TOKEN === undefined
                ? { did: '', email: '', exp: 0, iat: 0, name: '', type: '', canManageAdmins: false }
                : jwtDecode(tokenCookies.METEAST_TOKEN);
        getDidUri(didCookies.METEAST_DID, '', userInfo.name).then((didUri: string) => {
            console.log(didUri);
            setSignInDlgState({
                ...signInDlgState,
                walletAccounts: _accounts,
                walletBalance: _balance,
                chainId: _chainId,
                didUri: didUri,
                isLoggedIn: _isLoggedIn,
                signInDlgOpened: _dlgOpened,
            });
        });
    }, [_chainId, _accounts, _balance, _isLoggedIn, _dlgOpened]);

    useConnectivitySDK();

    const signInWithEssentials = async () => {
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log('Trying to sign in using the connectivity SDK');
        try {
            presentation = await didAccess.requestCredentials({
                claims: [DID.simpleIdClaim('Your name', 'name', false)],
            });
        } catch (e) {
            // Possible exception while using wallet connect (i.e. not an identity wallet)
            // Kill the wallet connect session
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
                        setTokenCookie('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                        setDidCookie('METEAST_DID', did, { path: '/', sameSite: 'none', secure: true });
                        const user = jwtDecode(token);
                        console.log('Sign in: setting user to:', user);
                        _setIsLoggedIn(true);
                        _setDlgOpened(false);
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
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
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
                onConnect={async () => {
                    if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                        await signOutWithEssentialsWithoutRefresh();
                        await signInWithEssentials();
                    } else {
                        await signInWithEssentials();
                    }
                }}
            />
        </ModalDialog>
    );
};

export default SignInDlgContainer;

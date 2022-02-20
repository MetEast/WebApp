import React, { useEffect } from 'react';
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

export interface ComponentProps {}

const SignInDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(['METEAST_DID']);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(['METEAST_TOKEN']);
    const userInfo: UserTokenType = jwtDecode(tokenCookies.METEAST_TOKEN);
    const { enqueueSnackbar } = useSnackbar();

    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    
    useEffect(() => {
        // Subscribe did uri
        getDidUri(didCookies.METEAST_DID, '', userInfo.name).then((didUri) => {
            setSignInDlgState({ ...signInDlgState, didUri: didUri });
            console.log(didUri);
        });

        // Subscribe to accounts change
        walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
            getEssentialsWalletBalance().then((balance: string) => {
                setSignInDlgState({ ...signInDlgState, walletAccounts: accounts, walletBalance: parseFloat((parseFloat(balance)  / 1e18).toFixed(2)) });
                console.log(accounts);
            });
        });

        // Subscribe to chainId change
        walletConnectProvider.on('chainChanged', (chainId: number) => {
            setSignInDlgState({ ...signInDlgState, chainId: chainId });
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
                await walletConnectProvider.disconnect();
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
                        setSignInDlgState({ ...signInDlgState, isLoggedIn: true, signInDlgOpened: false });
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
                });
        }
    };

    const signOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        removeTokenCookie('METEAST_TOKEN');
        removeDidCookie('METEAST_DID');
        setSignInDlgState({...signInDlgState, isLoggedIn: false});
        try {
            await essentialsConnector.disconnectWalletConnect();
        }
        catch (e) {
            console.log(e);
        } 
        if(location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
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
            <ConnectDID onConnect={async () => {
                if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                    await signOutWithEssentials();
                    await signInWithEssentials();
                } else {
                    await signInWithEssentials();
                }
            }} />
        </ModalDialog>
    );
};

export default SignInDlgContainer;

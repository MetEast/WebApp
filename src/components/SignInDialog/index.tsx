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
} from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { isInAppBrowser } from 'src/services/common';

export interface ComponentProps {}

const SignInDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(['METEAST_DID']);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(['METEAST_TOKEN']);
    const { enqueueSnackbar } = useSnackbar();
    const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();

    useEffect(() => {
        // prevent sign-in again after page refresh
        if (
            tokenCookies.METEAST_TOKEN !== undefined &&
            didCookies.METEAST_DID !== undefined &&
            signInDlgState.isLoggedIn === false
        ) {
            setSignInDlgState({ ...signInDlgState, isLoggedIn: true });
        }
    }, [didCookies, tokenCookies]);

    useConnectivitySDK();

    const SignInWithEssentials = async () => {
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
                        window.location.reload();
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
            <ConnectDID onConnect={SignInWithEssentials} />
        </ModalDialog>
    );
};

export default SignInDlgContainer;

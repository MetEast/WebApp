import React, { useState } from 'react';
import authAtom from 'src/recoil/auth';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import ModalDialog from 'src/components/ModalDialog';
import ConnectDID from 'src/components/profile/ConnectDID';
// import ChooseWallet from 'src/components/profile/ChooseWallet';
import jwtDecode from 'jwt-decode';
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { essentialsConnector, useConnectivitySDK } from 'src/components/ConnectWallet/EssentialConnectivity';

const LoginPage: React.FC = (): JSX.Element => {
    const [showModal, setShowModal] = useState<boolean>(true);
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    
    useConnectivitySDK();
    
    const handleWalletConnection = async () => {
        const didAccess = new DID.DIDAccess();
        let presentation;
        console.log("Trying to sign in using the connectivity SDK");
        try {
          presentation = await didAccess.requestCredentials({
            claims: [
              DID.simpleIdClaim("Your name", "name", false)
            ]
          });
          console.log("presentation: ", presentation);
        } catch (e) {
          // Possible exception while using wallet connect (i.e. not an identity wallet)
          // Kill the wallet connect session
          console.warn("Error while getting credentials", e);

          try {
            alert("dberror");
            await essentialsConnector.getWalletConnectProvider().disconnect();
          }
          catch (e) {
            console.error("Error while trying to disconnect wallet connect session", e);
          }

          return;
        }

        if (presentation) {
            const did = presentation.getHolder().getMethodSpecificId() || "";
            fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:3006"}/api/v1/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(presentation.toJSON())
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                  const token = data.data;
  
                  localStorage.setItem("did", did);
                  localStorage.setItem("token", token);
  
                  const user = jwtDecode(token);
                  //
                  
                  console.log("Sign in: setting user to:", user);
                  // setUser(user);
                  setShowModal(false)
                  setAuth({isLoggedIn: true});
                  navigate('/profile');
                } else {
                  console.log(data);
                }
              }).catch((error) => {
                console.log(error);
                // showToast(`Failed to call the backend API. Check your connectivity and make sure ${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"} is reachable`, "error");
              })
          }
    };

    // const logIn = async() => {
    //   setShowModal(false)
    //   await setAuth({isLoggedIn: true});
    //   navigate('/profile');
    // };
    
    return (
        <ModalDialog
            open={showModal}
            onClose={() => {
                setShowModal(false);
            }}
        >
            <ConnectDID onConnect={handleWalletConnection} />
        </ModalDialog>
    );
};

export default LoginPage;

// import { useWeb3React } from '@web3-react/core';
// import { Web3Provider } from '@ethersproject/providers';
// import {
//     NoEthereumProviderError,
//     UserRejectedRequestError as UserRejectedRequestErrorInjected,
// } from '@web3-react/injected-connector';
// import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
// import { UnsupportedChainIdError } from '@web3-react/core';
// import { injected, walletconnect, walletlink } from 'src/components/ConnectWalletButton/connectors';
// import { useEagerConnect, useInactiveListener } from 'src/components/ConnectWalletButton/hook';

// function getErrorMessage(error: Error) {
//     if (error instanceof NoEthereumProviderError) {
//         return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
//     } else if (error instanceof UnsupportedChainIdError) {
//         return "You're connected to an unsupported network.";
//     } else if (
//         error instanceof UserRejectedRequestErrorInjected ||
//         error instanceof UserRejectedRequestErrorWalletConnect
//     ) {
//         return 'Please authorize this website to access your Ethereum account.';
//     } else {
//         return 'An unknown error occurred. Check the console for more details.';
//     }
// }

// const ProfilePage: React.FC = (): JSX.Element => {
//     const context = useWeb3React<Web3Provider>();
//     const [errors, setErrors] = useState<string[] | undefined>(undefined);
//     const { activate, active, error, library, chainId } = context;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const [activatingConnector, setActivatingConnector] = useState<any>();
//     const [showModal, setShowModal] = useState<boolean>(true);
//     //
//     const [step, setStep] = useState<number>(0);
//     const handleClick = (newStep: number) => () => {
//         setStep(newStep);
//     };
//     //
//     useEffect(() => {
//         console.log(active, library, chainId);
//         setActivatingConnector(undefined);
//         if (active) {
//             setShowModal(false);
//             setStep(2);
//         }
//         if (error) {
//             setErrors([getErrorMessage(error)]);
//         }
//     }, [active, error, library, chainId]);

//     // const triedEager = useEagerConnect();

//     // useInactiveListener(!triedEager || !!activatingConnector);

//     const handleClickConnect = async (wallet: 'walletconnect' | 'elastos' | 'metamask') => {
//         let currentConnector: any = null;
//         // if (wallet === 'metamask') currentConnector = injected;
//         // else if (wallet === 'elastos') currentConnector = walletlink;
//         // else if (wallet === 'walletconnect') currentConnector = walletconnect;
//         setActivatingConnector(currentConnector);
//         await activate(currentConnector);
//     };

//     return (
//         <>
//             {(step === 0 || step === 1) && (
//                 <ModalDialog
//                     open={showModal}
//                     onClose={() => {
//                         setShowModal(false);
//                         setStep(2);
//                     }}
//                 >
//                     {step === 0 && <ConnectDID onConnect={handleClick(1)} />}
//                     {step === 1 && <ChooseWallet onConnect={handleClickConnect} />}
//                 </ModalDialog>
//             )}
//             {step === 2 && <PrivateProfilePage />}
//         </>
//     );
// };